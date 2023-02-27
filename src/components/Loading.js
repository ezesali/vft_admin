import React from "react";
import "../App.css";

export default function LoadingSpinner({styleLoad, styleContainer}) {
  return (
    <div style={styleContainer && styleContainer} className="spinner-container">
      <div style={styleLoad && styleLoad} className="loading-spinner">
      </div>
    </div>
  );
}