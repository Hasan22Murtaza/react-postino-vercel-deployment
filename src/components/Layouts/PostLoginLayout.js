import React from "react";
import { Outlet } from "react-router-dom/dist";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

export default function PostLoginLayout() {
  return (
    <>
      <div class="main-wrapper">
        <Sidebar />
        <div class="page-wrapper">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
}
