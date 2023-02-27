import React from "react";
import "../../App.css";
import Navbar from "./SideNav";
import UserDropDown from "./UserDropDown";

export default function Header(props) {

    const navOpen = (isOpen) => {

        props.navOpenHeader(isOpen);

    }
    return (
    <div className="header-dashboard">

        <Navbar navOpen={navOpen}/>
        <UserDropDown/>
        {/*<div className="header-right">          
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
        </div>*/
        }

    </div>
    );
}