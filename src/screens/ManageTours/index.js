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




export function ManageTours() {
  
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

  const [tours, setTours] = useState([])

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const docRef = query(collection(db, "tour_master"), orderBy("tour_id","desc"), where("delete_flag", "==", 0));

  

  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();

  useEffect(() => {

    

    async function getToursData() {

        if(openAlert){

            setTours([])

        }

        const querySnapshot = await getDocs(docRef);

        let srno = 0

        querySnapshot.forEach((doc) => {
            srno++
            const tourData = {
                id: srno,
                tour_id: doc.data().tour_id,
                image: doc.data().url,
                tourName: doc.data().name,
                token: doc.data().token,
                description: doc.data().description,
            }

            setTours((prevTours) => [...prevTours, tourData])
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });
    };

    getToursData();

}, [openAlert])

    const handleDelete = useCallback(async(rowSel) => {

        if(openAlert){

            setOpenAlert(false)

        }

        handleCloseDialog();

        const docRef = doc(db, "tour_master",''+rowSel.tour_id+'')

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

    const editTour = (params) =>{


        const docUserRef = doc(db, "tour_master",''+parseInt(params.tour_id)+'')

        getDoc(docUserRef).then((docUserSnap) => {


            if (docUserSnap.exists()) {

                const tourData = {
                    city_id: docUserSnap.data().city_id,
                    tourName: docUserSnap.data().name,
                    token: docUserSnap.data().token,
                    latitude: docUserSnap.data().latitude,
                    longitude: docUserSnap.data().longitude,
                    image: docUserSnap.data().url,
                    address: docUserSnap.data().address,
                    description: docUserSnap.data().description,
                }

                navigate('/edit_tour/'+ params.tour_id, { state: { tourData: tourData }})


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
        field: 'tourName', 
        title: 'Tour Name', 
    },
    { 
        field: 'token', 
        title: 'Token', 
    },
    { 
        field: 'description', 
        title: 'Description', 
    },
];

const actions = [

    { 
        icon: () => <RIIcons.RiAddFill size={40} color="#F7BE07"/>,
        tooltip: 'Add Tour',
        isFreeAction: true,
        onClick: (e) => navigate('/add_tour')
    },


    
    {
        icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
        tooltip: 'View',
        onClick: (e, row) => navigate('/view_tour/'+ row.tour_id)
    },
    {
        icon: () => <HiIcons.HiOutlinePencil color="#F7BE07"/>,
        tooltip: 'Edit',
        onClick: (event, row) => editTour(row)
    },
    {
        icon: () => <HiIcons.HiOutlineTrash color="#F7BE07"/>,
        tooltip: 'Delete',
        onClick: (e, row) => handleClickOpenDialog(row)
    },
    {
        icon: () => <FaIcons.FaImages color="#F7BE07"/>,
        tooltip: 'Manage Images',
        onClick: (e, row) => navigate('/manage_tour_img/'+ row.tour_id)
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
                                <li className="breadcrumb-item active" aria-current="page">Manage Tours</li>
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
                City Deleted Successfully
                </Alert>
            </Collapse>
            <div className="tableView">
                <Button title="Lalala"/>
                <Table columns={columns} rows={tours} actions={actions} title={'Tours List'}/>
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
                {"Delete Tour"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>Are you sure to delete tour?</p>
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