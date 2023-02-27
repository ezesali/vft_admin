import React, { useState, useContext, useEffect } from "react";
import * as AiIcons from "react-icons/ai";
import "../../App.css";
import { IconContext } from "react-icons";
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi';
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import placeholder from '../../assets/images/placeholder.png'; // with import

function UserDropDown() {

    const {currentUser, logout} = useContext(AuthContext);

    const [openDropDown, setOpenDropDown] = useState(false)

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.error(error.message);
        }
      };

    useEffect(() => {


    
    }, [currentUser])

  return (
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="header-right"> 

            <div className="mm-dropdown">
                <div className="user-profile">
                    <span onClick={() => setOpenDropDown(!openDropDown)} className="user-icon">
                        <img alt="" onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src= placeholder;
                            }} style={{height: '45px', width: '45px', borderRadius: '50px'}} src={currentUser.photoURL !== null ? currentUser.photoURL : placeholder}/>
                    </span>
                    <div onClick={() => setOpenDropDown(!openDropDown)} className='arrow-drop-profile'>
                    {   
                        !openDropDown ? 
                            <RiIcons.RiArrowDownSFill size={'20px'}/>
                        :
                            <RiIcons.RiArrowUpSFill size={'20px'}/>
                    }
                    </div>
                </div>
            </div>
        </div>
        { openDropDown &&
            <ul className="dropdown-profile">
                <li onClick={() => navigate('/profile')} className="input-option p">
                    <AiIcons.AiOutlineUser className="icon-option" size={'25px'}/>
                    <span className="label-input p">Profile</span>
                </li>
                <li onClick={handleLogout} className="input-option l">
                    <HiIcons.HiOutlineLogout className="icon-option" size={'25px'}/>
                    <span className="label-input l">Logout</span>    
                </li>
            </ul>
        }
        
       
      </IconContext.Provider>
  );
}

export default UserDropDown;