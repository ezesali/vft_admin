import React, {useEffect, useState} from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import '../../App.css'
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Auth/firebase";
import * as GrIcons from 'react-icons/gr';
import * as GiIcons from 'react-icons/gi';
import { useLocation, useParams} from "react-router-dom";
import {
    Modal,
    Backdrop,
    Fade,
    TextField,
  } from "@material-ui/core";


import LoadingSpinner from "../../components/Loading";
import { serverTimestamp } from "firebase/firestore";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import { useNavigate } from "react-router-dom";

export function ManageToken() {
  
  //const {currentUser, updateUser, logout} = useContext(AuthContext);

  const [navisOpen, setNavisOpen] = useState(false)
  const [token, setToken] = useState({})
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [severityMsg, setSeverityMsg] = useState('')

  const navigate = useNavigate();


  const docRef = query(collection(db, "token_master"));



  const [loading, setLoading] = useState(false)


    useEffect(() => {

        setLoading(true)

        getTokenData()

        setLoading(false)
    
    }, [])


    async function getTokenData() {

        const querySnapshot = await getDocs(docRef);

        querySnapshot.forEach((doc) => {

            const tokenData = {
                token_id: doc.id,
                token_value: doc.data().amount
            }

            setToken(tokenData)
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

        });
    };

  
     const onChangeToken = e => {
        
        e.preventDefault()

        let newToken = token

        newToken.token_value = e.target.value

        setToken(newToken)

    }


    const submitEdit = async() => {

        setLoadingUpdate(true)

        if(token.token_value == '') {


            setLoadingUpdate(false)

            setSeverityMsg('error')

            setMessageAlert('Token are required')

            setOpenAlert(true)

            window.scrollTo(0, 0)

        }

        else {

            const docCityRef = doc(db, "token_master",''+parseInt(token.token_id)+'')

            getDoc(docCityRef).then((docCitySnap) => {


                if (docCitySnap.exists()) {

                    updateDoc(docCityRef, {
                        amount         : token.token_value,
                        updatetime     : serverTimestamp()
                    }).then(() =>{

                        setLoadingUpdate(false)

                        setSeverityMsg('success')
            
                        setMessageAlert('Token Edited Successfully')
                        setOpenAlert(true)

                        window.scrollTo(0, 0)


                        setTimeout(() => {

                            navigate('/')
                            
                        }, 2000);
            
                    });

                }
            }).catch((res) => {

                setLoadingUpdate(false)

                setSeverityMsg('error')
    
                setMessageAlert('An error was ocurred')
                setOpenAlert(true)

                window.scrollTo(0, 0)


            });
        }
    }



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
                                <li className="breadcrumb-item active" aria-current="page">Manage Token</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                severity={severityMsg}
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
            <div className="rowViewCity">
                <div className="titleCityEditAdd">
                    <h4 className="editCityH4">Token</h4>
                </div>

                <div className="cityInputs">

                    <TextField required InputLabelProps={{shrink: true}} key={token.token_value ? 'notLoadedYet' : 'loaded'} onChange={onChangeToken} defaultValue={token && token.token_value} label="Per Token Price" placeholder="Enter Per Token Price" id="outlined-basic" variant="outlined" />
               
                </div>

                <button 
                onClick={() => submitEdit()} className="btnSubmitCity" type="submit">
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px'}}/> : 'Update'}
                </button>
                {//<button onClick={( ) => console.log(state.cityData)} className="btnSubmitCity" type="submit">Update</button>
                }
            </div>
        </div>

        {/* 
       
        */}
    
    
    </>
    
  );
}