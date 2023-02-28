import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../Header";
import * as HiIcons from 'react-icons/hi';
import Table from '../../components/Table';
import LoadingSpinner from '../../components/Loading'

  import { collection, getDocs, query, where} from "firebase/firestore";
  import { db } from "../../Auth/firebase";
import { useNavigate } from "react-router-dom";
import '../../App.css';
import * as GrIcons from 'react-icons/gr';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';





export function ContactUs() {

  const [openAlert, setOpenAlert] = useState(false)

  const [navisOpen, setNavisOpen] = useState(false)

  const [contactUsData, setContactUsData] = useState([])

  const [messageAlert, setMessageAlert] = useState('')



  const [loading, setLoading] = useState(false)

  
  const navigate = useNavigate();


  useEffect(() => {

    async function getContactData() {

        setLoading(true)

        const docRef = query(collection(db, "contact_us_master"), where("delete_flag", "==", 0));

        const querySnapshot = await getDocs(docRef);

        let srno = 0

        querySnapshot.forEach((doc) => {

            srno++
            const contactUs = {
                id: srno,
                contact_id: doc.data().contact_id,
                name: doc.data().name,
                email: doc.data().email,
                message: doc.data().message,
                status: doc.data().status,
            }

            setContactUsData((prevContact) => [...prevContact, contactUs])
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });

        setLoading(false)

    }

    getContactData();
  
  }, [])

    //HiOutlineReply

const columns = [

    { 
        field: 'id', 
        title: 'Sr.No.', 
    },
    { 
        field: 'name', 
        title: 'Name', 
    },
    { 
        field: 'email', 
        title: 'Email', 
    },
    { 
        field: 'message', 
        title: 'Message', 
    },
    {
        field: 'status',
        title: 'Status',
        render: (params) => (
            <>
                <p style={{
                    color: params.status === 1 ? 'green' : 'orange', 
                    display: 'inline-block', 
                    padding: '0.25em 0.4em',
                    fontSize: '85%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    borderRadius: '0.25rem',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline'}}>

                    {params.status === 0 ? 'Pending' : 'Replied'}
                
                </p>
            </>
        )
    },
]


const replyMessage = (params) =>{

    navigate('/send_reply/'+ params.contact_id)


}


const actions = [
    {
        icon: () => <HiIcons.HiOutlineReply color="#000" />,
        tooltip: 'Reply Message',
        onClick: (event, row) => { 
            if(row.status === 1){ 
                
                setOpenAlert(false);

                setOpenAlert(true);

                setMessageAlert('You have already replied to this message');
            
            }
            else{

                replyMessage(row)

            }
        }
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
                                <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                color={'error'}
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
            <div className="tableView">
                <Table columns={columns} rows={contactUsData} actions={actions} title={'Contact Us List'}/>
            </div>
            
        </div>
    </>
    
  );
}