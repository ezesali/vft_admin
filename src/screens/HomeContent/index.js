import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import * as GrIcons from 'react-icons/gr';
import * as GiIcons from 'react-icons/gi';
import { useLocation, useParams} from "react-router-dom";
import {
    Modal,
    Backdrop,
    Fade,
    TextField,
  } from "@material-ui/core";


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Button } from "@mui/material";
import NoCity from '../../assets/images/noCity.jpg';
import LoadingSpinner from "../../components/Loading";
import { getDownloadURL, getStorage, ref, uploadBytes,} from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import PlacesAutocomplete, {getLatLng, geocodeByAddress} from 'react-places-autocomplete';

import { useNavigate } from "react-router-dom";

export function HomeContent() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [tour, setTour] = useState({})
  const [openImg, setOpenImg] = useState(false)
  const [cities, setCities] = useState([])
  const [homeContent, setHomeContent] = useState({})
  const [slogan, setSlogan] = useState('')
  const [imageUpload, setImageUpload] = useState('')
  const [citySelected, setCitySelected] = useState(null)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severityMsg, setSeverityMsg] = useState('')

  const [address, setAddress] = useState([])

  const [latitude, setLatitude] = useState(null)

  const [longitude, setLongitude] = useState(null)

  const navigate = useNavigate();


  const storage = getStorage();

  const docRef = query(collection(db, "home_content_master"));



  const [loading, setLoading] = useState(false)

    useEffect(() => {


        setLoading(true)

        getHomeContentData();

        setLoading(false)
    
    }, [])


    async function getHomeContentData() {

        const querySnapshot = await getDocs(docRef);

        querySnapshot.forEach((doc) => {

            const homeContentData = {
                id: doc.id,
                slogan: doc.data().slogan,
                image: doc.data().url,
            }

            setHomeContent(homeContentData)
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });
    };

    const handleClose = () => {
        setOpenImg(false)
    };


     const onChangeSlogan = e => {
        
        e.preventDefault()

        let newHomeContent = homeContent
        newHomeContent.slogan = e.target.value

        setSlogan(e.target.value)

        setHomeContent(newHomeContent)

    }


    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newHomeContent = homeContent
            newHomeContent.image = event.target.files[0]

            setHomeContent(newHomeContent)

            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const submitEdit = async() => {

        setLoadingUpdate(true)


        
        let imageURL = homeContent.image

        
        if(imageURL){

            if (imageUpload) {


                const fileRefLarge = ref(storage, 'images/'+  imageUpload+ '.png');

                await uploadBytes(fileRefLarge, homeContent.image)
    
                imageURL = await getDownloadURL(fileRefLarge);

            }

        }


        if(slogan == '' && !imageUpload) {


            setLoadingUpdate(false)

            setSeverityMsg('error')

            setMessageAlert('All Fields are required')

            setOpenAlert(true)

            window.scrollTo(0, 0)

        }

        else {


            const docCityRef = doc(db, "home_content_master",''+parseInt(homeContent.id)+'')

            getDoc(docCityRef).then((docCitySnap) => {

                if (docCitySnap.exists()) {


                    updateDoc(docCityRef, {
                        slogan         : homeContent.slogan,
                        url            : imageURL,
                        image          : imageUpload,
                        updatetime     : serverTimestamp()
                    }).then(() =>{

                        setLoadingUpdate(false)

                        setSeverityMsg('success')
            
                        setMessageAlert('Home Content Edited Successfully')
                        setOpenAlert(true)

                        window.scrollTo(0, 0)


                        setTimeout(() => {

                            navigate('/')
                            
                        }, 2000);
            
                    });

                }
            }).catch((err) => {

                setLoadingUpdate(false)

                setSeverityMsg('error')
    
                setMessageAlert('An error has ocurred. Please retry')
                setOpenAlert(true)

                window.scrollTo(0, 0)

            });
        }
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
                                <li className="breadcrumb-item active" aria-current="page">Home Content</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                severity={severityMsg}
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
                    <h4 className="editCityH4">Home Content</h4>
                </div>
                

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} required onChange={onChangeSlogan} defaultValue={homeContent.slogan} multiline label="Slogan" placeholder="Enter Slogan" id="outlined-basic" variant="outlined" />
               
                </div>
                
                <div className="viewImageCity">

                    <p style={{fontWeight: 500, fontSize: '14px'}}>Image *</p>
                    <img
                    src={imageUpload ? imageUpload : homeContent.image ? homeContent.image : NoCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src=NoCity;
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
                                    src={imageUpload ? imageUpload : homeContent.image ? homeContent.image : NoCity}
                                    alt=""
                                    onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src=NoCity;
                                    }}
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
                            Upload Home Content Image
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