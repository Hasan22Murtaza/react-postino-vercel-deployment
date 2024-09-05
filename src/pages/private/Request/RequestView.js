import React, { useContext, useState } from "react";
import ProjectVariableImportExport from "../../../components/Request/ProjectVariableImportExport";
import RequestActions from "../../../components/Request/RequestActions";
import RequestForm from "../../../components/Request/RequestForm";
import RequestResponse from "../../../components/Request/RequestResponse";
import SubRequestForm from "../../../components/Request/SubRequestForm";
import { AppContext } from "../../../contexts/context";

const RequestView = () => {
  const { singleRequest, setSingleRequest } = useContext(AppContext);
  return (
      <div className="page-content">
        <ProjectVariableImportExport/>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <RequestActions />
                <SubRequestForm/>
                <RequestForm/>
              </div>
            </div>
          </div>
        </div>

        {/* Response Section */}
        <RequestResponse request={singleRequest} />
      </div>
  );
};

export default RequestView;
