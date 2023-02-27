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
import NoCity from '../../assets/images/noCity.jpg';
import LoadingSpinner from "../../components/Loading";


export function ViewCity() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [tokenBuy, setTokenBuy] = useState([])
  const [city, setCity] = useState({})
  const [tours, setTours] = useState([])
  const [imageSelected, setImageSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [TotalTokenCount, setTotalTokenCount] = useState(null)

  const { id } = useParams();

  const navigate = useNavigate();

  const docRef = query(collection(db, "tour_master"), where("delete_flag", "==", 0), where("city_id", '==', parseInt(id)));

    useEffect(() => {

        async function getTourData() {
            const querySnapshot = await getDocs(docRef);

            //console.log(id)

            let srno = 0

            querySnapshot.forEach((docT) => {

                var tokenHist = {}

                //console.log()

                if (docT.exists()) {

                    srno++

                    tokenHist.srno = srno

                    tokenHist.tourId = docT.data().tour_id

                    tokenHist.image = docT.data().url

                    tokenHist.tourName = docT.data().name


                    //console.log('TokenHistt:',tokenHist)


                    setTours((prevTours) => [...prevTours, tokenHist])
                        
                }
            });
        };

        async function getCityData() {
            const docCityRef = doc(db, "city_master",''+parseInt(id)+'')

            const docCitySnap = await getDoc(docCityRef);

            if (docCitySnap.exists()) {

                //console.log("Document data:", docUserSnap.data());

                const cityData = {
                    image: docCitySnap.data().url,
                    country: docCitySnap.data().state,
                    city: docCitySnap.data().name,
                    description: docCitySnap.data().description,
                }

                setCity(cityData)
            }
        };

        window.scrollTo(0, 0)

        setTours([])
        
        setCity([])

        setLoading(true)

        getCityData();

        getTourData();

        setLoading(false)
    
    }, [])

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


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
                    src={(params.image !== undefined || params.image !== 'NA') ? params.image : NoCity}
                    alt={''}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="../../assets/images/NoCity.png";
                    }}
                    onClick={(e) => {setImageSelected((params.image !== undefined || params.image !== 'NA') ? params.image : NoCity); params.image && setOpen(true)}}
                    style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                    />
                    
                </>
            )
        },
        { 
            field: 'tourName', 
            title: 'Name', 
        },

    ];

    const actions = [

        {
            icon: () => <HiIcons.HiOutlineEye color="#F7BE07"/>,
            tooltip: 'View Tour',
            onClick: (event, row) => navigate('/view_tour/'+row.tour_id)
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
                                    <Link to="/manage_city" className="Linkp">
                                        Manage City
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">View City</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="rowViewUser">
                <div className="ViewUserSec">
                    <img  onClick={(e) => {setImageSelected(city.image);  setOpen(true)}} style={{width: '350px', height: '350px', borderRadius: '3%', cursor: 'pointer'}} src={city.image ? city.image : NoCity} 
                    alt=''
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = NoCity;
                    }}/>
                </div>
                <div className="ViewData"> 
                    <div className="ViewDataUser">
                        <h4 className="UDView"> City Details</h4>
                        
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Country Name</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{city && city.country}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">City Name</b>
                            </div>
                            <div style={{lineBreak: 'anywhere'}} className="rowDataValue">{city && city.city}</div>
                        </div>
                        <br/>
                        <div className="rowDataView">
                            <div className="rowDataU">
                                <b className="rowDataUV">Description</b>
                            </div>
                            <div className="rowDataValue">{city && city.description}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ViewFriends">

                <Tabs className="tabsProfile" value={value} onChange={handleChange}>
                    <Tab style={{color: '#0a3366', padding: '20px'}} label="Tours"  />
                </Tabs>

                <TabPanel value={value} index={0}>
                
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
                                src={imageSelected ? imageSelected : NoCity}
                                alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = NoCity;
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