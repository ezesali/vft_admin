import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import Header from "../Header";
import LoadingSpinner from '../../components/Loading'
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import "../../App.css";

export function Home() {

  //const {currentUser, logout, resetPassword} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [usersCount, setUsersCount] = useState(0)
  const [cityCount, setCityCount] = useState(0)
  const [tourCount, setTourCount] = useState(0)
  const [restautantCount, setRestautantCount] = useState(0)
  const [contactUsCount, setContactUsCount] = useState(0)
  const [earningsCount, setEarningsCount] = useState(0)
  const [deletedUser, setDeletedUser] = useState(0)


  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const docRefUser = query(collection(db, "user_master"), where("delete_flag", "==", 0), where("user_type", '==', 1), where("profile_complete", '==', 1));

  const docRefCity = query(collection(db, "city_master"), where("delete_flag", "==", 0));

  const docRefTour = query(collection(db, "tour_master"), where("delete_flag", "==", 0));

  const docRefRestaurants = query(collection(db, "restaurant_master"), where("delete_flag", "==", 0));

  const docRefContactUs = query(collection(db, "contact_us_master"), where("delete_flag", "==", 0));

  const docRefUserDeleted = query(collection(db, "user_master"), where("delete_flag", "==", 1), where("user_type", '==', 1));

  const docRefEarnings = query(collection(db, "Buy_token_master"), where("delete_flag", "==", 0), where("status", "==", 0));


  useEffect(() => {

    async function getCounts() {

        setLoading(true)

        const querySnapshotUsers = await getDocs(docRefUser);
        const querySnapshotCities = await getDocs(docRefCity);
        const querySnapshotTours = await getDocs(docRefTour);
        const querySnapshotRestaurants = await getDocs(docRefRestaurants);
        const querySnapshotContactUs = await getDocs(docRefContactUs);
        const querySnapshotUserDeleted = await getDocs(docRefUserDeleted);

        const querySnapshotEarnings = await getDocs(docRefEarnings);        

        setCityCount(querySnapshotCities.docs.length)

        setUsersCount(querySnapshotUsers.docs.length)

        setTourCount(querySnapshotTours.docs.length)

        setRestautantCount(querySnapshotRestaurants.docs.length)

        setContactUsCount(querySnapshotContactUs.docs.length);

        var countEarn = 0;

        querySnapshotEarnings.forEach((res) => {

            countEarn = countEarn + parseInt(res.data().amount)

        })

        setEarningsCount(countEarn)

        setDeletedUser(querySnapshotUserDeleted.docs.length)

        setLoading(false)
    };

    getCounts();

 }, []);


  return (
    
    <>
        {loading && <LoadingSpinner />}
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '180px' : null}} className="dashboardContainer">
            <div style={{height: navisOpen ? '100px' : null}} className="rowDash">
                <div onClick={() => navigate("/manage_users")} style={ navisOpen ? {width: '40%'} : {width: '100%'}} className="totals">
                    <div className="d-flex">
                        <div className="widget-data">
                            <div className="mb-0" id="users_count">{usersCount}</div>
                            <div className="weight-600">Total Users</div>
                        </div>
                        <FaIcons.FaUsers className="iconsBtn" size={24}/>
                    </div>
                </div>
                <div onClick={() => navigate("/manage_city")} style={ navisOpen ? {width: '40%', marginLeft: '40px'} : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="city_count">{cityCount}</div>
                                <div className="weight-600">Total City</div>
                            </div>
                            <FaIcons.FaBuilding className="iconsBtn" size={24}/>
                        </div>
                    </div>
                </div>
                <div onClick={() => navigate("/manage_tours")} style={ navisOpen ? {width: '40%'} : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="tour_count">{tourCount}</div>
                                <div className="weight-600">Total Tours</div>
                            </div>
                            <FaIcons.FaTruck className="iconsBtn" size={24}/>
                        </div>
                    </div>
                </div>
                <div onClick={() => navigate("/manage_restaurants")} style={ navisOpen ? {width: '40%', marginLeft: '40px'} : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="restaurant_count">{restautantCount}</div>
                                <div className="weight-600">Total Restaurants</div>
                            </div>
                            <MdIcons.MdOutlineRestaurant className="iconsBtn" size={24}/>
                            
                        </div>
                    </div>
                </div>
                <div onClick={() => navigate("/manage_contact")} style={ navisOpen ? {width: '40%'} : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="contact_count">{contactUsCount}</div>
                                <div className="weight-600">Total Contact Us</div>
                            </div>
                            <FaIcons.FaPhoneAlt className="iconsBtn" size={24}/>
                        </div>
                    </div>
                </div>
                <div onClick={() => navigate("/manage_earnings")} style={ navisOpen ? {width: '40%', marginLeft: '40px'} : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="earning_count">${earningsCount}</div>
                                <div className="weight-600">Total Earnings</div>
                            </div>
                            <BsIcons.BsCashCoin className="iconsBtn" size={24}/>
                        </div>
                    </div>
                </div>
                <div onClick={() => navigate("/deleted_users")} style={ navisOpen ? {width: '40%' } : {width: '100%'}} className="totals">
                    <div className="total-link" style={{textDecoration: 'none'}}>
                        <div className="d-flex">
                            <div className="widget-data">
                                <div className="mb-0" id="deleted_users_count">{deletedUser}</div>
                                <div className="weight-600">Total Deleted Users</div>
                            </div>
                            <FaIcons.FaUserTimes className="iconsBtn" size={24}/>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    </>
    
  );
}