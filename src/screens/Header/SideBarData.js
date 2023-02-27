import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import {HiPencilSquare} from "react-icons/hi2";
import {HiPhone} from "react-icons/hi2";
import {VscTable} from 'react-icons/vsc'
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from "react-icons/bs";
import "../../App.css";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <AiIcons.AiFillDashboard size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Users",
    path: "/manage_users",
    icon: <FaIcons.FaUsers size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage City",
    path: "/manage_city",
    icon: <FaIcons.FaRegBuilding size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Tours",
    path: "/manage_tours",
    icon: <FaIcons.FaTruckMoving size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Restaurants",
    path: "/manage_restaurants",
    icon: <MdIcons.MdOutlineRestaurant size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Deleted Users",
    path: "/deleted_users",
    icon: <FaIcons.FaTrashAlt size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Token",
    path: "/manage_token",
    icon: <RiIcons.RiKey2Line size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Home Content",
    path: "/manage_home",
    icon: <MdIcons.MdHome size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Earnings",
    path: "/manage_earnings",
    icon: <BsIcons.BsCashCoin size={'25px'}/>,
    cName: "nav-text",
  },
  {
    title: "Manage Content",
    path: "/manage_content",
    icon: <HiPencilSquare size={'25px'} />,
    cName: "nav-text",
  },
  {
    title: "Contact Us",
    path: "/manage_contact",
    icon: <HiPhone size={'25px'} />,
    cName: "nav-text",
  },
  {
    title: "Tabular Report",
    iconOpened: <RiIcons.RiArrowDownSFill size={'15px'}/>,
    iconClosed: <RiIcons.RiArrowUpSFill size={'15px'}/>,
    icon: <VscTable size={'25px'}/>,
    subNav: [
      {
        title: "Users Report",
        path: "/users_report",
        cName: "nav-text",
      },
      {
        title: "City Report",
        path: "/city_report",
        cName: "nav-text",
      },
      {
        title: "Tours Report",
        path: "/tours_report",
        cName: "nav-text",
      },
      {
        title: "Restaurants Report",
        path: "/restaurants_report",
        cName: "nav-text",
      },
      {
        title: "Deleted Users Report",
        path: "/deleted_users_report",
        cName: "nav-text",
      },
      {
        title: "Earnings Report",
        path: "/earnings_report",
        cName: "nav-text",
      }
    ],
    cName: "nav-text",
  },
];