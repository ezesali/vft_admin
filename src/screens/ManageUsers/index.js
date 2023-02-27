import React, {useEffect, useState, useCallback} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../Header";
import Button from '@mui/material/Button';
import * as HiIcons from 'react-icons/hi';
import * as GrIcons from 'react-icons/gr';
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
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
  import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../../Auth/firebase";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import '../../App.css';
import placeholder from '../../assets/images/placeholder.png';
//import * as xls from "xlsx";




export function ManageUsers() {
  
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

  const [users, setUsers] = useState([])

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const docRef = query(collection(db, "user_master"), orderBy("user_id","desc"), where("delete_flag", "==", 0), where("user_type", "==", 1), where("profile_complete","==",1));

  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();

  useEffect(() => {

    

    async function getUsersData() {

        if(openAlert){
         
            setUsers([])

        }

    
        const querySnapshot = await getDocs(docRef);

        let srno = 0

        querySnapshot.forEach((doc) => {
            srno++
            const userdata = {
                id: srno,
                user_id: doc.data().user_id,
                image: doc.data().image !== 'NA' ? doc.data().image : placeholder,
                username: doc.data().name,
                email: doc.data().email,
                regDate: moment(doc.data().createtime.toDate() ).format("DD/MM/YYYY, hh:mm A"),
                status: doc.data().active_flag
            }

            setUsers((prevUsers) => [...prevUsers, userdata])
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });
    };

    getUsersData();

}, [openAlert])

    const handleActivateDesactivate = useCallback(async(rowSel) => {

        if(openAlert){

            setOpenAlert(false)

        }

        handleCloseDialog();

        const docRef = doc(db, "user_master",''+rowSel.user_id+'')

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            if(rowSel.status === 1) {

                setLoading(true)

                await updateDoc(docRef, {
                    active_flag: 0,
                    updatetime  : serverTimestamp(),
                }).then(() =>{

                    setOpenAlert(true)

                });;

                setLoading(false)
            }
            else{

                setLoading(true)

                await updateDoc(docRef, {
                    active_flag: 1,
                    updatetime  : serverTimestamp()
                }).then(() =>{

                    setOpenAlert(true)

                });

                setLoading(false)
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    })



  /*const columns = [
    { 
        field: 'id', 
        headerName: 'Sr.No.', 
        width: 75 
    },
    { 
        field: 'image', 
        headerName: 'Image', 
        sortable: false,
        width: 90,
        renderCell: (params) => (
            <>
                <img
                src={params.value ? params.value : 'assets/images/placeholder.png'}
                alt={''}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="assets/images/placeholder.png";
                }}
                onClick={(e) => {setImageSelected(params.value); params.value && setOpen(true)}}
                style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.value && 'pointer'}}
                />
                
            </>
        )
    },
    { 
        field: 'username', 
        headerName: 'User Name', 
        width: 200 
    },
    { 
        field: 'email', 
        headerName: 'Email', 
        width: 280,
    },
    {
        field: 'regDate',
        headerName: 'Registered Date & Time',
        width: 175,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 100,
        renderCell: (params) => (
            <>
                <p style={{
                    backgroundColor: params.value === 1 ? '#28a745' : '#dc3545', 
                    display: 'inline-block', 
                    padding: '0.25em 0.4em',
                    fontSize: '85%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    color: 'white',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline'}}>

                    {params.value === 1 ? 'Activate' : 'Desactivate'}
                
                </p>
            </>
        )
    },
    {
        field: 'action',
        type: 'actions',
        headerName: 'Action',
        width: 140,
        
        getActions: (params) => [
            
            <GridActionsCellItem
              icon={
                <Tooltip title="View user">
                    <div>
                        <HiIcons.HiOutlineEye color="#000"/>
                    </div>
                </Tooltip>
              }
              label="Delete"
              onClick={() => navigate('/view_user/'+ params.row.user_id)}
            />,
            <>
            <GridActionsCellItem
              icon={
                <Tooltip title="Activate/Desactivate">
                    <div>
                        <HiIcons.HiOutlineBan color="#000"/>
                    </div>
                </Tooltip>
              }
              label="Toggle Admin"
              onClick={(e) => {
                //console.log(params)
                //var docRef = db.collection("user_master").doc(''+params.row.user_id+'')
                handleClickOpenDialog(params)
                
              }}
            />
            </>,
          ],
    },
];*/

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
                src={params.image}
                alt={''}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="../../assets/images/placeholder.png";
                }}
                onClick={(e) => {setImageSelected(params.image === undefined ? params.image : placeholder); params.image && setOpen(true)}}
                style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                />
                
            </>
        )
    },
    { 
        field: 'username', 
        title: 'User Name', 
    },
    { 
        field: 'email', 
        title: 'Email', 
    },
    {
        field: 'regDate',
        title: 'Registered Date & Time',
    },
    {
        field: 'status',
        title: 'Status',
        render: (params) => (
            <>
                <p style={{
                    backgroundColor: params.status === 1 ? '#28a745' : '#dc3545', 
                    display: 'inline-block', 
                    padding: '0.25em 0.4em',
                    fontSize: '85%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    color: 'white',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline'}}>

                    {params.status === 1 ? 'Activate' : 'Desactivate'}
                
                </p>
            </>
        )
    },
];


const actions = [
    {
        icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
        tooltip: 'View User',
        onClick: (event, row) => navigate('/view_user/'+row.user_id)
    },
    {
        icon: () => <HiIcons.HiOutlineBan color="#F7BE07"/>,
        tooltip: 'Activate/Desactivate',
        onClick: (e, row) => handleClickOpenDialog(row)
    }
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
                                <li className="breadcrumb-item active" aria-current="page">Manage Users</li>
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
                User Update Succesfully
                </Alert>
            </Collapse>
            <div className="tableView">
                <Table columns={columns} rows={users} actions={actions} title={'Users List'} />
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
                {"Activate/Desactivate User"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>Are you sure to Activate/Desactivate this user?</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{alignSelf: 'center'}}>
                <Button style={{backgroundColor: 'black', color: 'white'}} autoFocus onClick={handleCloseDialog}>
                    No
                </Button>
                <Button style={{backgroundColor: 'black', color: 'white'}} onClick={() => handleActivateDesactivate(rowSelected)} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
        {/* 
       
        */}
    </>
    
  );
}