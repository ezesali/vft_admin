import React from "react";
import "../App.css";

export default function TabPanel(props) {
    const { children, value, index } = props;
  
    return (
      <div>
        {value === index && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
}