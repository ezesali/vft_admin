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

export function EditTourImage() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [tour, setTour] = useState({})
  const [tourImg, setTourImg] = useState({})
  const [openImg, setOpenImg] = useState(false)
  const [cities, setCities] = useState([])
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


  const [loading, setLoading] = useState(false)

    const {id} = useParams()

    const { state } = useLocation();

    useEffect(() => {

        setLoading(true)

        getTourImgData();

        setLoading(false)
    
    }, [])

    async function getTourImgData() {
        const docTourRef = doc(db, "tour_image_master",''+parseInt(id)+'')

        const docTourSnap = await getDoc(docTourRef);

        if (docTourSnap.exists()) {

            //console.log("Document data:", docUserSnap.data());

            const tourData = {
                tour_id: docTourSnap.data().tour_id,
                image: docTourSnap.data().url,
                description: docTourSnap.data().description
            }

            setTourImg(tourData)
        }
    };


    const handleClose = () => {
        setOpenImg(false)
    };

    
     const onChangeDescription = e => {
        
        e.preventDefault()

        let newTour = tourImg
        newTour.description = e.target.value

        setTourImg(newTour)

    }


    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newTour = tourImg
            newTour.image = event.target.files[0]

            setTourImg(newTour)
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const submitEdit = async() => {

        setLoadingUpdate(true)

        let imageURL = tour.image

        
        if(imageURL){

            const fileRefLarge = ref(storage, 'images/'+  imageUpload+ '.png');

            await uploadBytes(fileRefLarge, tour.image)

            imageURL = await getDownloadURL(fileRefLarge)

        }

        const docCityRef = doc(db, "tour_image_master",''+parseInt(id)+'')

        getDoc(docCityRef).then((docCitySnap) => {

            if (docCitySnap.exists()) {

                updateDoc(docCityRef, {
                    url            : imageURL,
                    description    : tourImg.description ? tourImg.description : '',
                    updatetime     : serverTimestamp()
                }).then(() =>{

                    setLoadingUpdate(false)

                    setSeverityMsg('success')
        
                    setMessageAlert('Tour Image Edited Successfully')
                    setOpenAlert(true)

                    setTimeout(() => {

                        navigate('/manage_tours/')
                        
                    }, 2000);
        
                }).catch((err) => {


                    console.log(err)
        
                    setLoadingUpdate(false)
        
                    setSeverityMsg('error')
                    setMessageAlert('An error has ocurred. Please retry')
                    setOpenAlert(true)
                    setTourImg('')
        
                    window.scrollTo(0, 0)
        
        
                });

            }

        }).catch((err) => {


            console.log(err)

            setLoadingUpdate(false)

            setSeverityMsg('error')
            setMessageAlert('An error has ocurred. Please retry')
            setOpenAlert(true)
            setTourImg('')

            window.scrollTo(0, 0)


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
                                    <Link to="/manage_tours" className="Linkp">
                                        Manage Tours
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item">
                                    <Link to={"/view_tour/"+tourImg.tour_id}  className="Linkp">
                                        View Tour
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Edit Tour Image</li>
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
                    <h4 className="editCityH4">Upload Tour Image</h4>
                </div>
                <div className="cityInputs">

                    <div className="viewImageCity">

                        <p style={{fontWeight: 500, fontSize: '14px'}}>Image</p>
                        <img
                            src={imageUpload ? imageUpload : tourImg.image ? tourImg.image : NoCity}
                            alt={''}
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src=NoCity;
                            }}
                            onClick={(e) => {setOpenImg(true)}}
                            style={{height: '100px', width: '100px', borderRadius: '100%', cursor: 'pointer', marginBottom: '20px', borderStyle: 'solid', }}/>
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
                                        src={imageUpload ? imageUpload : tourImg.image ? tourImg.image : NoCity}
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
                                Upload Tour Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleChangeCityImage} 
                                />
                            </Button>
                        </div>
                    </div>

                    <div className="cityInputs">

                        <TextField InputLabelProps={{shrink: true}} onChange={onChangeDescription} defaultValue={tourImg.description} multiline label="Description (optional)" placeholder="Enter Description" id="outlined-basic" variant="outlined" />

                    </div>
                    <button onClick={() => submitEdit()} className="btnSubmitCity" type="submit">
                        {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px'}}/> : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    </>

  );
}