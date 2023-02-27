import React, { useState, useEffect} from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import "../../App.css";
import { IconContext } from "react-icons";
import SubMenu from "./SubMenu";
import logo from '../../assets/images/VFTlogo.png'; // with import

function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);


  useEffect(() => {

    props.navOpen(sidebar);
  
  }, [sidebar])

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav style={{overflowY: 'scroll'}} className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <Link to="/">
                <img style={{heigth: '80px', width: '80px', marginLeft: '0.5vw', borderRadius: '50%'}} src={logo} alt="" className="light-logo shadow-light rounded-circle"/>
            </Link>
            <Link to="#" className="cross-bar">
                <AiIcons.AiOutlineClose onClick={showSidebar} />
            </Link>
            {SidebarData.map((item, index) => {
              return (
                <li onClick={() => !item.subNav && showSidebar} key={index} className={item.cName}>
                    <SubMenu item={item} index={index}/>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;