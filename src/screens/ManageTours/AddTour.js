import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { collection, doc, getDocs, query, where, setDoc, orderBy} from "firebase/firestore";
import { db } from "../../Auth/firebase";

import * as GrIcons from 'react-icons/gr';
import * as GiIcons from 'react-icons/gi';

import {
    Modal,
    Backdrop,
    Fade,
    TextField
  } from "@material-ui/core";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Button } from "@mui/material";
import NoCity from '../../assets/images/noCity.jpg';
import LoadingSpinner from "../../components/Loading";
import { getDownloadURL, getStorage, ref, uploadBytes,} from "firebase/storage";
import { serverTimestamp,  } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import PlacesAutocomplete, {getLatLng, geocodeByAddress} from 'react-places-autocomplete';

export function AddTour() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [openImg, setOpenImg] = useState(false)
  const [imageUpload, setImageUpload] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severity, setSeverity] = useState('')
  const [cities, setCities] = useState([])

  const [tour, setTour] = useState({})
  const [citySelected, setCitySelected] = useState(-1)

  const [address, setAddress] = useState([])

  const [latitude, setLatitude] = useState(null)

  const [longitude, setLongitude] = useState(null)

  const storage = getStorage();

    const docRef = query(collection(db, "tour_master"));

    const docRefCities = query(collection(db, "city_master"), orderBy("city_id","desc"), where("delete_flag", "==", 0));
    

    const [lastId, setLastId] = useState(null)


    async function getCitiesData() {

        const querySnapshot = await getDocs(docRefCities);

        querySnapshot.forEach((doc) => {

            const citydata = {
                id: doc.data().city_id,
                description: `${doc.data().state}, ${doc.data().name}`
            }

            setCities((prevCities) => [...prevCities, citydata])
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });
    };



    useEffect(() => {

        getCitiesData()

        getDocs(docRef).then(res => {
            setLastId(res.size)
        })
    
    }, [])

    const handleClose = () => {
        setOpenImg(false)
    };


    const handleChangeCity = e => {
        
        e.preventDefault()

        setCitySelected(e.target.value)

        let newTour = tour

        newTour.city_id = e.target.value

        setTour(newTour)

    }

    const handleTourNameChange = e => {
        
        e.preventDefault()

        let newTour = tour

        newTour.tourName = e.target.value

        setTour(newTour)

    }

    const handleTokenChange = e => {
        
        e.preventDefault()

        let newTour = tour
        newTour.token = e.target.value

        setTour(newTour)

    }


    const handleChangeAutocomplete = address => {

        let newTour = tour
        
        newTour.address = address
    
        setTour(newTour)
    
        setAddress(address)
    
        setLatitude(null)
    
        setLongitude(null)
    
      };
    
      const handleSelect = selected => {
    
        setAddress(selected)
        
        geocodeByAddress(selected)
          .then(res => getLatLng(res[0]))
          .then(({ lat, lng }) => {
    
            setLatitude(lat)
    
            setLongitude(lng)
    
          })
          .catch(error => {
    
            console.log('error', error); 
          });
     };


     const onChangeDescription = e => {
        
        e.preventDefault()

        let newTour = tour
        newTour.description = e.target.value

        setTour(newTour)

    }


    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newTour = tour
            newTour.image = event.target.files[0]

            setTour(newTour)
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const disableButton = () => {

        if(
            tour.city_id !== -1 &&
            tour.tourName &&
            tour.token &&
            tour.address &&
            tour.image 
        ){ return false}

        return true

    }


    const submitAdd = async() => {
        
        setLoadingUpdate(true)

        let imageURL = tour.image

        if(imageURL){

            const fileRefSmall = ref(storage, 'images/'+  tour.image.name+ '.png');

            await uploadBytes(fileRefSmall, tour.image)

            imageURL = await getDownloadURL(fileRefSmall);

        }

        const docData = {
            tour_id        : lastId+1,
            city_id        : tour.city_id,
            address        : tour.address,
            latitude       : latitude,
            longitude      : longitude,
            url            : imageURL,
            image          : imageUpload,
            token          : tour.token,
            name           : tour.tourName,
            description    : tour.description,
            delete_flag    : 0,
            createtime     : serverTimestamp(),   
            updatetime     : serverTimestamp()

        }


        setDoc(doc(db, "tour_master", ''+parseInt(lastId+1)+''), docData).then((res) =>{

            setLoadingUpdate(false)

            setSeverity('success')
            setMessageAlert('Tour Add Successfully')
            setOpenAlert(true)
            setTour({})

            window.scrollTo(0, 0)

        }).catch((err) => {


            console.log(err)

            setLoadingUpdate(false)

            setSeverity('error')
            setMessageAlert('An error has ocurred Please retry')
            setOpenAlert(true)
            setTour({})

            window.scrollTo(0, 0)


        });

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
                                    <Link to="/manage_tours" className="Linkp">
                                        Manage Tours
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Add Tour</li>
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
                    <h4 className="editCityH4">Add Tour</h4>
                </div>
                <div className="cityInputs">

                <FormControl>
                    <InputLabel shrink >City</InputLabel>
                    <Select
                    notched

                    value={citySelected}
                    label="City"
                    placeholder="Select City" 
                    onChange={handleChangeCity}>

                        <MenuItem disabled key={-1} value={-1}>
                            <em style={{color: 'rgb(133, 133, 133)'}}>Choose City</em> 
                        </MenuItem>
                        {cities.map((c,idx) => {

                            return <MenuItem key={idx} value={c.id}>{c.description}</MenuItem>

                        })}

                    </Select>
                </FormControl>

                
                    
                </div>
                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={handleTourNameChange} value={tour.tourName}  label="Tour Name" placeholder="Enter Tour Name" id="outlined-basic" variant="outlined" />
                    
                </div>
                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={handleTokenChange} value={tour.token} label="Token" placeholder="Enter Token" id="outlined-basic" variant="outlined" />
               
                </div>

                

                <PlacesAutocomplete
                onChange={handleChangeAutocomplete}
                value={address}
                onSelect={handleSelect}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                    return (

                        <div className="cityInputs">
                            <TextField {...getInputProps()} value={address} InputLabelProps={{shrink: true}} label="Address" placeholder="Enter Address" id="outlined-basic" variant="outlined" />
                            
                            {suggestions.length > 0 && (
                            <div>
                                {suggestions.map((suggestion, idx) => {
                                return (
                                    <div key={idx} className="pac-container pac-item"
                                    style={{width: '100%', left: '182px', top: '511px'}}
                                    {...getSuggestionItemProps(suggestion)}>
                                        <GiIcons.GiPositionMarker style={{marginRight: '10px'}} size={13}/>
                                        <strong key={suggestion.formattedSuggestion.mainText}>
                                            {suggestion.formattedSuggestion.mainText}
                                        </strong>{' '}
                                        <small>
                                            {suggestion.formattedSuggestion.secondaryText}
                                        </small>
                                    </div>
                                );
                                })}
                            </div>
                            )}
                            
                        </div>
                    );
                }}
                </PlacesAutocomplete>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} onChange={onChangeDescription} value={tour.description} multiline label="Description" placeholder="Enter Description" id="outlined-basic" variant="outlined" />
               
                </div>
                
                <div className="viewImageCity">

                    <p style={{fontWeight: 500, fontSize: '14px'}}>Image</p>
                    <img
                    src={imageUpload ? imageUpload : tour.image ? tour.image : NoCity}
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
                                    src={imageUpload ? imageUpload : tour.image ? tour.image : NoCity}
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
                style={disableButton() ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed'} : {backgroundColor: '#F7BE07'}} 
                disabled={disableButton()} 
                onClick={() => submitAdd()} className="btnSubmitCity" type="submit">
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Add Tour'}
                </button>
            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}