import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
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

export function ManageRestaurantsImages() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [restaurantImg, setRestaurantImg] = useState('')
  const [openImg, setOpenImg] = useState(false)
  const [imageUpload, setImageUpload] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severityMsg, setSeverityMsg] = useState('')
  const [restaurantImgDesc, setRestaurantImgDesc] = useState('')

  const [lastId, setLastId] = useState(null)


  const docRef = query(collection(db, "restaurant_image_master"));



  const navigate = useNavigate();


  const storage = getStorage();


  const [loading, setLoading] = useState(false)
  
  
  const {id} = useParams()


    useEffect(() => {

        getDocs(docRef).then(res => {
            setLastId(res.size)
        })
    
    }, [])



    const handleClose = () => {
        setOpenImg(false)
    };

    
     const onChangeDescription = e => {
        
        e.preventDefault()


        setRestaurantImgDesc(e.target.value)

    }


    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {

            setRestaurantImg(event.target.files[0])
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };



    const submitAdd = async() => {
        
        setLoadingUpdate(true)

        let imageURL = restaurantImg

        if(imageURL){

            const fileRefSmall = ref(storage, 'images/'+  restaurantImg.name+ '.png');

            await uploadBytes(fileRefSmall, restaurantImg)

            imageURL = await getDownloadURL(fileRefSmall);

        }

        const docData = {
            restaurant_img_id    : lastId+1,
            restaurant_id        : parseInt(id),
            url            : imageURL,
            image          : imageUpload,
            description    : restaurantImgDesc,
            delete_flag    : 0,
            createtime     : serverTimestamp(),   
            updatetime     : serverTimestamp()

        }



        setDoc(doc(db, "restaurant_image_master", ''+parseInt(lastId+1)+''), docData).then((res) =>{


            setLoadingUpdate(false)

            setSeverityMsg('success')

            setMessageAlert('Restaurant Image Edited Successfully')
            setOpenAlert(true)

            setRestaurantImg('')
            setRestaurantImgDesc('')

            window.scrollTo(0, 0)

            setTimeout(() => {

                navigate('/manage_restaurants/')
                
            }, 2000);

        }).catch((err) => {


            console.log(err)

            setLoadingUpdate(false)

            setSeverityMsg('error')
            setMessageAlert('An error has ocurred. Please retry')
            setOpenAlert(true)
            setRestaurantImg('')
            setRestaurantImgDesc('')

            window.scrollTo(0, 0)


        });

    }

    const disableButton = () => {

        if(
            restaurantImg
        ){ return false}

        return true

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
                                    <Link to="/manage_restaurants" className="Linkp">
                                        Manage Restaurants
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Upload Restaurant Image</li>
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
                    <h4 className="editCityH4">Upload Restaurant Image</h4>
                </div>
                <div className="cityInputs">

                    <div className="viewImageCity">

                        <p style={{fontWeight: 500, fontSize: '14px'}}>Image</p>
                        <img
                            src={imageUpload ? imageUpload : restaurantImg ? restaurantImg : NoCity}
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
                                        src={imageUpload ? imageUpload : restaurantImg ? restaurantImg : NoCity}
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
                                Upload Restaurant Image
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

                        <TextField InputLabelProps={{shrink: true}} onChange={onChangeDescription} defaultValue={restaurantImgDesc} multiline label="Description (optional)" placeholder="Enter Description" id="outlined-basic" variant="outlined" />

                    </div>
                    <button 
                    style={disableButton() ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed'} : {backgroundColor: '#F7BE07'}} 
                    disabled={disableButton()} 
                    onClick={() => submitAdd()} className="btnSubmitCity" type="submit">
                        {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    </>

  );
}