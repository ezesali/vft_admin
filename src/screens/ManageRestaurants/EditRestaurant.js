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

export function EditRestaurant() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [restaurants, setRestaurants] = useState({})
  const [openImg, setOpenImg] = useState(false)
  const [cities, setCities] = useState([])
  const [tours, setTours] = useState([])
  const [imageUpload, setImageUpload] = useState('')
  const [citySelected, setCitySelected] = useState(null)
  const [tourSelected, setTourSelected] = useState(null)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severityMsg, setSeverityMsg] = useState('')

  const [errorMobile, setErrorMobile] = useState('')
  const [errorPos, setErrorPos] = useState('')
  const [errorURLDes, setErrorURLDes] = useState('')
  const [errorURLWebSite, setErrorURLWebSite] = useState('')
  const [errorURLGoogleMap, setErrorURLGoogleMap] = useState('')

  const [address, setAddress] = useState([])

  const [latitude, setLatitude] = useState(null)

  const [longitude, setLongitude] = useState(null)

  const navigate = useNavigate();

  const regexURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi


  const storage = getStorage();

  const docRef = query(collection(db, "city_master"), orderBy("city_id","desc"), where("delete_flag", "==", 0));

  const docRefTour = query(collection(db, "tour_master"), orderBy("tour_id","desc"), where("delete_flag", "==", 0));



  const [loading, setLoading] = useState(false)

    const {id} = useParams()

    const { state } = useLocation();

    useEffect(() => {


        if (state && state.restaurantData){

            setLoading(true)

            setTours([])

            setRestaurants(state.restaurantData)

            setCitySelected(state.restaurantData.city_id)

            setTourSelected(state.restaurantData.tour_id)

            setLoading(false)

            getCitiesData();

            getToursData(state.restaurantData.city_id);

        }
        else{

            navigate('/manage_restaurants')

        }
    
    }, [])


    async function getCitiesData() {

        const querySnapshot = await getDocs(docRef);

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

    async function getToursData(idCity) {

        const querySnapshot = await getDocs(docRefTour);

        let toursData = []

        querySnapshot.forEach((doc) => {


            if(parseInt(doc.data().city_id) === (parseInt(idCity))){

                const Tourdata = {
                    id: doc.data().tour_id,
                    description: doc.data().name
                }

                toursData.push(Tourdata)

            }

            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });


        setTours(toursData)
    };

    const handleClose = () => {
        setOpenImg(false)
    };

    const handleChangeCity = e => {
        
        e.preventDefault()

        setTourSelected(null)

        setCitySelected(e.target.value)
        
        //setTours(tours.filter((tour) => parseInt(tour.city_id) === parseInt(e.target.value) ))

        getToursData(e.target.value)


        let newRestaurant = restaurants

        newRestaurant.city_id = e.target.value

        newRestaurant.tour_id = null

        setRestaurants(newRestaurant)

    }

    const handleChangeTour = e => {
        
        e.preventDefault()

        setTourSelected(e.target.value)

        let newRestaurant = restaurants

        newRestaurant.tour_id = e.target.value

        setRestaurants(newRestaurant)

    }

    const handleRestaurantNameChange = e => {
        
        e.preventDefault()

        let newRestaurant = restaurants

        newRestaurant.restaurantName = e.target.value

        setRestaurants(newRestaurant)

    }

    const handleMobileChange = e => {
        
        e.preventDefault()

        const regNum = RegExp('^[0-9]')


            
            //'[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)');


        if(e.target.value.length <= 15 && e.target.value.length >= 7){

            if(regNum.test(e.target.value)){

                setErrorMobile('')

                let newRestaurant = restaurants
                newRestaurant.mobile = e.target.value

                setRestaurants(newRestaurant)


            }
            else{
                setErrorMobile('Please enter a valid number.')
            }

        }
        else{

            setErrorMobile('Mobile length has to be between 7 and 15 numbers')

        }

    }

    const handlePositionChange = e => {

        const regNum = RegExp('^[0-9]')

        if(regNum.test(e.target.value)){

            setErrorPos('')

            e.preventDefault()

            let newRestaurant = restaurants
            newRestaurant.position = e.target.value
    
            setRestaurants(newRestaurant)


        }
        else{
            setErrorPos('Please enter a valid number.')
        }
        
       

    }

    const handleDestinationURLChange = e => {

        if(e.target.value.match(regexURL)){

            setErrorURLDes('')
        
            e.preventDefault()

            let newRestaurant = restaurants
            newRestaurant.destinationUrl = e.target.value

            setRestaurants(newRestaurant)

        }
        else{
            setErrorURLDes('Please enter a valid URL.')
        }

    }

    const handleWebSiteURLChange = e => {

        if(e.target.value.match(regexURL)){

            setErrorURLWebSite('')
        
            e.preventDefault()

            let newRestaurant = restaurants
            newRestaurant.webSiteUrl = e.target.value

            setRestaurants(newRestaurant)
        }
        else{
            setErrorURLWebSite('Please enter a valid URL.')
        }

    }

    const handleGoogleMapURLChange = e => {

        if(e.target.value.match(regexURL)){

            setErrorURLGoogleMap('')
        
            e.preventDefault()

            let newRestaurant = restaurants
            newRestaurant.googleMapUrl = e.target.value

            setRestaurants(newRestaurant)
        }
        else{
            setErrorURLGoogleMap('Please enter a valid URL.')
        }

    }


    const handleChangeAutocomplete = address => {

        let newRestaurant = restaurants
        
        newRestaurant.address = address
    
        setRestaurants(newRestaurant)
    
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
    
            console.log('error', error); // eslint-disable-line no-console
          });
     };


     const onChangeDescription = e => {
        
        e.preventDefault()

        let newRestaurant = restaurants
        newRestaurant.description = e.target.value

        setRestaurants(newRestaurant)

    }


    const handleChangeCityImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let newRestaurant = restaurants
            newRestaurant.image = event.target.files[0]

            setRestaurants(newRestaurant)
            setImageUpload(URL.createObjectURL(event.target.files[0]))
        }
    };


    const submitEdit = async() => {

        setLoadingUpdate(true)

        let imageURL = restaurants.image

        
        if(imageURL){

            if(imageUpload){


                if(imageUpload){

                    const fileRefLarge = ref(storage, 'images/'+  imageUpload+ '.png');

                    await uploadBytes(fileRefLarge, restaurants.image)
        
                    imageURL = await getDownloadURL(fileRefLarge);

                }

            }

        }


        if(restaurants.restaurantName == '' ||
           restaurants.description == '' ||
           restaurants.position == '' ||
           restaurants.destinationUrl == '' ||
           restaurants.webSiteUrl == '' ||
           restaurants.address == '' ) {


            setLoadingUpdate(false)

            setSeverityMsg('error')

            setMessageAlert('Check required fields and complete them')

            setOpenAlert(true)

            window.scrollTo(0, 0)

        }

        else {


            const docRestaurantRef = doc(db, "restaurant_master",''+parseInt(id)+'')

            getDoc(docRestaurantRef).then((docRestaurantSnap) => {

                if (docRestaurantSnap.exists()) {

                    updateDoc(docRestaurantRef, {
                        city_id         : restaurants.city_id,
                        tour_id         : restaurants.tour_id,
                        name            : restaurants.restaurantName,
                        url             : imageURL ? imageURL : restaurants.image,
                        longitude       : longitude ? longitude : restaurants.longitude,
                        latitude        : latitude ? latitude : restaurants.latitude,
                        position        : restaurants.position,
                        website_url     : restaurants.webSiteUrl,
                        google_map_url  : restaurants.googleMapUrl,
                        destination_url : restaurants.destinationUrl,
                        address         : restaurants.address,
                        description     : restaurants.description,
                        updatetime      : serverTimestamp()
                    }).then(() =>{

                        setLoadingUpdate(false)

                        setSeverityMsg('success')
            
                        setMessageAlert('Restaurant Edited Successfully')
                        setOpenAlert(true)

                        window.scrollTo(0, 0)


                        setTimeout(() => {

                            navigate('/manage_restaurants/')
                            
                        }, 2000);
            
                    });

                }
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
                                <li className="breadcrumb-item">
                                    <Link to="/manage_restaurants" className="Linkp">
                                        Manage Restaurants
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Edit Restaurant</li>
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
                    <h4 className="editCityH4">Edit Restaurant</h4>
                </div>
                <div className="cityInputs">

                    <FormControl>
                        <InputLabel required shrink >City</InputLabel>
                        <Select
                        notched
                        value={citySelected} 
                        label="City" 
                        placeholder="Select City" 
                        onChange={handleChangeCity}>

                            <MenuItem value="">
                                <em>Choose City</em>
                            </MenuItem>
                            {cities.map((c,idx) => {

                                return <MenuItem key={idx} value={c.id}>{c.description}</MenuItem>

                            })}

                        </Select>
                    </FormControl>
                </div>

                <div className="cityInputs">

                    <FormControl>
                        <InputLabel required shrink >Tour</InputLabel>
                        <Select
                        notched
                        value={tourSelected} 
                        label="Tour" 
                        placeholder="Select Tour" 
                        onChange={handleChangeTour}>

                            <MenuItem value="">
                                <em>Choose Tour</em>
                            </MenuItem>
                            {tours.map((c,idx) => {

                                return <MenuItem key={idx} value={c.id}>{c.description}</MenuItem>

                            })}

                        </Select>
                    </FormControl>
                </div>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.restaurantName ? 'notLoadedYet' : 'loaded'} required onChange={handleRestaurantNameChange} defaultValue={restaurants.restaurantName}  label="Restaurant Name" placeholder="Enter Restaurant Name" id="outlined-basic" variant="outlined" />

                </div>

                <div className="cityInputs">

                    <TextField  InputLabelProps={{shrink: true}} key={restaurants.mobile ? 'notLoadedYet' : 'loaded'} onChange={handleMobileChange}  defaultValue={restaurants.mobile} label="Mobile (Optional)" placeholder="Enter Mobile" id="outlined-basic" variant="outlined" />
                    <label style={{color: 'red'}}>{errorMobile}</label>
                </div>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.position ? 'notLoadedYet' : 'loaded'} onChange={handlePositionChange} required defaultValue={restaurants.position} label="Position" placeholder="Enter Position" id="outlined-basic" variant="outlined" />
                    <label style={{color: 'red'}}>{errorPos}</label>
                </div>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.destinationUrl ? 'notLoadedYet' : 'loaded'} onChange={handleDestinationURLChange} required defaultValue={restaurants.destinationUrl} label="Next Destination URL" placeholder="Enter Next Destination URL" id="outlined-basic" variant="outlined" />
                    <label style={{color: 'red'}}>{errorURLDes}</label>
                </div>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.webSiteUrl ? 'notLoadedYet' : 'loaded'} onChange={handleWebSiteURLChange} required defaultValue={restaurants.webSiteUrl} label="Website URL" placeholder="Enter Website URL" id="outlined-basic" variant="outlined" />
                    <label style={{color: 'red'}}>{errorURLWebSite}</label>
                </div>

                <div className="cityInputs">

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.googleMapUrl ? 'notLoadedYet' : 'loaded'} onChange={handleGoogleMapURLChange} defaultValue={restaurants.googleMapUrl} label="Google Map URL (Optional)" placeholder="Enter Google Map URL" id="outlined-basic" variant="outlined" />
                    <label style={{color: 'red'}}>{errorURLGoogleMap}</label>
                </div>

                <PlacesAutocomplete
                onChange={handleChangeAutocomplete}
                value={restaurants.address}
                onSelect={handleSelect}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                    return (

                        <div className="cityInputs">
                            <TextField {...getInputProps()} InputLabelProps={{shrink: true}} required label="Address" placeholder="Enter Address" id="outlined-basic" variant="outlined" />
                            
                            {suggestions.length > 0 && (
                            <div>
                                {suggestions.map((suggestion, idx) => {
                                return (
                                    <div key={idx} className="pac-container pac-item"
                                    style={{width: '100%', left: '182px', top: '511px'}}
                                    {...getSuggestionItemProps(suggestion)}>
                                        <GiIcons.GiPositionMarker style={{marginRight: '10px'}} size={13}/>
                                        <strong>
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

                    <TextField InputLabelProps={{shrink: true}} key={restaurants.description ? 'notLoadedYet' : 'loaded'} onChange={onChangeDescription} required defaultValue={restaurants.description} multiline label="Description" placeholder="Enter Description" id="outlined-basic" variant="outlined" />
               
                </div>
                
                <div className="viewImageCity">

                    <p style={{fontWeight: 500, fontSize: '14px'}}>Image *</p>
                    <img
                    src={imageUpload ? imageUpload : restaurants.image ? restaurants.image : NoCity}
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
                                    src={imageUpload ? imageUpload : restaurants.image ? restaurants.image : NoCity}
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