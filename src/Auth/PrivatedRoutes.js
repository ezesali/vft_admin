import React, {useContext} from "react";
import { getAuth} from "firebase/auth";
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from "../context/authContext";

export const PrivatedRoutes = () => {
  
  const {currentUser} = useContext(AuthContext);


  return (
    currentUser ? <Outlet/> : <Navigate to='/login'/>
  )
}