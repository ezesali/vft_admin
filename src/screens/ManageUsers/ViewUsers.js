import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import ImageSlider from "../../components/ImageSlider";
import { collection, doc, getDocs, query, where, getDoc, orderBy } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useParams } from 'react-router-dom';
import moment from "moment";
import TabPanel from "../../components/TabPanel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '../../components/Table';
import * as HiIcons from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
import placeholder from '../../assets/images/placeholder.png'
import LoadingSpinner from "../../components/Loading";


export function ViewUsers() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [tokenBuy, setTokenBuy] = useState([])
  const [user, setUser] = useState({})
  const [tours, setTours] = useState([])
  const [imageSelected, setImageSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [TotalTokenCount, setTotalTokenCount] = useState(null)

  const { id } = useParams();

  const navigate = useNavigate();

  const docRef = query(collection(db, "Buy_token_master"),orderBy('token_id', 'desc'), where("delete_flag", "==", 0), where("user_id", '==', parseInt(id)));

  const docFriendsRef = query(collection(db, "user_friend_master"), where("delete_flag", "==", 0), where("userid", '==', parseInt(id)));

    useEffect(() => {

        async function getTourData() {
            const querySnapshot = await getDocs(docRef);

            //console.log(id)

            //console.log(querySnapshot)

            let srno = 0

            let tokenPurchase = 0

            let totalUsedToken = 0

            let srnoTour = 0

            querySnapshot.forEach((docT) => {

                var tokenHist = {}

                //console.log()

                if (docT.exists()) {

                    srno++

                    tokenHist.id = srno

                    //console.log('TOUR_ID: ',docT.data())
                    const docTourRef = query(collection(db, "tour_master"), where("tour_id", '==', parseInt(docT.data().tour_id)));

                    //console.log(docTourRef)

                   
                    
                    getDocs(docTourRef).then((resTour) => {

                        let tourObj = {}

                        

                        if(resTour.docs.length > 0){

                            

                            if(docT.data().status === 1){

                                

                                srnoTour++

                                tourObj.srno = srnoTour

                                tourObj.tourId = resTour.docs[0].data().tour_id

                                tourObj.image = resTour.docs[0].data().url
    
                                tourObj.tourName = resTour.docs[0].data().name
    
                                tourObj.token = docT.data().token
    
                                tourObj.amount = docT.data().amount
    
                                tourObj.status = docT.data().status
    
                                tourObj.purchased_date = moment(docT.data().createtime.toDate() ).format("DD/MM/YYYY, hh:mm A")


                                if(Object.keys(tourObj).length > 0){

                                    setTours((prevTours) => [...prevTours, tourObj])
        
                                }

                            }
                        
                            tokenHist.tourName = resTour.docs[0].data().name

                        }
                        else{

                            tokenHist.tourName = 'NA'

                        }

                    });


                    if(docT.data().status === 0){

                        tokenPurchase += parseFloat(docT.data().token)
    
                    }
                    else{

                        totalUsedToken = parseFloat(totalUsedToken) + parseFloat(docT.data().token);
                    
                    }

                    setTimeout(() => {

                        tokenHist.token = docT.data().token

                        tokenHist.amount = docT.data().amount

                        tokenHist.trans_id = docT.data().transaction_id != 0 ? '#'+docT.data().transaction_id : 'NA'

                        tokenHist.status = docT.data().status

                        tokenHist.purchased_date = moment(docT.data().createtime.toDate() ).format("DD/MM/YYYY, hh:mm A")

                        //console.log('TokenHistt:',tokenHist)


                        setTokenBuy((tokenBuyPrev) => [...tokenBuyPrev, tokenHist])
                        
                    }, 1000);
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                }
            });

            setTotalTokenCount(tokenPurchase - totalUsedToken)
        };

        async function getUsersData() {
            const docUserRef = doc(db, "user_master",''+parseInt(id)+'')

            const docUserSnap = await getDoc(docUserRef);

            if (docUserSnap.exists()) {

                //console.log("Document data:", docUserSnap.data());

                const userdata = {
                    image: docUserSnap.data().image,
                    username: docUserSnap.data().name,
                    email: docUserSnap.data().email,
                    status: docUserSnap.data().active_flag === 1 ? 'Activate' : 'Desactivate',
                    regDate: moment(docUserSnap.data().createtime.toDate() ).format("DD/MM/YYYY, hh:mm A"),
                }

                setUser(userdata)
            }
        };

        window.scrollTo(0, 0)

        setTokenBuy([])

        setTours([])

        setLoading(true)

        getTourData();

        getUsersData();

        setLoading(false)
    
    }, [])

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const columnsTok = [
        { 
            field: 'id', 
            title: 'Sr.No.', 
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
            field: 'amount', 
            title: 'Amount (In $)', 
        },
        { 
            field: 'trans_id', 
            title: 'Transaction Id', 
        },
        { 
            field: 'status', 
            title: 'Status',
            render: (params) => 
            <>
                <p style={{
                    color: params.status === 0 ? '#28a745' : '#dc3545', 
                    display: 'inline-block', 
                    padding: '0.25em 0.4em',
                    fontSize: '85%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline'}}>

                    {params.status === 0 ? 'Purchased' : 'Used'}
                
                </p>

            </>,
        },
        { 
            field: 'purchased_date', 
            title: 'Purchased Date & Time',
        },

    ];


    const columnsTours = [
        { 
            field: 'srno', 
            title: 'Sr.No.', 
        },
        { 
            field: 'image', 
            title: 'Image', 
            render: (params) => (
                <>
                    <img
                    src={(params.image !== undefined || params.image !== 'NA') ? params.image : placeholder}
                    alt={''}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="../../assets/images/placeholder.png";
                    }}
                    onClick={(e) => {setImageSelected((params.image !== undefined || params.image !== 'NA') ? params.image : placeholder); params.image && setOpen(true)}}
                    style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
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
            field: 'amount', 
            title: 'Amount (In $)', 
        },
        { 
            field: 'status', 
            title: 'Status',
            render: (params) => 
            <>
                <p style={{
                    color: params.status === 0 ? '#28a745' : '#dc3545', 
                    display: 'inline-block', 
                    padding: '0.25em 0.4em',
                    fontSize: '85%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline'}}>

                    {params.status === 0 ? 'Purchased' : 'Used'}
                
                </p>

            </>,
        },
        { 
            field: 'purchased_date', 
            title: 'Purchased Date & Time',
        },

    ];

    const actions = [

        {
            icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
            tooltip: 'View Tour',
            onClick: (event, row) => navigate('/view_tour/'+row.tourId)
        },
    ]

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
                                    <Link to="/manage_users" className="Linkp">
                                        Manage User
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">View User</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="rowViewUser">
                <div className="ViewUserSec">
                    <img  onClick={(e) => {setImageSelected(user.image);  setOpen(true)}} style={{width: '250px', height: '250px', borderRadius: '100%', cursor: 'pointer'}} src={user.image ? user.image : placeholder} 
                    alt=''
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = placeholder;
                    }}/>
                </div>
                <div className="ViewData"> 
                    <div className="ViewDataUser">
                        <h4 className="UDView">User Details</h4>
                        
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">User Name</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{user && user.username}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Email</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{user && user.email}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Registered Date & Time</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{user && user.regDate}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Status</b>
                            </div>
                            <div style={{
                                    backgroundColor: ('status' in user ) ? user.status === 'Activate' ? '#28a745' : '#dc3545' : 'white' , 
                                    display: 'inline-block', 
                                    padding: '0.25em 0.4em',
                                    fontSize: '75%',
                                    fontWeight: '700',
                                    marginLeft: '12px',
                                    textAlign: 'center',
                                    color: 'white',
                                    borderRadius: '0.25rem',
                                    whiteSpace: 'nowrap',
                                    lineBreak: 'anywhere',
                                    verticalAlign: 'center',    
                                    maxWidth: '20%' }} 
                                 className="rowDataValue">{user && user.status}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Total Token Count</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{TotalTokenCount ? TotalTokenCount : ''}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ViewFriends">

                <Tabs className="tabsProfile" value={value} onChange={handleChange}>
                    <Tab style={{color: '#0a3366', padding: '20px'}} label="Token History"  />
                    <Tab style={{color: '#0a3366', padding: '20px'}} label="Tours"  />
                </Tabs>

                <TabPanel value={value} index={0}>
                
                    <Table columns={columnsTok} rows={tokenBuy} title={'Token History List'}/>
                        
                </TabPanel>

                <TabPanel value={value} index={1}>
                
                    {//<Table columns={columns} rows={userFriends} actions={actions} title={'Friends List'}/>
                    }
                    <Table columns={columnsTours} rows={tours} actions={actions} title={'Tours List'}/>
                        
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
                                src={imageSelected ? imageSelected : placeholder}
                                alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = placeholder;
                                }}
                                style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                            />
                        </Fade>
                    </div>
                </Modal>

            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}