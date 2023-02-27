import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css'


const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => {
    
    setSubnav(!subnav)
};

  return (
    <>
        <Link className='menu-hiper' to={item.path} onClick={item.subNav && showSubnav}>
            <div className="icon-item">{item.icon}</div>
            <span>{item.title}</span>
            <div className='arrow-drop'>
                {item.subNav && subnav
                    ? item.iconOpened
                    : item.subNav
                    ? item.iconClosed
                    : null}
            </div>
        </Link>
        <ul className='submenu' key={item.title}>
            {subnav &&
            item.subNav.map((item, index) => {
            return (
                
                <li className='submenu-item'>
                    <Link className='menu-hiper' to={item.path} key={index}>
                        <div className="icon-item">
                            {item.icon}
                        </div>
                        <span style={{marginTop: '10px'}}>-  {item.title}</span>
                    </Link>
                </li>
            );
            })
            }
        </ul>
    </>
  );
};

export default SubMenu;