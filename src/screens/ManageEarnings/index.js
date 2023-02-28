import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../Header";
import Table from '../../components/Table';
import LoadingSpinner from '../../components/Loading'
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import '../../App.css'
import moment from "moment";




export function ManageEarnings() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);


  const [navisOpen, setNavisOpen] = useState(false)


  const [earnings, setEarnings] = useState([])


  const [loading, setLoading] = useState(false)

  const docRef = query(collection(db, "Buy_token_master"), orderBy("createtime","desc"), where("delete_flag", "==", 0), where("status", "==", 0));


  useEffect(() => {

    setLoading(true)

    

    async function getEarningsData() {
        const querySnapshot = await getDocs(docRef);

        //console.log(id)

        //console.log(querySnapshot)

        let srno = 0

        querySnapshot.forEach((docT) => {

            var earningsData = {}

            //console.log()

            if (docT.exists()) {

                srno++

                earningsData.id = srno

                //console.log('TOUR_ID: ',docT.data())
                const docUserRef = query(collection(db, "user_master"), where("user_id", '==', parseInt(docT.data().user_id)));

                //console.log(docTourRef)

               
                
                getDocs(docUserRef).then((resUser) => {

                    

                    if(resUser.docs.length > 0){

                    
                        earningsData.userName = resUser.docs[0].data().name

                    }
                    else{

                        earningsData.userName = 'NA'

                    }

                });

                setTimeout(() => {

                    earningsData.token = docT.data().token

                    earningsData.amount = docT.data().amount

                    earningsData.purchased_date = moment(docT.data().createtime.toDate() ).format("DD/MM/YYYY, hh:mm A")

                    //console.log('TokenHistt:',tokenHist)


                    setEarnings((earningsPrev) => [...earningsPrev, earningsData])
                    
                }, 1000);
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
            }
        });
    };

    getEarningsData();


    setLoading(false)

}, [])


  const columns = [
    { 
        field: 'id', 
        title: 'Sr.No.',  
    },
    { 
        field: 'userName', 
        title: 'User Name', 
    },
    { 
        field: 'token', 
        title: 'Token', 
    },
    { 
        field: 'amount', 
        title: 'Amount(In $)', 
    },
    { 
        field: 'purchased_date', 
        title: 'Purchased Date & Time', 
    },
];

  

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
                                <li className="breadcrumb-item active" aria-current="page">Manage Earnings</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="tableView">
                <Table columns={columns} rows={earnings} title={'Earnings List'}/>
            </div>
        </div>
        {/* 
       
        */}
    </>
    
  );
}