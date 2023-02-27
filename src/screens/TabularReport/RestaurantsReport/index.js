import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../../Header";
import Button from '@mui/material/Button';
import * as HiIcons from 'react-icons/hi';
import Table from '../../../components/Table';

import * as GrIcons from 'react-icons/gr';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import LoadingSpinner from '../../../components/Loading'
import {
    Modal,
    Backdrop,
    Fade,
    TextField
  } from "@material-ui/core";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../Auth/firebase";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import '../../../App.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import * as RIIcons from 'react-icons/ri';

import { LocalizationProvider } from "@mui/x-date-pickers";

import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style'

import Placeholder from '../../../assets/images/placeholder.png'




export function RestaurantsReport() {


  
  const [openAlert, setOpenAlert] = useState(false)

  const [imageSelected, setImageSelected] = useState(null)

  const [navisOpen, setNavisOpen] = useState(false)

  const [restaurants, setRestaurants] = useState([])

  const [errorFromField, setErrorFromField] = useState(false)

  const [errorToField, setErrorToField] = useState(false)

  const [open, setOpen] = useState(false)

  const [fromDateRest, setFromDateRest] = useState(null)

  const [toDateRest, setToDateRest] = useState(null)

  const [message, setMessage] = useState('')

  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const docRef = query(collection(db, "restaurant_master"), orderBy("createtime","desc"), where("delete_flag", "==", 0));

  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();

  useEffect(() => {


}, [])


const getRestaurantData = async() => {

    setOpenAlert(false)

    setLoadingUpdate(true)

    if(fromDateRest > toDateRest){

        setOpenAlert(true)

        setMessage("From Date can't be greater than To Date. Please enter differents dates");

        setLoadingUpdate(false)

        return

    }

    else{

        const querySnapshot = await getDocs(docRef);

        let srno = 0

        querySnapshot.forEach((doc) => {

            const createTimeDate = new Date(doc.data().createtime.toDate());

            if(createTimeDate >= fromDateRest && createTimeDate <= toDateRest){

                srno++

                let RestData = {};


                RestData.id = srno
                RestData.restaurant_id = srno
                RestData.image = doc.data().url
                RestData.name = doc.data().name
                RestData.mobile = doc.data().mobile ? '+'+doc.data().mobile : 'NA'


                 //console.log('TOUR_ID: ',docT.data())
                 const docRestRef = query(collection(db, "tour_master"), where("tour_id", '==', parseInt(doc.data().tour_id)));

                 //console.log(docTourRef)
 
                 
                 getDocs(docRestRef).then((resRest) => {
 
                     
 
                    if(resRest.docs.length > 0){
 
                     
                        RestData.tourName = resRest.docs[0].data().name
 
                    }
                    else{
 
                        RestData.tourName = 'NA'
 
                    }
 
                 });

                 setTimeout(() => {

                    setRestaurants((prevRest) => [...prevRest, RestData])
                    
                 }, 2000);


                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());

            }

        });

        setLoadingUpdate(false)

    }
};

    const columns = [
        { 
            field: 'id', 
            title: 'Sr.No.', 
        },
        { 
            field: 'image', 
            title: 'Image', 
            render: (params) => (
                <>
                    <img
                    src={params.image ? params.image : Placeholder}
                    alt={''}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src= Placeholder;
                    }}
                    onClick={(e) => {setImageSelected(params.image); params.image && setOpen(true)}}
                    style={{height: '50px', width: '50px', borderRadius: '100%', cursor: params.image && 'pointer'}}
                    />
                    
                </>
            )
        },
        { 
            field: 'name', 
            title: 'Name', 
        },
        { 
            field: 'tourName', 
            title: 'Tour Name', 
        },
        {
            field: 'mobile',
            title: 'Mobile',
        },
    ];

    const exportToExcel = async(excelData, fileName) => {

        let userExport = excelData
    
        userExport = userExport.map((val) => {
            return {
                'Sr.No': val.id,
                'Name': val.name,
                'Tour Name': val.tourName,
                'Mobile': val.mobile,
            }
        })
            
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
    
        const ws = XLSX.utils.json_to_sheet(userExport, );

        var wscols = [
            {wch:10},
            {wch:40},
            {wch:50},
            {wch:30},
        ];
    
        ws['!cols'] = wscols
    
        //XLSX.utils.sheet_add_aoa(ws, [['MOT - City Report From ... To ... ']]);
    
        const wb = { Sheets: { 'Restaurants Report': ws }, SheetNames: ['Restaurants Report'] };
    
        ws["A1"].s = {
            fill: {
                patternType: 'solid',
                bgColor: { rgb: "000" },
            },							
            font: {
                color: { rgb: "FFFFFF" },
                sz: 16,
                bold: true,
            },
        };
    
        ws["B1"].s = {
            fill: {
                patternType: 'solid',
                bgColor: { rgb: "000" },
            },							
            font: {
                color: { rgb: "FFFFFF" },
                sz: 16,
                bold: true,
            },
        };
    
        ws["C1"].s = {	
            fill: {
                patternType: 'solid',
                bgColor: { rgb: "000" },
            },							
            font: {
                color: { rgb: "FFFFFF" },
                sz: 16,
                bold: true,
            },
        };
    
        ws["D1"].s = {	
            fill: {
                patternType: 'solid',
                bgColor: { rgb: "000" },
            },							
            font: {
                color: { rgb: "FFFFFF" },
                sz: 16,
                bold: true,
            },
        };
    
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', })
    
        const data = new Blob([excelBuffer], { type: fileType });
    
        FileSaver.saveAs(data, fileName + fileExtension);
    
    
    }
    
    
    const actions = [
        {
            icon: () => <HiIcons.HiOutlineEye color="#000"/>,
            tooltip: 'View Restaurant',
            onClick: (event, row) => navigate('/view_restaurant/'+row.restaurant_id)
        },
        { 
            icon: () => <RIIcons.RiFileExcel2Line color="#000"/>,
            tooltip: 'Export to Excel',
            isFreeAction: true,
            onClick: (event) => exportToExcel(restaurants, 'VFT_Restaurant_Report')
        }
    ]

  

  return (
    
    <>
        <Header navOpenHeader={(data) => setNavisOpen(data)} />
        <div style={{marginLeft: navisOpen ? '180px' : null}} className="dashboardContainerProfile">
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
                                <li className="breadcrumb-item active" aria-current="page">Restaurants Report</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <Collapse style={{justifySelf: 'center'}} in={openAlert}>
                <Alert
                severity="error"
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpenAlert(false);
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
            <div className="contentDate"> 
            
                <h3 className="reportName">Restaurants Report</h3>

                <div className="dateStyle">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                    disableFuture
                    onError={() => setErrorFromField(true)}
                    onAccept={() => setErrorFromField(false)}
                    value={fromDateRest}
                    label="From Date"
                    onChange={(newValue) => {
                        setFromDateRest(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                    <DatePicker
                    disableFuture
                    onError={() => setErrorToField(true)}
                    onAccept={() => setErrorToField(false)}
                    value={toDateRest}
                    label="To Date"
                    onChange={(newValue) => {
                        setToDateRest(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                </LocalizationProvider>

                    {/*<TextField  type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setFromDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginRight: '10px'}} label="From Date" placeholder="mm/dd/yyyy" id="filled-0" variant="outlined" />
                    
                    <TextField type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setToDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginLeft: '10px'}} label="To Date" placeholder="mm/dd/yyyy" id="filled-1" variant="outlined" />
                    */ }
                    <Button
                    style={(!fromDateRest || !toDateRest) || (errorFromField || errorToField) ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'} : {backgroundColor: '#F7BE07', color: 'black', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'}} 
                    disabled={(!fromDateRest || !toDateRest) || (errorFromField || errorToField) } 
                    onClick={() => getRestaurantData()}>
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Search'}
                    </Button>  
                
                </div>

            </div>
            {restaurants.length > 0 ?
                <div className="tableView">
                    <Table columns={columns} rows={restaurants} actions={actions} title={'Restaurants Report List'}/>
                </div>
            :
             
                <div className="tableView">
                    <p className="reportMessage">There are not restaurants created between those Dates</p>
                </div>
            }
            
        </div>
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
                        src={imageSelected}
                        alt=""
                        style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                    />
                </Fade>
            </div>
        </Modal>
    </>
    
  );
}