import React, {useEffect, useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../../Header";
import { Button } from "@mui/material";

import Table from '../../../components/Table';

import LoadingSpinner from '../../../components/Loading'
import * as GrIcons from 'react-icons/gr';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';


import {
    TextField
  } from "@material-ui/core";
  import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
  import { db } from "../../../Auth/firebase";
import moment from "moment";
import '../../../App.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import * as RIIcons from 'react-icons/ri';

import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style'

import noCity from '../../../assets/images/noCity.jpg'



export function TourReport() {

  const [openAlert, setOpenAlert] = useState(false)


  const [navisOpen, setNavisOpen] = useState(false)


  const [tours, setTours] = useState([])

  const [errorFromField, setErrorFromField] = useState(false)

  const [errorToField, setErrorToField] = useState(false)


  const [fromDateTour, setFromDateTour] = useState(null)

  const [toDateTour, setToDateTour] = useState(null)

  const [message, setMessage] = useState('')


  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const docRef = query(collection(db, "tour_master"), orderBy("createtime","asc"), where("delete_flag", "==", 0));


  useEffect(() => {
  
  }, [tours])

    const getTourData = async() => {

        setOpenAlert(false)

        setTours([])

        setLoadingUpdate(true)

        if(fromDateTour > toDateTour){

            setOpenAlert(true)

            setMessage("From Date can't be greater than To Date. Please enter differents dates");

            setLoadingUpdate(false)

            return

        }

        else{

            const querySnapshot = await getDocs(docRef);

            let srno = 0
    
            querySnapshot.forEach((doc) => {

                srno++
    
                const createTimeDate = new Date(doc.data().createtime.toDate());
                
                if(createTimeDate >= fromDateTour && createTimeDate <= toDateTour){


                    const tourData = {
                        id: srno,
                        tour_id: doc.data().tour_id,
                        image: doc.data().url,
                        tourName: doc.data().name,
                        token: doc.data().token,
                        description: doc.data().description,
                    }
        
                    setTours((prevTours) => [...prevTours, tourData])
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());

                    
                    setLoadingUpdate(false)

        
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());

                }
                else{
                    setLoadingUpdate(false)
                }
    
            });

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
                src={params.image ? params.image : noCity}
                alt={''}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src= noCity;
                }}
                style={{height: '90px', width: '90px', borderRadius: '100%'}}
                />

            </>
        )
    },
    { 
        field: 'tourName', 
        title: 'Tour Name', 
    },
    { 
        field: 'token', 
        title: 'Token', 
    },
    { 
        field: 'description', 
        title: 'Description', 
    },
];

const exportToExcel = async(excelData, fileName) => {

    let tourExport = excelData

    tourExport = tourExport.map((val) => {
        return {
            'Sr.No': val.id,
            'Tour Name': val.tourName,
            'Token': val.token,
            'Description': val.description,
        }
    })
        
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(tourExport );

    var wscols = [
        {wch:10},
        {wch:20},   
        {wch:10},
        {wch:100}
    ];

    ws['!cols'] = wscols

    //XLSX.utils.sheet_add_aoa(ws, [['MOT - City Report From ... To ... ']]);

    const wb = { Sheets: { 'Tours Report': ws }, SheetNames: ['Tours Report'] };


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

    for (let row = 2; row <= excelData.length+1; row++) {

        ws["D"+row].s = {	
            alignment : {
                wrapText: true,
                vertical: "center"
            }
        };
        
    }




    /**/

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', })

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);


}

const actions = [
    { 
        icon: () => <RIIcons.RiFileExcel2Line color="#000"/>,
        tooltip: 'Export to Excel',
        isFreeAction: true,
        onClick: (event) => exportToExcel(tours, 'VFT_Tours_Report')
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
                                <li className="breadcrumb-item active" aria-current="page"> Tours Report</li>
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

                <h3 className="reportName">Tours Report</h3>

                <div className="dateStyle">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                    disableFuture
                    onError={() => setErrorFromField(true)}
                    onAccept={() => setErrorFromField(false)}
                    value={fromDateTour}
                    label="From Date"
                    onChange={(newValue) => {
                        setFromDateTour(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                    <DatePicker
                    disableFuture
                    onError={() => setErrorToField(true)}
                    onAccept={() => setErrorToField(false)}
                    value={toDateTour}
                    label="To Date"
                    onChange={(newValue) => {
                        setToDateTour(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                </LocalizationProvider>

                    {/*<TextField  type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setFromDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginRight: '10px'}} label="From Date" placeholder="mm/dd/yyyy" id="filled-0" variant="outlined" />
                    
                    <TextField type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setToDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginLeft: '10px'}} label="To Date" placeholder="mm/dd/yyyy" id="filled-1" variant="outlined" />
                    */ }
                    <Button
                    style={(!fromDateTour || !toDateTour) || (errorFromField || errorToField) ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'} : {backgroundColor: '#F7BE07', color: 'black', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'}} 
                    disabled={(!fromDateTour || !toDateTour) || (errorFromField || errorToField) } 
                    onClick={() => getTourData()}>
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Search'}
                    </Button>  
                
                </div>

            </div>
            {tours.length > 0 ?
                <div className="tableView">
                    <Table columns={columns} rows={tours} actions={actions} title={'Tours Report List'}/>
                </div>
            :
             
                <div className="tableView">
                    <p className="reportMessage">There are not tours created between those Dates</p>
                </div>
            }
            
        </div>
    </>
    
  );
}