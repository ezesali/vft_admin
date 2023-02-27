import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { collection, doc, getDocs, query, where, setDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";

import * as GrIcons from 'react-icons/gr';
import {
    Modal,
    Backdrop,
    Fade,
    TextField
  } from "@material-ui/core";

import { Button } from "@mui/material";
import NoCity from '../../assets/images/noCity.jpg';
import LoadingSpinner from "../../components/Loading";
import { getDownloadURL, getStorage, ref, uploadBytes,} from "firebase/storage";
import { serverTimestamp,  } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

export function AddCity() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [city, setCity] = useState({})
  const [openImg, setOpenImg] = useState(false)
  const [imageUpload, setImageUpload] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severity, setSeverity] = useState('')

  const storage = getStorage();



const docRef = query(collection(db, "city_master"));

  const [lastId, setLastId] = useState(0)



    useEffect(() => {

        getDocs(docRef).then(res => {
            setLastId(res.size)
        })
    
    }, [])

    const handleClose = () => {
        setOpenImg(false)
    };


    const onChangeCountryName = e => {
        
        e.preventDefault()

        let newCity = city
        newCity.country = e.target.value

        setCity(newCity)

    }


    const onChangeCityName = e => {
        
        e.preventDefault()

        let newCity = city
        newCity.city = e.target.value

        setCity(newCity)

    }

    const onChangeCityDescription = e => {
        
        e.preventDefault()

        let newCity = city

        newCity.description = e.target.value

        setCity(newCity)

    }


    const handleChangeImg = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newCity = city
            newCity.image = event.target.files[0]

            setCity(newCity)
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const disableButton = () => {

        if(
            city.country &&
            city.city &&
            city.description &&
            city.image 
        ){ return false}

        return true

    }


    const submitAdd = async() => {

       //db.collection("city_master").where("name","==",city).where("delete_flag","==",0).get()
       city.country = city.country.toLowerCase()
       const docRefCityExist = query(collection(db, "city_master"), where("name", "==",  (city.city.charAt(0).toUpperCase() + city.city.slice(1)) ), where("delete_flag", "==", 0));

       const querySnapshotCity = await getDocs(docRefCityExist);


       if(querySnapshotCity.size > 0){

            setSeverity('error')
            setMessageAlert('City already exists. Add another one')
            setOpenAlert(true)

            window.scrollTo(0, 0)

       }
       else{

            setLoadingUpdate(true)

            let imageURL = city.image

            if(imageURL){

                const fileRefSmall = ref(storage, 'images/'+  city.image.name+ '.png');

                await uploadBytes(fileRefSmall, city.image)

                imageURL = await getDownloadURL(fileRefSmall);

            }

            const docData = {
                city_id        : lastId+1,
                url            : imageURL,
                image          : imageUpload,
                state          : city.country.charAt(0).toUpperCase() + city.country.slice(1),
                name           : city.city.charAt(0).toUpperCase() + city.city.slice(1),
                description    : city.description,
                delete_flag    : 0,
                createtime     : serverTimestamp(),   
                updatetime     : serverTimestamp()

            }

            setDoc(doc(db, "city_master", ''+parseInt(lastId+1)+''), docData).then((res) =>{

                setLoadingUpdate(false)
    
                setSeverity('success')
                setMessageAlert('City Add Successfully')
                setOpenAlert(true)
                setCity({})

                window.scrollTo(0, 0)

            });
       }
    }

  return (
    
    <>
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '250px' : null}} className="dashboardContainerProfile">
            <div className="page-header">
                <div className="row-profile">
                    <div className="profileHead">
                        <nav aria-label="breadcrumb" role="navigation">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/" className="Linkp">
                                        Dashboard
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item">
                                    <Link to="/manage_city" className="Linkp">
                                        Manage City
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Add City</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                severity={severity}
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpenAlert(false);
                        setMessageAlert('')
                    }}
                    >
                    <GrIcons.GrClose color="#000"/>
                    </IconButton>
                }
                sx={{ mb: 2 }}

                >
                {messageAlert}
                </Alert>
            </Collapse>
            <div className="rowViewCity">
                <div className="titleCityEditAdd">
                    <h4 className="editCityH4">Add City</h4>
                </div>
                <div className="cityInputs">

                    <TextField onChange={onChangeCountryName} required label='Country' placeholder="Enter Country" id="outlined-basic" variant="outlined" />
                    
                </div>
                <div className="cityInputs">

                    <TextField  onChange={onChangeCityName} required label="City" placeholder="Enter City" id="filled-1" variant="outlined" />
                   
                </div>
                <div className="cityInputs">

                    <TextField  onChange={onChangeCityDescription} required label="Description" multiline placeholder="Enter Description" id="outlined-basic" variant="outlined" />
                    
                </div>

                <div className="viewImageCity">

                    <p style={{fontWeight: 500, fontSize: '14px'}}>City Image *</p>
                    <img
                    src={imageUpload ? imageUpload : NoCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src= NoCity;
                    }}
                    onClick={(e) => {setOpenImg(true)}}
                    style={{height: '100px', width: '100px', borderRadius: '100%', cursor: 'pointer', marginBottom: '20px', borderStyle: 'solid', }}
                    />
                    <Modal
                        open={openImg}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500
                        }}>
                        <div onClick={handleClose} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                
                            <Fade in={openImg} timeout={500} >
                                <img
                                    src={imageUpload ? imageUpload : NoCity}
                                    alt=""
                                    style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                                />
                            </Fade>
                        </div>
                    </Modal>
                    <div>
                        <Button
                        variant="contained"
                        component="label"
                        style={{backgroundColor: '#F7BE07', color: '#000', borderStyle: 'dashed'}}>
                            Upload City Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleChangeImg}
                                
                            />
                        </Button>
                    </div>
                </div>
                
                <button 
                style={disableButton() ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed'} : {backgroundColor: '#F7BE07'}} 
                disabled={disableButton()} 
                onClick={() => submitAdd()} className="btnSubmitCity" type="submit">
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Add City'}
                </button>
            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}