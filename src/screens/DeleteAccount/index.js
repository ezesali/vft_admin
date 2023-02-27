import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../Header";
import Table from '../../components/Table';
import LoadingSpinner from '../../components/Loading'
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
  import { collection, getDocs, query, where, orderBy} from "firebase/firestore";
  import { db } from "../../Auth/firebase";
import moment from "moment";
import '../../App.css'
import placeholder from '../../assets/images/placeholder.png'; // with import
import "../../App.css";




export function DeleteAccount() {


  const [imageSelected, setImageSelected] = useState(null)

  const [navisOpen, setNavisOpen] = useState(false)

  const [users, setUsers] = useState([])

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)
  
  const docRef = query(collection(db, "user_master"), orderBy("user_id","desc"), where("delete_flag", "==", 1), where("user_type", "==", 1), where("profile_complete","==",1));

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {

    

    async function getUsersData() {

        setLoading(true)

        const querySnapshot = await getDocs(docRef);

        let srno = 0

        querySnapshot.forEach((doc) => {
            srno++
            const userdata = {
                id: srno,
                user_id: doc.data().user_id,
                image: doc.data().image,
                username: doc.data().name,
                email: doc.data().email,
                reason: doc.data().delete_reason,
                regDate: moment(doc.data().updatetime.toDate() ).format("DD/MM/YYYY, hh:mm A"),
                status: doc.data().active_flag
            }

            setUsers((prevUsers) => [...prevUsers, userdata])
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });

        setLoading(false)
    };

    getUsersData();

}, [])



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
                src={params.image ? params.image.startsWith('http') ? params.image : placeholder : placeholder}
                alt={''}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src= placeholder;
                }}
                onClick={(e) => {setImageSelected(params.image ? params.image : "/src/assets/images/placeholder.png"); params.image && setOpen(true)}}
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
        field: 'reason', 
        title: 'Reason', 
    },
    {
        field: 'regDate',
        title: 'Deleted Date & Time',
    },
];

  

  return (
    
    <>
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
                                <li className="breadcrumb-item active" aria-current="page">Deleted Users</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="tableView">
                <Table columns={columns} rows={users} title={'Deleted Users List'}/>
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
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src= placeholder;
                        }}
                        style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                    />
                </Fade>
            </div>
        </Modal>
        {loading && <LoadingSpinner/>}
        {/* 
       
        */}
    </>
    
  );
}