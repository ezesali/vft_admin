import React, {useEffect, useState, useCallback} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../Header";
import Button from '@mui/material/Button';
import * as HiIcons from 'react-icons/hi';
import * as RIIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';
import Table from '../../components/Table';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import LoadingSpinner from '../../components/Loading'
import { serverTimestamp } from "firebase/firestore";

import * as GrIcons from 'react-icons/gr';
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
  import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../../Auth/firebase";
import { useNavigate } from "react-router-dom";
import '../../App.css'

import noCity from '../../assets/images/noCity.jpg'




export function ManageRestaurants() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  const [openAlert, setOpenAlert] = useState(false)

  const [rowSelected, setRowSelected] = useState(null)

  const [imageSelected, setImageSelected] = useState(null)

  const handleClickOpenDialog = (params) => {
    setRowSelected(params)
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [navisOpen, setNavisOpen] = useState(false)

  const [restaurants, setRestaurants] = useState([])

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const docRef = query(collection(db, "restaurant_master"), orderBy("restaurant_id","desc"), where("delete_flag", "==", 0));

  

  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();

  useEffect(() => {

    

    async function getRestaurantData() {

        if(openAlert){

            setRestaurants([])

        }

        const querySnapshot = await getDocs(docRef);

        //console.log(id)

        //console.log(querySnapshot)

        let srno = 0

        querySnapshot.forEach((docT) => {

            var restaurant = {}

            //console.log()

            if (docT.exists()) {

                srno++

                restaurant.id = srno

                restaurant.image = docT.data().url

                restaurant.restaurant_id = docT.data().restaurant_id

                restaurant.restaurantName = docT.data().name
                
                restaurant.mobile = '+'+docT.data().mobile


                //console.log('TOUR_ID: ',docT.data())
                const docTourRef = query(collection(db, "tour_master"), where("tour_id", '==', parseInt(docT.data().tour_id)));

                //console.log(docTourRef)

                
                getDocs(docTourRef).then((resTour) => {

                    if(resTour.docs.length > 0){

                        restaurant.tourName = resTour.docs[0].data().name

                    } 
                    else{

                        restaurant.tourName = 'NA'

                    }
                });


                setTimeout(() => {


                    setRestaurants((prevRestaurants) => [...prevRestaurants, restaurant])

                
                    
                }, 1000);
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
            }
        });

    };

    getRestaurantData();

}, [openAlert])

    const handleDelete = useCallback(async(rowSel) => {

        if(openAlert){

            setOpenAlert(false)

        }

        handleCloseDialog();

        const docRef = doc(db, "restaurant_master",''+rowSel.restaurant_id+'')

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            setLoading(true)

            await updateDoc(docRef, {
                delete_flag: 1,
                updatetime  : serverTimestamp(),
            }).then(() =>{

                setOpenAlert(true)

            });

            setLoading(false)

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    })

    const editRestaurant = (params) =>{


        const docUserRef = doc(db, "restaurant_master",''+parseInt(params.restaurant_id)+'')

        getDoc(docUserRef).then((docUserSnap) => {


            if (docUserSnap.exists()) {

                const restaurantData = {
                    city_id: docUserSnap.data().city_id,
                    tour_id: docUserSnap.data().tour_id,
                    restaurantName: docUserSnap.data().name,
                    destinationUrl: docUserSnap.data().destination_url,
                    googleMapUrl: docUserSnap.data().google_map_url,
                    webSiteUrl: docUserSnap.data().website_url,
                    latitude: docUserSnap.data().latitude,
                    longitude: docUserSnap.data().longitude,
                    mobile: docUserSnap.data().mobile,
                    position: docUserSnap.data().position,
                    image: docUserSnap.data().url,
                    address: docUserSnap.data().address,
                    description: docUserSnap.data().description,
                }

                navigate('/edit_restaurant/'+ params.restaurant_id, { state: { restaurantData: restaurantData }})


            }



        });

    }


  const columns = [
    { 
        field: 'id', 
        title: 'Sr.No.',  
    },
    { 
        field: 'image', 
        title: 'Image', 
        render: (params) => (
            <>
                <img
                src={params.image ? params.image : noCity}
                alt={''}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src= noCity;
                }}
                onClick={(e) => {setImageSelected(params.image); params.image && setOpen(true)}}
                style={{height: '90px', width: '90px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                />

            </>
        )
    },
    { 
        field: 'restaurantName', 
        title: 'Restaurant Name', 
    },
    { 
        field: 'tourName', 
        title: 'Tour Name', 
    },
    { 
        field: 'mobile', 
        title: 'Mobile', 
    },
];

const actions = [

    { 
        icon: () => <RIIcons.RiAddFill size={40} color="#F7BE07"/>,
        tooltip: 'Add Restaurant',
        isFreeAction: true,
        onClick: (e) => navigate('/add_restaurant')
    },


    
    {
        icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
        tooltip: 'View',
        onClick: (e, row) => navigate('/view_restaurant/'+ row.restaurant_id)
    },
    {
        icon: () => <HiIcons.HiOutlinePencil color="#F7BE07"/>,
        tooltip: 'Edit',
        onClick: (event, row) => editRestaurant(row)
    },
    {
        icon: () => <HiIcons.HiOutlineTrash color="#F7BE07"/>,
        tooltip: 'Delete',
        onClick: (e, row) => handleClickOpenDialog(row)
    },
    {
        icon: () => <FaIcons.FaImages color="#F7BE07"/>,
        tooltip: 'Manage Images',
        onClick: (e, row) => navigate('/manage_resto_img/'+ row.restaurant_id)
    },

    
]

  

  return (
    
    <>
        {loading && <LoadingSpinner/>}
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '180px' : null}} className="dashboardContainerProfile">
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
                                <li className="breadcrumb-item active" aria-current="page">Manage Restaurants</li>
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
                    }}
                    >
                    <GrIcons.GrClose color="#000"/>
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                Restaurant Deleted Successfully
                </Alert>
            </Collapse>
            <div className="tableView">
                <Button title="Lalala"/>
                <Table columns={columns} rows={restaurants} actions={actions} title={'Restaurants List'}/>
            </div>
        </div>
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500
            }}>
            <div onClick={handleClose} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <Fade in={open} timeout={500} >
                    <img
                        src={imageSelected}
                        alt=""
                        style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                    />
                </Fade>
            </div>
        </Modal>
        <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title">
            <DialogTitle style={{alignSelf: 'center'}} id="responsive-dialog-title">
                {"Delete Restaurant"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>Are you sure to delete restaurant?</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{alignSelf: 'center'}}>
                <Button style={{backgroundColor: 'black', color: 'white'}} autoFocus onClick={handleCloseDialog}>
                    No
                </Button>
                <Button style={{backgroundColor: 'black', color: 'white'}} onClick={() => handleDelete(rowSelected)} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
        {/* 
       
        */}
    </>
    
  );
}