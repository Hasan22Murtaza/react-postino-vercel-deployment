import CloseIcon from "@mui/icons-material/Close";
import { Box, Input, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useErrorService } from "../../config/MessageServiceProvider";
import { api } from "../../api/apiService";

const ImportProjectModal = ({ isOpen, isClose }) => {
  const { projectId } = useParams();
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleImportFile = async () => {
    if (!file) {
      flashMessage({
        type: "error",
        messages: "Please select a file to upload",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", projectId);
      const response = await api.post(`/requests/import`, formData);
      flashMessage({ type: "success", messages: response.data.msg });
      isClose();
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/json") {
        setError("Invalid file type. Please upload a JSON file.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={isClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-content inputcontrasts galaxy-width">
        <Box display="flex" justifyContent="space-between" id="modal-title">
          <Typography className="h3-text modalTitle">Import</Typography>
          <Typography align="right" className="cursor-hover gray7">
            <CloseIcon
              tabIndex={0}
              onKeyPress={isClose}
              onClick={isClose}
              aria-label="Close icon"
            />
          </Typography>
        </Box>

        <Box id="modal-description">
          <Box mb={2}>
            <input
              type="file"
              name="file"
              id="file"
              className={`form-control input-group m-b-0 inputcontrasts`}
              margin="normal"
              onChange={handleChangeFile}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        <Box id="modal-footer" display="flex" justifyContent="end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImportFile}
            disabled={isLoading || !file}
          >
            Save
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportProjectModal;
