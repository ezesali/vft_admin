import React, { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
//import { Alert } from "./Alert";
import '../../App.css';
//import { auth } from "./firebase";

import {FaEnvelope} from 'react-icons/fa';
import {FaEyeSlash} from 'react-icons/fa';
import {FaLock} from 'react-icons/fa';
import {FaEye} from 'react-icons/fa';
import logo from '../../assets/images/VFTlogo.png'


export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const {currentUser, login, resetPassword} = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false)


  const navigate = useNavigate();

  useEffect(() => {

    if(currentUser){
      navigate('/',)
    }
  
  }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password, remember);
      navigate("/");
    } catch (error) {
      setError(error.message.split('Firebase:')[1]);
    }
  };

  const handleChange = (nameInput, value) => {

    setUser({ ...user, [nameInput]: value });

  }

  /*const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message.split('Firebase:')[1]);
    }
  };*/


  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email) return setError("Write an email to reset password");
    try {
      await resetPassword(user.email);
      setError('We sent you an email. Check your inbox')
    } catch (error) {
      setError(error.message.split('Firebase:')[1]);
    }
  };

  const _showPassword = () => {

    setShowPassword(!showPassword);

  }

  const _setRemember = () => {

    setRemember(!remember)

  }

  return (
    /*
      <button
        onClick={handleGoogleSignin}
        className="bg-slate-50 hover:bg-slate-200 text-black  shadow rounded border-2 border-gray-300 py-2 px-4 w-full"
      >
        Google login
      </button>
    </div>*/
    <div className="login-wrap">
        <div className="container">
            <div className="subContainer">
                <div className="login-brand">
                  <img src={logo} style={{height: '100px', width: '100px', borderRadius: '50%'}} alt="logo" width="100" className="shadow-light"/>
                </div>
                <div id="msgSuccessErrorHtml"></div>
                <div>
                    <div className="login-box">
                        <div className="login-title">
                            <h2 className="text-primary">Login</h2>
                        </div>
                        <form id="loginForm">
                            <small><span id="error" style={error === 'We sent you an email. Check your inbox' ? {color: 'green'} : {color: 'red'}}>{error}</span></small>
                            <div className="input-group custom">
                                <input onChange={(e) => handleChange('email', e.target.value)} type="text" className="form-control" placeholder="Email" id="email" name="email"/>
                                <div className="input-group-append custom">
                                    <span className="input-group-text">
                                      <FaEnvelope size={'20'}/>
                                    </span>
                                </div>
                            </div>
                            <div className="input-group custom">
                                <input onChange={(e) => handleChange('password', e.target.value)} type={showPassword ? 'text' : "password"} className="form-control" placeholder="Password" maxLength="15" id="password" name="password"/>
                                <div  className="input-group-append custom">
                                    <span onClick={() => _showPassword()} className="input-group-text">
                                        {showPassword ?<FaEye size={'20'}/> : <FaEyeSlash size={'20'}/> }
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="custom-control">
                                        <input type="checkbox" checked={remember} onClick={() => _setRemember()} className="custom-control-input" id="motAdmin"/>
                                        <label className="custom-control-label" htmlFor="motAdmin">Remember Me</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div onClick={(e) => handleResetPassword(e)} className="forgot-password"><a className="forgotPass" href="forgot_password.html">Forgot Password   &nbsp;<FaLock size={'15'}/></a></div>
                                </div>
                            </div>
                            <div className="login-button">
                                <div className="input-group-button">
                                    <button onClick={(e) => handleSubmit(e)} className="btn" type="submit">Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


  );
}