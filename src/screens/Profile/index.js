import React, {useEffect, useState, useContext} from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import "../../App.css";

import TabPanel from "../../components/TabPanel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {FaEyeSlash} from 'react-icons/fa';
import {FaEye} from 'react-icons/fa';
import { Button } from "@mui/material";
import {
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
import LoadingSpinner from '../../components/Loading';
import placeholder from '../../assets/images/placeholder.png'; // with
import * as GrIcons from 'react-icons/gr';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { EmailAuthProvider, updatePassword, reauthenticateWithCredential } from "firebase/auth";


  /*const useStyles = makeStyles((theme) => ({
    gridList: {
      flexWrap: "nowrap",
      transform: "translateZ(0)"
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        backgroundcolor: "red"
      }
    },
    img: {
      outline: "none"
    }
  }));*/



export function Profile() {
  
  const {currentUser, updateUser} = useContext(AuthContext);



  const [value, setValue] = useState(0);
  const [navisOpen, setNavisOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showNewPassConfirm, setShowNewPassConfirm] = useState(false)
  const [img, setImg] = useState(currentUser.photoURL ? currentUser.photoURL : '')
  const [name, setName] = useState(currentUser.displayName ? currentUser.displayName : '')
  //const [email, setEmail] = useState(currentUser.email ? currentUser.email : '')
  const [ok, setOk] = useState(false);
  const [imgUpload, setImgUpload] = useState('')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')
  const [passOk, setPassOk] = useState(null)
  const [loadingUpdate, setLoadingUpdate] = useState(false)


  /*const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')*/

  //const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false)
  //const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

useEffect(() => {

}, [])

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const _showPassword = (idx) => {

    switch (idx) {
        case 0:

            setShowPassword(!showPassword)
            break;
        case 1:
            setShowNewPass(!showNewPass)
            break
        case 2:
            setShowNewPassConfirm(!showNewPassConfirm);
            break
        default:
    }

  }


  const handleChangePass = (event, idx) => {

    switch (idx) {
        case 0:

            setCurrentPass(event.target.value)
            break;
        case 1:
            setNewPass(event.target.value)
            break
        case 2:
            setConfirmNewPass(event.target.value)
            break
        default:
            break
    }
  }

  const handleChangeImg = (event) => {
    if (event.target.files && event.target.files[0]) {
        setImg(event.target.files[0])
        setImgUpload(URL.createObjectURL(event.target.files[0]))
    }
  };

  const handleChangeProfData = (event) => {

    setName(event.target.value)

  }

    const handleUpdateProfile = () => {

        setMessage('User Update Succesfully')
        setSeverity('success')
        
        updateUser(img, currentUser.email, name, currentUser, setLoadingUpdate, setOk);

        window.scrollTo(0, 0)

        setTimeout(() => {

            navigate('/', {refresh: true})
            
        }, 4000);

        

    }

    const reauthenticate = (currentPassword) => {
        var cred = EmailAuthProvider.credential(currentUser.email, currentPassword);
        return reauthenticateWithCredential(currentUser,cred);
    }


    // Changes user's password...
    const onChangePasswordPress = () => {

        setLoadingUpdate(true)

        reauthenticate(currentPass).then(() => {

            if(currentPass === newPass){

                setMessage('New Password must be different from your current password')
                setSeverity('error')
                setOk(true)
                window.scrollTo(0, 0)
                setCurrentPass('')
                setNewPass('')
                setConfirmNewPass('')
                setLoadingUpdate(false)
                return

            }


            updatePassword(currentUser, newPass).then(() => {
                setOk(true)
                setSeverity('success')
                setMessage('Password change successfully')
                window.scrollTo(0, 0)
                setLoadingUpdate(false)

                setValue(0);
            })
            .catch((error) => { 
                setOk(true)
                setSeverity('error')
                setMessage('Error changing password. \n'+error.message)
                setCurrentPass('')
                setNewPass('')
                setConfirmNewPass('')
                console.log(error.message);
                window.scrollTo(0, 0) 
                setLoadingUpdate(false)
            });

        }).catch((error) => { 
            setOk(true)
            setSeverity('error')
            setMessage('Error with current password. \n'+error.message)
            setCurrentPass('')
            setNewPass('')
            setConfirmNewPass('')
            console.log(error.message); 
            window.scrollTo(0, 0)
            setLoadingUpdate(false)
        });

        
    }



    const checkNewPass = () => {

        if(newPass && confirmNewPass) {
            
            if(newPass === confirmNewPass){


                setPassOk(true)

                return true

            }
            else{

                setPassOk(false)

                return false
            }
        }
        else{

            setPassOk(null)

            return null
        }

    }

  


  return (
    
    <>
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '180px' : null}} className="dashboardContainerProfile">
            <div className="page-header">
                <div className="row-profile">
                    <div className="profileHead">
                        <div className="title">
                            <h4>Profile</h4>
                        </div>
                        <nav aria-label="breadcrumb" role="navigation">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                <Link to="/" className="Linkp">
                                    Dashboard
                                </Link>
                                </li>
                                <>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</>
                                <li className="breadcrumb-item active" aria-current="page">Profile</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={ok}>
                <Alert
                severity={severity}
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOk(false);
                    }}
                    >
                    <GrIcons.GrClose color="#000"/>
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                {message}
                </Alert>
            </Collapse>
            <div className="rowProfile">
                <div className="profileSec">
                    <div className="profSec">
                        <div className="profile-photo">
                            <img
                            src={currentUser.photoURL ? currentUser.photoURL : placeholder}
                            alt={''}
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src={placeholder};
                            }}
                            onClick={(e) => {currentUser.photoURL && setOpen(true)}}
                            style={{cursor: 'pointer', borderRadius: '100%', width: '170px', height: '160px'}}
                            />
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
                                            src={currentUser.photoURL ? currentUser.photoURL : placeholder}
                                            alt=""
                                            style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                                        />
                                    </Fade>
                                </div>
                            </Modal>
                        </div>
                        <h5 className="name-show" id="name_show">{currentUser.displayName}</h5>
                        <p className="email-show" id="email_show">{currentUser.email}</p>
                    </div>
                </div>
                <div className="profileData">

                    <Tabs className="tabsProfile" value={value} onChange={handleChange}>
                        <Tab style={{color: '#0a3366', padding: '20px'}} label="PROFILE"  />
                        <Tab style={{color: '#0a3366', padding: '20px'}} label="CHANGE PASSWORD"  />
                    </Tabs>

                    <TabPanel value={value} index={0}>
                        <div className="profile-setting">
                            <p style={{fontWeight: 500, fontSize: '14px'}}>Full Name</p>
                            <div className="input-group custom">
                                <input value={name ? name : currentUser.displayName ? currentUser.displayName : name ? name : ''} onChange={(e) => handleChangeProfData(e)} type={'text'} className="form-control" placeholder="Enter Name" id="full-name" name="full-name"/>
                            </div>
                            <p style={{fontWeight: 500, fontSize: '14px'}}>Email</p>
                            <div className="input-group custom">
                                <input style={{backgroundColor: '#dee2e6', cursor: 'not-allowed'}} disable value={currentUser.email} type={'text'} className="form-control" placeholder="Enter Email" id="email" name="email"/>
                            </div>
                            <p style={{fontWeight: 500, fontSize: '14px'}}>Image</p>
                            <img
                            src={imgUpload ? imgUpload : placeholder}
                            alt={''}
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src={placeholder};
                            }}
                            onClick={(e) => {imgUpload && setOpenUpload(true)}}
                            style={{height: '100px', width: '100px', borderRadius: '100%', cursor: imgUpload && 'pointer', marginBottom: '20px'}}
                            />
                            <Modal
                                open={openUpload}
                                onClose={handleCloseUpload}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                timeout: 500
                                }}>
                                <div onClick={handleCloseUpload} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                
                                    <Fade in={openUpload} timeout={500} >
                                        <img
                                            src={imgUpload ? imgUpload : placeholder}
                                            alt=""
                                            style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                                        />
                                    </Fade>
                                </div>
                            </Modal>
                            <div>
                                <Button
                                variant="contained"
                                component="label"
                                style={{backgroundColor: '#000', borderStyle: 'dashed'}}>
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleChangeImg}
                                        
                                    />
                                </Button>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', height: '40px', marginTop: '20px'}}>

                                <button 
                                style={(ok || !imgUpload) ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed'} : {backgroundColor: '#000'}} 
                                disabled={(ok || !imgUpload) ? true : false} 
                                onClick={handleUpdateProfile} className="btnUpdateProf" type="submit">
                                {loadingUpdate ? <LoadingSpinner styleContainer={{height: '10px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}
                                </button>
                            </div>
                        </div>
                        
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="profile-PassSetting">
                            <p style={{fontWeight: 500, fontSize: '14px'}}>Enter Current Password</p>
                            <div className="input-group custom">
                                <input style={{borderColor: currentPass ? 'green' : 'grey'}} onChange={(e) => handleChangePass(e, 0)} value={currentPass} type={showPassword ? 'text' : "password"} className="form-control" placeholder="Enter Current Password" maxLength="15" id="password1" name="password1"/>
                                <div  className="input-group-append custom">
                                    <span onClick={() => _showPassword(0)} className="input-group-text">
                                        {showPassword ?<FaEye size={'20'}/> : <FaEyeSlash size={'20'}/> }
                                    </span>
                                </div>
                            </div>
                            <p style={{fontWeight: 500, fontSize: '14px'}}>New Password</p>
                            <div className="input-group custom">
                                <input onBlur={() => checkNewPass()} style={{borderColor: passOk === null ? 'grey' : passOk ? 'green' : 'red'}} onChange={(e) => handleChangePass(e, 1)} value={newPass} type={showNewPass ? 'text' : "password"} className="form-control" placeholder="Enter New Password" maxLength="15" id="password2" name="password2"/>
                                <div  className="input-group-append custom">
                                    <span onClick={() => _showPassword(1)} className="input-group-text">
                                        {showNewPass ?<FaEye size={'20'}/> : <FaEyeSlash size={'20'}/> }
                                    </span>
                                </div>
                            </div>
                            <p style={{fontWeight: 500, fontSize: '14px'}}>Confirm Password</p>
                            <div className="input-group custom">
                                <input onBlur={() => checkNewPass()} style={{borderColor: passOk === null ? 'grey' : passOk ? 'green' : 'red'}} onChange={(e) => handleChangePass(e, 2)} value={confirmNewPass} type={showNewPassConfirm ? 'text' : "password"} className="form-control" placeholder="Enter Confirm Password" maxLength="15" id="password3" name="password3"/>
                                <div  className="input-group-append custom">
                                    <span onClick={() => _showPassword(2)} className="input-group-text">
                                        {showNewPassConfirm ?<FaEye size={'20'}/> : <FaEyeSlash size={'20'}/> }
                                    </span>
                                </div>
                            </div>
                            <p style={{fontWeight: 500, fontSize: '14px', color: 'red', marginTop: '-15px'}}>{passOk === false && "Passwords doesn't match"}</p>
                            <button onClick={() => onChangePasswordPress()} className="btnChangePass" type="submit">
                                {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', backgroundColor: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Update'}
                            </button>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>

 {/* 
        <div className="main-container">
            <div className="pd-ltr-20 xs-pd-20-10">
                <div className="min-height-200px">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="title">
                                    <h4>Profile</h4>
                                </div>
                                <nav aria-label="breadcrumb" role="navigation">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="dashboard.html">Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">Profile</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div id="msgSuccessErrorHtml">
                    </div>
                    <div className="row">
                        
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-30">
                            <div className="card-box height-100-p overflow-hidden">
                                <div className="profile-tab height-100-p">
                                    <div className="tab height-100-p">
                                        <ul className="nav nav-tabs customtab" role="tablist">
                                        <li className="nav-item">
                                                <a className="nav-link active" data-toggle="tab" href="#profile" role="tab">Profile</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" data-toggle="tab" href="#tasks" role="tab">Change Password</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content">         
                                        <div className="tab-pane fade show " id="tasks" role="tabpanel">
                                                <div className="profile-setting">
                                                    <form id="form_validation_update_password">
                                                        <ul className="profile-edit-list row">
                                                            <li className="weight-500 col-md-12">
                                                                <div className="form-group">
                                                                    <label>Current Password</label>
                                                                    <input className="form-control form-control-lg" type="password" name="old_password" id="old_password" placeholder="Enter Current Password" maxlength="16"/>
                                                                    <span toggle="#old_password" className="fa fa-fw fa-eye field-icon toggle-password" style="left: -13px;color: black;"></span> 
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>New Password</label>
                                                                    <input className="form-control form-control-lg" type="password" name="new_password" id="new_password" placeholder="Enter New Password" maxlength="16"/>
                                                                    <span toggle="#new_password" className="fa fa-fw fa-eye field-icon toggle-password" style="left: -13px;color: black;"></span> 
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Confirm Password</label>
                                                                    <input className="form-control form-control-lg" type="password" name="confirm_password" id="confirm_password" placeholder="Enter Confirm Password" maxlength="16"/>
                                                                    <span toggle="#confirm_password" className="fa fa-fw fa-eye field-icon toggle-password" style="left: -13px;color: black;"></span> 
                                                                </div>                                       
                                                                <div className="form-group mb-0">
                                                                    <input type="submit" className="btn btn-primary" value="Update"/>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </form>
                                                </div>
                                            </div>                                   
                                            <div className="tab-pane fade show active" id="profile" role="tabpanel">
                                                <div className="profile-setting">
                                                    <form id="form_validation_update_profile">
                                                        <ul className="profile-edit-list row">
                                                            <li className="weight-500 col-md-12">
                                                                <h4 className="text-blue h5 mb-20">Edit Your Profile</h4>
                                                                <div className="form-group">
                                                                    <label>Full Name</label>
                                                                    <input className="form-control form-control-lg" type="text" placeholder="Enter Name" id="name" name="name"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Email</label>
                                                                    <input className="form-control form-control-lg" type="text" id="admin_email" name="email" placeholder="Enter Email"/>
                                                                    <span style="display: none;color: red;" id="emailExist">Email already exist</span>
                                                                </div>                                            
                                                                <div className="form-group ">
                                                                    <label>Image</label><br/>
                                                                    <input type="hidden" id="fileName"/>
                                                                    <input type="hidden" id="ext"/>
                                                                    <input type="hidden" id="img_path"/>
                                                                    <a href="#img_view"> 
                                                                        <img src="assets/images/placeholder.png" id="image-holder" className="img-preview" onclick="view_img(this,'img')"/><br></br> 
                                                                        <div className="open_my_popup" id="img_view">
                                                                            <div className="imgae_view_bg"></div>
                                                                            <div className="view_popup"> 
                                                                                <img src="" id="image_here"/> 
                                                                            </div>
                                                                            <a className="close_my_popup" onclick="closePopup();">
                                                                                <img src="vendors/images/cross.png" />
                                                                            </a>
                                                                        </div>     
                                                                    </a>   
                                                                    <input className="form-control" type="file" name="image" id="fileUpload" accept="image/png,image/jpeg"/>
                                                                    <label style="color:red;">(Note : please choose image resolution with 500X500 pixels)</label>                         
                                                                </div>                          
                                                                <div className="form-group mb-0">
                                                                    <input type="submit" className="btn btn-primary" value="Update"/>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        */}
    </>
    
    /*
    <div className="dashboardContainer">
      <div className="">
        <p className="text-xl mb-4">welcome {user.displayName || user.email || ''}</p>
        <button
          className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
    </div>
    <div className="dashboardContainer">
      <div className="header">
          <div className="header-left">
              <div className="menu-icon dw dw-menu"></div>           
          </div>
          <div className="header-right">          
              <div className="user-info-dropdown">
                  <div className="dropdown">
                      <a className="dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                          <span className="user-icon">
                              <img src="" alt="User Image"  onerror="this.src='assets/images/placeholder.png'" id="admin_headerimage" className="rounded-circle"/>
                          </span>
                          <span className="user-name" id="user_name"></span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list">
                          <a className="dropdown-item" href="profile.html"><i className="dw dw-user1"></i> Profile</a>                     
                          <a className="dropdown-item" onclick="logout()"><i className="dw dw-logout"></i> Logout</a>
                      </div>
                  </div>
              </div>         
          </div>
      </div>
    </div>
  */
    /*
    <div className="left-side-bar">
        <div className="brand-logo">
            <a href="dashboard.html">
                <!-- <img src="vendors/images/deskapp-logo.svg" alt="" className="dark-logo"> -->
                <img src="assets/images/mot-lg-02.png" alt="" className="light-logo shadow-light rounded-circle">
            </a>
            <div className="close-sidebar" data-toggle="left-sidebar-close">
                <i className="ion-close-round"></i>
            </div>
        </div>
        <div className="menu-block customscroll">
            <div className="sidebar-menu">
                <ul id="accordion-menu">
                    <li>
                        <a href="dashboard.html"  className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-tachometer"></span><span className="mtext">Dashboard</span>
                        </a>
                    </li>                 
                    <li>
                        <a href="manage_user.html" className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-users"></span><span className="mtext">Manage Users</span>
                        </a>
                    </li> 
                    <li>
                        <a href="manage_city.html" className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-building"></span><span className="mtext">Manage City</span>
                        </a>
                    </li>
                    <li>
                        <a href="deleted_account.html" className="dropdown-toggle no-arrow">
                           <i className="micon dw dw-delete-3"></i><span className="mtext">Deleted Account</span>
                        </a>
                    </li>
                    <li>
                        <a href="manage_content.html" className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-pencil-square-o"></span>
                            <span className="mtext">Manage Content</span>
                        </a>
                    </li>
                    <!--  <li>
                        <a href="manage_contact.html" className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-phone"></span><span className="mtext">Contact Us</span>
                        </a>
                    </li> -->
                    <!-- <li>
                        <a href="broadcast.html" className="dropdown-toggle no-arrow">
                            <span className="micon fa fa-bell"></span><span className="mtext">Broadcast</span>
                        </a>
                    </li> -->
                    <li>
                        <a href="javascript:;" className="dropdown-toggle">
                            <span className="micon fa fa-table"></span>
                            <span className="mtext">Tabular Report</span>
                        </a>
                        <ul className="submenu">
                            <li>
                                <a href="user_report.html">Users Report</a>
                            </li>
                            <li>
                                <a href="city_report.html">City Report</a>
                            </li> 
                            <li>
                                <a href="chat_report.html">Reported Chat</a>
                            </li>                                
                        </ul>
                    </li>
                    <!-- <li>
                        <a href="javascript:;" className="dropdown-toggle">
                            <span className="micon dw dw-analytics-21"></span>
                            <span className="mtext">Analytical Report</span>
                        </a>
                        <ul className="submenu">
                            <li className="<?php if($current_page=='user_analytical.html' ){echo 'active'; }  ?>">
                                <a href="user_analytical.html">User Analytical Report</a>
                            </li>  
                            <li className="<?php if($current_page=='city_analytical.html' ){echo 'active'; }  ?>">
                                <a href="city_analytical.html">City Analytical Report</a>
                            </li> 
                            <li className="<?php if($current_page=='tours_analytical.html' ){echo 'active'; }  ?>">
                                <a href="tours_analytical.html">Tours Analytical Report</a>
                            </li> 
                             <li className="<?php if($current_page=='restaurant_analytical.html' ){echo 'active'; }  ?>">
                                <a href="restaurant_analytical.html">Restaurants Analytical Report</a>
                            </li>  
                                                                  
                        </ul>
                    </li> -->
                    
              </ul>
            </div>
        </div>
    </div>
    <!--end sidebar-->
    <!-- <div className="mobile-menu-overlay"></div> -->
    <div className="main-container">
        <div className="pd-ltr-20">         
            <div className="row">
                <div className="col-xl-4 mb-30">
                    <a href="manage_user.html">
                        <div className="card-box height-100-p widget-style1">
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="widget-data">
                                    <div className="h4 mb-0" id="users_count">0</div>
                                    <div className="weight-600 font-14">Total Users</div>
                                </div>
                                <span className="card-count-icon fa fa-users"></span>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-xl-4 mb-30">
                    <a href="manage_city.html">
                        <div className="card-box height-100-p widget-style1">
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="widget-data">
                                    <div className="h4 mb-0" id="city_count">0</div>
                                    <div className="weight-600 font-14">Total City</div>
                                </div>
                                <span className="card-count-icon fa fa-building"></span>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- <div className="col-xl-4 mb-30">
                    <a href="manage_contact.html">
                        <div className="card-box height-100-p widget-style1">
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="widget-data">
                                    <div className="h4 mb-0" id="contact_count">0</div>
                                    <div className="weight-600 font-14">Total Contact Us</div>
                                </div>
                                <span className="card-count-icon fa fa-phone"></span>
                            </div>
                        </div>
                    </a>
                </div> -->

              
            </div>
           
            
        </div> 
        <div className="footer-wrap pd-20 mb-20 card-box" id="footer">
            Copyright © <a href="https://youngdecade.com" target="_blank">Young Decade IT Software Solution</a>
        </div>
    </div>*/
    
  );
}