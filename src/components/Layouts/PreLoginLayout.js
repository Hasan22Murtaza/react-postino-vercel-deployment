import React from "react";
import { Outlet } from "react-router-dom/dist";

export default function PreLoginLayout() {
 
  return (
    <div className="main-wrapper">
      <div className="page-wrapper full-page">
        <div className="page-content d-flex align-items-center justify-content-center">
          <div className="row w-100 mx-0 auth-page">
          <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}
