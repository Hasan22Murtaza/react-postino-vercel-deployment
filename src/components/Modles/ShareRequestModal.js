import CloseIcon from "@mui/icons-material/Close";
import { Box, Input, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";
import { toast } from "react-toastify";

const ShareRequestModal = ({ isOpen, isClose, requestId }) => {
  const { flashMessage } = useErrorService();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState();

  useEffect(() => {
    getRequestURL();
  }, []);

  const getRequestURL = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/requests/access_code?request_id=${requestId}`);
      let host = window.location.host;
      const shareRequestUrl = `${host}/share/${response.data.data.accessCode.request_id}/${response.data.data.accessCode.code}`;
      setShareUrl(shareRequestUrl);
    } catch (error) {
      flashMessage({ type: "error", messages: error.data.msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.info(`Request Link is copied`, { position: "bottom-right" });
  };

  return (
    <Modal
      open={isOpen}
      onClose={isClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-content inputcontrasts galaxy-width">
        <Box display="flex" justifyContent="space-between" id="modal-title" mb={2}>
          <Typography className="h3-text modalTitle">
            Copy Share Request Url
          </Typography>
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
            <Input
              type="text"
              name="name"
              id="name"
              value={shareUrl}
              readOnly
              className="form-control input-group m-b-0"
              margin="normal"
            />
            <button
              type="button"
              className="btn btn-success mr-2 mb-2 copy_link"
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareRequestModal;
