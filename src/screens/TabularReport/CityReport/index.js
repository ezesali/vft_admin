import React, {useState} from "react";
//import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
//import LoadingSpinner from '../../components/Loading'
import Header from "../../Header";
import { Button } from "@mui/material";
import * as HiIcons from 'react-icons/hi';
import * as RIIcons from 'react-icons/ri';
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
  import { collection, getDocs, query, where, orderBy} from "firebase/firestore";
  import { db } from "../../../Auth/firebase";
import { useNavigate } from "react-router-dom";
import '../../../App.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style';
import noCity from '../../../assets/images/noCity.jpg';





export function CityReport() {

  const [openAlert, setOpenAlert] = useState(false)

  const [imageSelected, setImageSelected] = useState(null)

  const [navisOpen, setNavisOpen] = useState(false)

  const [cities, setCities] = useState([])

  const [errorFromField, setErrorFromField] = useState(false)

  const [errorToField, setErrorToField] = useState(false)

  const [open, setOpen] = useState(false)

  const [fromDateCity, setFromDateCity] = useState(null)

  const [toDateCity, setToDateCity] = useState(null)

  const [message, setMessage] = useState('')

  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const docRef = query(collection(db, "city_master"), orderBy("createtime","desc"), where("delete_flag", "==", 0));

  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();



    const getCitiesData = async() => {

        setOpenAlert(false)

        setLoadingUpdate(true)

        if(fromDateCity > toDateCity){

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

                if(createTimeDate >= fromDateCity && createTimeDate <= toDateCity){

                    srno++
                    const citydata = {
                        id: srno,
                        city_id: doc.data().city_id,
                        image: doc.data().url,
                        state: doc.data().state,
                        city: doc.data().name,
                        description: doc.data().description,
                    }
        
                    setCities((prevCities) => [...prevCities, citydata])
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
        render: (params) => 
        <>
            <img
            src={params.image ? params.image : noCity}
            alt={''}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src= noCity;
            }}
            onClick={(e) => {setImageSelected(params.image); params.image && setOpen(true)}}
            style={{height: '55px', width: '55px', borderRadius: '100%', cursor: params.image && 'pointer'}}
            />

        </>,
    },
    { 
        field: 'state', 
        title: 'State', 
    },
    { 
        field: 'city', 
        title: 'Name', 
    },
    {
        field: 'description',
        title: 'Description',
    },


]

const viewCityFunc = (params) =>{

    navigate('/view_city/'+ params.city_id)
}

const exportToExcel = async(excelData, fileName) => {

    let cityExport = excelData

    cityExport = cityExport.map((val) => {
        return {
            'Sr.No': val.id,
            'State': val.state,
            'Name': val.city,
            'Description': val.description,
        }
    })
        
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(cityExport, );

    var wscols = [
        {wch:10},
        {wch:30},
        {wch:30},
        {wch:60}
    ];

    ws['!cols'] = wscols

    //XLSX.utils.sheet_add_aoa(ws, [['MOT - City Report From ... To ... ']]);

    const wb = { Sheets: { 'City Report': ws }, SheetNames: ['City Report'] };

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

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', })

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);


}

const actions = [
    {
        icon: () => <HiIcons.HiEye color="#000"/>,
        tooltip: 'View',
        onClick: (event, row) => viewCityFunc(row)
    },
    { 
        icon: () => <RIIcons.RiFileExcel2Line color="#000"/>,
        tooltip: 'Export to Excel',
        isFreeAction: true,
        onClick: (event) => exportToExcel(cities, 'VFT_City_Report')
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
                                <li className="breadcrumb-item active" aria-current="page">City Report</li>
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
            
                <h3 className="reportName">City Report</h3>

                <div className="dateStyle">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                    disableFuture
                    onError={() => setErrorFromField(true)}
                    onAccept={() => setErrorFromField(false)}
                    value={fromDateCity}
                    label="From Date"
                    onChange={(newValue) => {
                        setFromDateCity(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                    <DatePicker
                    disableFuture
                    onError={() => setErrorToField(true)}
                    onAccept={() => setErrorToField(false)}
                    value={toDateCity}
                    label="To Date"
                    onChange={(newValue) => {
                        setToDateCity(newValue);
                    }}
                    renderInput={(params) => <TextField style={{width: '50%', marginRight: '10px'}} InputLabelProps={{shrink: true}} {...params} />}
                    />
                </LocalizationProvider>

                    {/*<TextField  type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setFromDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginRight: '10px'}} label="From Date" placeholder="mm/dd/yyyy" id="filled-0" variant="outlined" />
                    
                    <TextField type={'date'} InputLabelProps={{shrink: true}} onChange={(e) => {const dateVal = e.target.value.split('-'); e.preventDefault(); setToDateCity(`${dateVal[1]}/${dateVal[2]}/${dateVal[0]}`)}} style={{width: '50%', marginLeft: '10px'}} label="To Date" placeholder="mm/dd/yyyy" id="filled-1" variant="outlined" />
                    */ }
                    <Button
                    style={(!fromDateCity || !toDateCity) || (errorFromField || errorToField) ? {backgroundColor:  '#d7d3d3cd', cursor: 'not-allowed', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'} : {backgroundColor: '#F7BE07', color: 'black', textTransform: 'none', fontSize: '16px', marginLeft: '40px', width: '120px', height: '40px',borderRadius: '30px'}} 
                    disabled={(!fromDateCity || !toDateCity) || (errorFromField || errorToField) } 
                    onClick={() => getCitiesData()}>
                    {loadingUpdate ? <LoadingSpinner styleContainer={{height: '24px', position: 'relative', background: 'none'}} styleLoad={{width: '10px', height: '10px', borderWidth: '5px', borderColor: '#fff'}}/> : 'Search'}
                    </Button>  
                
                </div>

            </div>
            {cities.length > 0 ?
                <div className="tableView">
                    <Table columns={columns} rows={cities} actions={actions} title='Cities List'/>
                </div>
            :
             
                <div className="tableView">
                    <p className="reportMessage">There are not cities created between those Dates</p>
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