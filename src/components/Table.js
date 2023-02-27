import React from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';
import tableIcons from "../components/TableIcons";
import "../App.css";




export default function DataTable({rows, columns, actions, title,toolbar=false, exportTool=false}) {


  const defaultMaterialTheme = createTheme();


  return (
    <div style={{ height: 300, width: '100%', backgroundColor: 'white'}}>
      
     {/*<DataGrid
        disableSelectionOnClick
        components={toolbar ? { Toolbar: NewToolbar }: { Toolbar: NewToolbarExport }}
        autoPageSize
        style={{backgroundColor: '#fff'}}
        rowSpacingType={'border'}
        rows={rows}
        density={'comfortable'}
        columns={columns}
        rowsPerPageOptions={[25]}
      />*/
     }

     <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable
        title={title}
        columns={columns}
        data={rows}
        icons={tableIcons}
        actions={actions}
        style={{paddingRight: 10}}
        options={{
          actionsColumnIndex: -1,
          actionsCellStyle:{padding: '25px',},
          columnResizable: true,
        }}
      />
    </ThemeProvider>
      
    </div>
  );
}
