import React, {useEffect, useState, useCallback} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import ImageSlider from "../../components/ImageSlider";
import { collection, doc, getDocs, query, where, getDoc, orderBy, updateDoc, } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useParams } from 'react-router-dom';
import moment from "moment";
import TabPanel from "../../components/TabPanel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Table from '../../components/Table';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
import noCity from '../../assets/images/noCity.jpg'
import LoadingSpinner from "../../components/Loading";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';


export function ViewTour() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [tokenBuy, setTokenBuy] = useState([])
  const [user, setUser] = useState({})
  const [restaurants, setRestaurants] = useState([])
  const [tour, setTour] = useState({})
  const [imageSelected, setImageSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tourImgList, setTourImgList] = useState([])

  const [openDialog, setOpenDialog] = useState(false);

  const [openAlert, setOpenAlert] = useState(false)

  const [rowSelected, setRowSelected] = useState(null)


  const { id } = useParams();

  const navigate = useNavigate();

  const docRef = query(collection(db, "restaurant_master"), where("delete_flag", "==", 0), where("tour_id", '==', parseInt(id)));

  const docImageList = query(collection(db, "tour_image_master"), where("delete_flag", "==", 0), where("tour_id", '==', parseInt(id)));

    useEffect(() => {

        async function getRestaurantData() {
            const querySnapshot = await getDocs(docRef);


            //console.log(querySnapshot)

            let srno = 0


            querySnapshot.forEach((docT) => {

                srno++

                const restaurantData = {

                    id : srno,
                    restaurant_id : docT.data().restaurant_id,
                    image : docT.data().url,
                    name : docT.data().name

                }

                setRestaurants((prevRes) => [...prevRes, restaurantData])

                    
            });
        };

        async function getTourImageData() {
            const querySnapshot = await getDocs(docImageList);

            //console.log(id)

            //console.log(querySnapshot)

            let srno = 0


            querySnapshot.forEach((docT) => {

                srno++

                const tourImageList = {

                    id : srno,
                    tour_img_id : docT.data().tour_img_id,
                    image : docT.data().url ?  docT.data().url : noCity,
                    description : docT.data().description ? docT.data().description : 'NA'

                }

                setTourImgList((prevTIL) => [...prevTIL, tourImageList])

                    
            });
        };

        async function getTourData() {
            const docTourRef = doc(db, "tour_master",''+parseInt(id)+'')

            const docTourSnap = await getDoc(docTourRef);

            if (docTourSnap.exists()) {


                const docCityRef = doc(db, "city_master",''+parseInt(docTourSnap.data().city_id)+'')

                const docCitySnap = await getDoc(docCityRef);

                //console.log("Document data:", docUserSnap.data());

                const tourData = {
                    name: docCitySnap.data().name,
                    image: docTourSnap.data().url,
                    tourName: docTourSnap.data().name,
                    token: docTourSnap.data().token,
                    address: docTourSnap.data().address,
                    description: (docTourSnap.data().description)
                }

                setTour(tourData)
            }
        };

        window.scrollTo(0, 0)

        setTour([])

        setRestaurants([])

        setTourImgList([])
        
        setLoading(true)
        
        getRestaurantData();
        getTourImageData();
        getTourData();

        setLoading(false)
    
    }, [openAlert])

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
      };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickOpenDialog = (params) => {
        setRowSelected(params)
        setOpenDialog(true);
      };


    const columnsTok = [
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
                    src={(params.image !== undefined || params.image !== 'NA') ? params.image : noCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="../../assets/images/noCity.png";
                    }}
                    onClick={(e) => {setImageSelected((params.image !== undefined || params.image !== 'NA') ? params.image : noCity); params.image && setOpen(true)}}
                    style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                    />
                    
                </>
            )
        },
        { 
            field: 'name', 
            title: 'Name', 
        },

    ];


    const columnsTours = [
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
                    src={(params.image !== undefined || params.image !== 'NA') ? params.image : noCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src=noCity
                    }}
                    onClick={(e) => {setImageSelected((params.image !== undefined || params.image !== 'NA') ? params.image : noCity); params.image && setOpen(true)}}
                    style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                    />
                    
                </>
            )
        },
        { 
            field: 'description', 
            title: 'Description', 
        },
    ];

    const actions = [

        {
            icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
            tooltip: 'View Restaurant',
            onClick: (event, row) => navigate('/view_restaurant/'+row.restaurant_id)
        },
    ]



    const actionsTours = [

        {
            icon: () => <HiIcons.HiOutlinePencil color="#F7BE07"/>,
            tooltip: 'Edit Tour Image',
            onClick: (event, row) => navigate('/edit_tour_image/'+row.tour_img_id)
        },
        {
            icon: () => <HiIcons.HiOutlineTrash color="#F7BE07"/>,
            tooltip: 'Delete Tour Image',
            onClick: (e, row) => handleClickOpenDialog(row)
        },
    ]

    const handleDelete = useCallback(async(rowSel) => {

        window.scrollTo(0,0)

        if(openAlert){

            setOpenAlert(false)

        }

        handleCloseDialog();

        const docRef = doc(db, "tour_image_master",''+rowSel.tour_img_id+'')

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
                                <li className="breadcrumb-item active" aria-current="page">View Tour</li>
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
                Tour Image Deleted Successfully
                </Alert>
            </Collapse>
            <div className="rowViewUser">
                <div className="ViewUserSec">
                    <img  onClick={(e) => {setImageSelected(tour.image);  setOpen(true)}} style={{width: '350px', height: '350px', borderRadius: '10%', cursor: 'pointer'}} src={tour.image ? tour.image : noCity} 
                    alt=''
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = noCity;
                    }}/>
                </div>
                <div className="ViewData"> 
                    <div className="ViewDataUser">
                        <h4 className="UDView">Tour Details</h4>
                        
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">City Name</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{tour && tour.name}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Tour Name</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{tour && tour.tourName}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Token Required</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{tour && tour.token}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Address</b>
                            </div>
                            <div className="rowDataValue">
                                <a href={`http://maps.google.com?q=${tour && tour.address}`} target="_blank" style={{textDecoration: 'underline'}}>{tour && tour.address}</a>
                            </div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Description</b>
                            </div>
                            <div className="rowDataValue">{tour && tour.description}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ViewFriends">

                <Tabs className="tabsProfile" value={value} onChange={handleChange}>
                    <Tab style={{color: '#0a3366', padding: '20px'}} label="Restaurant List"  />
                    <Tab style={{color: '#0a3366', padding: '20px'}} label="Tour Image List"  />
                </Tabs>

                <TabPanel value={value} index={0}>
                
                    <Table columns={columnsTok} rows={restaurants} actions={actions} title={'Restaurants List'}/>
                        
                </TabPanel>

                <TabPanel value={value} index={1}>
                
                    <Table columns={columnsTours} rows={tourImgList} actions={actionsTours} title={'Tours Image List'}/>
                        
                </TabPanel>

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
                                src={imageSelected ? imageSelected : noCity}
                                alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = noCity;
                                }}
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
                        {"Delete Tour Image"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <p>Are you sure to delete tour image?</p>
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

            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}