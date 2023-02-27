import React, {useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';

import * as GrIcons from 'react-icons/gr';
import LoadingSpinner from "../../components/Loading";
import { serverTimestamp } from "firebase/firestore";

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import emailjs from '@emailjs/browser';
import "../../App.css";


export function Reply() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [titleForm, setTitleForm] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [colorError, setColorError] = useState('')

  const replyMessage = (e) => {

    setLoadingUpdate(true)

    const docContactRef = doc(db, "contact_us_master",''+parseInt(id)+'')

    getDoc(docContactRef).then((docContactSnap) => {

        if (docContactSnap.exists()) {


            updateDoc(docContactRef, {
                status          : 1,
                reply_date_time : serverTimestamp(),
                updatetime      : serverTimestamp()
            }).then(() =>{

                e.preventDefault();
    
                emailjs.send("service_9i3h25v","template_xr16qmm",{
                    subject: titleForm,
                    to_name: docContactSnap.data().name,
                    message: messageForm,
                    reply_to: docContactSnap.data().email,
                },'kOULwY3paa6WWhrsu').then((result) => {
                    setLoadingUpdate(false)

                    if(result.status === 200) {

                        setColorError('success')
    
                        setMessageAlert('Reply sent successfully')
                        setOpenAlert(true)
    
                        setMessageForm('')
                        setTitleForm('')
    
                        window.scrollTo(0, 0)

                    }
                    else{

                        setLoadingUpdate(false)

                        setColorError('error')
        
                        setMessageAlert(result.text)
                        setOpenAlert(true)

                        setMessageForm('')
                        setTitleForm('')

                        window.scrollTo(0, 0)

                    }

                }, (error) => {
                    setLoadingUpdate(false)

                    setColorError('error')
    
                    setMessageAlert(error.text)
                    setOpenAlert(true)

                    setMessageForm('')
                    setTitleForm('')

                    window.scrollTo(0, 0)
                }).catch((err) => {

                    setLoadingUpdate(false)

                    setColorError('error')
    
                    setMessageAlert(err)
                    setOpenAlert(true)

                    setMessageForm('')
                    setTitleForm('')

                    window.scrollTo(0, 0)
                    

                });
    
            });

            //navigate('/edit_city/'+ params.row.city_id, { state: { cityData: citydata }})


        }



    });



  }

  const { id } = useParams();
  return (
    
    <>
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
                                    <Link to="/manage_contact" className="Linkp">
                                        Contact Us
                                    </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Send Reply</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                color={colorError}
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
            <div className="contentReply"> 
            
                <h3 className="reportName">Send Reply</h3>

                <div className="inputsReply">

                    <TextField InputLabelProps={{shrink: true}} onChange={(e) => setTitleForm(e.target.value)} label='Title' placeholder="Enter Title" id="outlined-basic" variant="outlined" />
                    
                </div>

                <div className="inputsReply">

                    <TextField InputLabelProps={{shrink: true}} minRows={6} multiline onChange={(e) => setMessageForm(e.target.value)} label='Message' placeholder="Enter Message" id="outlined-basic" variant="outlined" />

                </div>
                <div style={{paddingInline: '40px'}}>
                    <button 
                    onClick={(e) => replyMessage(e)} className="btnSubmitReply" type="submit">
                        {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Submit'}
                    </button> 
                </div>  
            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}