import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import * as GrIcons from 'react-icons/gr';
import { useLocation, useParams} from "react-router-dom";
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
import { serverTimestamp } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

export function EditCity() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [city, setCity] = useState({})
  const [openImg, setOpenImg] = useState(false)
  const [imageUpload, setImageUpload] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  const storage = getStorage();



  const [loading, setLoading] = useState(false)

    const {id} = useParams()

    const { state } = useLocation();

    useEffect(() => {



        if (state.cityData){

            setLoading(true)

            setCity(state.cityData)

            setLoading(false)

        }
    
    }, [])

    const handleClose = () => {
        setOpenImg(false)
    };

    const onChangeCityCountry = e => {
        
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


    const onChangeDescription = e => {
        
        e.preventDefault()

        let newCity = city
        newCity.description = e.target.value


        setCity(newCity)

    }



    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newCity = city
            newCity.image = event.target.files[0]

            setCity(newCity)
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const submitEdit = async() => {

        setLoadingUpdate(true)

        let imageURL = city.image

        
        if(imageURL){

            if(imageUpload){


                const fileRefLarge = ref(storage, 'images/'+  imageUpload+ '.png');

                await uploadBytes(fileRefLarge, city.image)
    
                imageURL = await getDownloadURL(fileRefLarge);
    

            }
        }

        const docCityRef = doc(db, "city_master",''+parseInt(id)+'')

        getDoc(docCityRef).then((docCitySnap) => {

            if (docCitySnap.exists()) {


                updateDoc(docCityRef, {
                    url            : imageURL,
                    state          : city.country,
                    name           : city.city,
                    description    : city.description,
                    updatetime     : serverTimestamp()
                }).then(() =>{

                    setLoadingUpdate(false)
        
                    setMessageAlert('City Edited Successfully')
                    setOpenAlert(true)

                    window.scrollTo(0, 0)
        
                });

                //navigate('/edit_city/'+ params.row.city_id, { state: { cityData: citydata }})


            }
        });

    }

  return (
    
    <>
        {loading && <LoadingSpinner/>}
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
                                <li className="breadcrumb-item active" aria-current="page">Edit City</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
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
                    <h4 className="editCityH4">Edit City</h4>
                </div>
                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={onChangeCityCountry} defaultValue={state.cityData.country} label='Country' placeholder="Enter Country" id="outlined-basic" variant="outlined" />
                    
                </div>
                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={onChangeCityName} defaultValue={state.cityData.city} label="City" placeholder="Enter City" id="outlined-basic" variant="outlined" />
                    
                </div>
                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={onChangeDescription} defaultValue={state.cityData.description} multiline label="Description" placeholder="Enter Description" id="outlined-basic" variant="outlined" />
               
                </div>
                
                <div className="viewImageCity">

                    <p style={{fontWeight: 500, fontSize: '14px'}}>Image</p>
                    <img
                    src={imageUpload ? imageUpload : city.image ? city.image : NoCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = NoCity;
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
                                    src={imageUpload ? imageUpload : city.image ? city.image : NoCity}
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
                        style={{backgroundColor: '#F7BE07', color: '#000',borderStyle: 'dashed'}}>
                            Upload City Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleChangeCityImage}
                            />
                        </Button>
                    </div>
                </div>
                <button 
                onClick={() => submitEdit()} className="btnSubmitCity" type="submit">
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px'}}/> : 'Update'}
                </button>
                {//<button onClick={( ) => console.log(state.cityData)} className="btnSubmitCity" type="submit">Update</button>
                }
            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}