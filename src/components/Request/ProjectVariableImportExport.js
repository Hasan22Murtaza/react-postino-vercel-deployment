import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VariablesModal from "../Modles/VariablesModal";
import { useErrorService } from "../../config/MessageServiceProvider";
import { api } from "../../api/apiService";
import ImportProjectModal from "../Modles/ImportProjectModal";
import { downloadJsonFile } from "../../config/utils";

const ProjectVariableImportExport = () => {
  const { projectId, request_id } = useParams();
  const [isOpenVariableModal, setIsOpenVariableModal] = useState(false);
  const navigate = useNavigate();
  const { flashMessage } = useErrorService();
  const [isExportRequest, setIsExportRequest] = useState(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);

  const exportProject = async () => {
    setIsExportRequest(true);
    try {
      const response = await api.get(`/projects/collection/export?project_id=${projectId}&by=project`);
      downloadJsonFile(response.data.data.JSONFileUrl, response.data.data.collection_name);
      // window.open(response.data.data.JSONFileUrl, "_blank");
      flashMessage({ type: 'success', messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: 'error',
        messages: error.response?.data?.msg || 'An error occurred',
      });
    } finally {
      setIsExportRequest(false);
    }
  };

  const importProject = () => {
    setIsOpenImportModal(true);
    // Implement import logic here
    console.log("Importing project");
  };

  const backToListingPage = () => {
    navigate("/listing"); // Adjust the path as necessary
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <nav className="page-breadcrumb">
          <button
            style={{ cursor: "pointer" }}
            className="btn btn-primary"
            onClick={() => setIsOpenVariableModal(true)}
          >
            Variables
          </button>
          &nbsp;
          <button className="btn btn-info" onClick={exportProject} disabled={isExportRequest}>
            Export Project
          </button>
          &nbsp;
          <button
            data-target="#import"
            data-toggle="modal"
            style={{ cursor: "pointer" }}
            className="btn btn-success"
            onClick={importProject}
          >
            Import Project
          </button>
          &nbsp;
          {request_id && (
            <button
              className="btn btn-default"
              onClick={backToListingPage}
              style={{ background: "gainsboro" }}
            >
              Back To Listing
            </button>
          )}
          &nbsp;
        </nav>
      </div>
      {isOpenVariableModal && (
        <VariablesModal
          isOpen={isOpenVariableModal}
          isClose={() => setIsOpenVariableModal(false)}
        />
      )}
        {isOpenImportModal && (
        <ImportProjectModal
          isOpen={isOpenImportModal}
          isClose={() => setIsOpenImportModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectVariableImportExport;
