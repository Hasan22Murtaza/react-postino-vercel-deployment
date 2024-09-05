import React, { useContext } from "react";
import { Link } from "react-router-dom";
import RequestForm from "../../../components/Request/RequestForm";
import RequestResponse from "../../../components/Request/RequestResponse";
import { AppContext } from "../../../contexts/context";
const Request = () => {
  const { singleRequest, setSingleRequest } = useContext(AppContext);

  return (
    <div className="main-wrapper">
      <nav className="sidebar" style={{ height: "0%" }}>
        <div className="sidebar-header">
          <a href="javascript:void(0)" className="sidebar-brand">
            Post<span>ino</span>
          </a>
        </div>
      </nav>

      <div
        className="page-wrapper"
        style={{ marginLeft: "0px", width: "100%" }}
      >
        <nav className="navbar">
          <Link to="/auth/login" style={{ marginLeft: "1031px" }}>
            Login
          </Link>
        </nav>

        <div className="page-content">
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <RequestForm />
                </div>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <RequestResponse request={singleRequest} />
        </div>

        <footer className="footer">
          <div className="container-fluid d-flex justify-content-between">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
              Postino Request Handler
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Request;
