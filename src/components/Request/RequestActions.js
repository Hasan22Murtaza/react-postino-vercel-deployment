import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/context";
import { useErrorService } from "../../config/MessageServiceProvider";
import { api } from "../../api/apiService";
import { useParams } from "react-router-dom";
import ShareRequestModal from "../Modles/ShareRequestModal";
import { downloadJsonFile, getDefaultSingleRequest } from "../../config/utils";
import CommentsModal from "../Modles/CommentsModal";

const RequestActions = () => {
  const { projectId } = useParams();
  const { singleRequest, setSingleRequest } = useContext(AppContext);
  const { flashMessage } = useErrorService();

  const [isSaveRequest, setIsSaveRequest] = useState(false);
  const [isDublicateRequest, setIsDublicateRequest] = useState(false);
  const [isDeleteRequest, setIsDeleteRequest] = useState(false);
  const [isExportRequest, setIsExportRequest] = useState(false);
  const [isOpenShareRequestModal, setIsOpenShareRequestModal] = useState(false);
  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${singleRequest?.id}`);
        setComments(response.data.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        flashMessage({
          type: "error",
          messages: error.response?.data?.msg || "Failed to fetch comments",
        });
      }
    };

    if (singleRequest?.id) {
      fetchComments();
    }
  }, [singleRequest?.id]);
  const addNewTask = () => {
    setSingleRequest(getDefaultSingleRequest());
  };

  const saveRequest = async () => {
    setIsSaveRequest(true);
    try {
      const response = singleRequest?.id
        ? await api.post(
            `/requests/${singleRequest.id}/update/${projectId}/${singleRequest.collection_id}`,
            singleRequest
          )
        : await api.post(
            `/requests/${projectId}/${singleRequest.collection_id}`,
            singleRequest
          );
      setSingleRequest(response.data.data.request);
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsSaveRequest(false);
    }
  };

  const handleDublicateRequest = async () => {
    setIsDublicateRequest(true);
    try {
      const response = await api.post(
        `/requests/${projectId}/${singleRequest.collection_id}`,
        singleRequest
      );
      setSingleRequest(response.data.data.request);
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsDublicateRequest(false);
    }
  };

  const handleDeleteRequest = async () => {
    setIsDeleteRequest(true);
    try {
      const response = await api.delete(`/requests/${singleRequest.id}`);
      const emptyRequest = {
        id: singleRequest?.id,
        requestDelete: true,
        collection_id: singleRequest.collection_id,
        url: "",
        type: "GET",
        response: "",
        response_html: "",
        response_raw: "",
        name: "",
        order_by: "",
        header: [{ selected: true, key: "", value: "" }],
        params: [{ selected: true, type: "Text", key: "", value: "" }],
      };
      setSingleRequest(emptyRequest);
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsDeleteRequest(false);
    }
  };

  const handleExportRequest = async () => {
    setIsExportRequest(true);
    try {
      const response = await api.get(
        `/projects/collection/exportRequest?request_id=${singleRequest?.id}`
      );
      downloadJsonFile(response.data.data.JSONFileUrl, response.data.data.request_name.name);
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsExportRequest(false);
    }
  };

  return (
    <div className="d-flex flex-wrap">
      <button
        type="button"
        onClick={addNewTask}
        className="btn btn-success mr-2 mb-2"
      >
        Add New Request
      </button>
      <button
        type="button"
        onClick={saveRequest}
        className="btn btn-primary mr-2 mb-2"
        disabled={isSaveRequest}
      >
        {isSaveRequest ? "Saving..." : "Save"}
      </button>
      {singleRequest?.id && (
        <>
          <button
            type="button"
            onClick={handleDublicateRequest}
            className="btn btn-primary mr-2 mb-2"
            disabled={isDublicateRequest}
          >
            {isDublicateRequest ? "Dublicate..." : "Dublicate"}
          </button>
          <button
            type="button"
            onClick={handleDeleteRequest}
            className="btn btn-danger mr-2 mb-2"
            disabled={isDeleteRequest}
          >
            {isDeleteRequest ? "Deleting..." : "Delete"}
          </button>
          <button
            type="button"
            onClick={handleExportRequest}
            className="btn btn-info mr-2 mb-2"
            disabled={isExportRequest}
            style={{ color: "#ffff" }}
          >
            <i className="fas fa-cloud-download-alt"></i> Export to Postman
          </button>
          <button
            type="button"
            onClick={() => setIsOpenShareRequestModal(true)}
            className="btn btn-info mr-2 mb-2"
            style={{ color: "#ffff" }}
          >
            Share Request
          </button>
          <p style={{ position: "absolute", right: "0", marginRight: "20px" }}>
          <a href="javascript:void(0)" onClick={() => setIsOpenCommentModal(true)}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 502.664 502.664"
              width="20px"
              height="20px"
              fill="#000000"
              stroke="#000000"
              strokeWidth="0"
            >
              <g id="IconsRepo_bgCarrier"></g>
              <path
                style={{ fill: "#010002" }}
                d="M378.74,181.184c0-76.576-84.708-138.743-189.305-138.743C84.73,42.441,0,104.608,0,181.184 c0,47.154,32.291,88.591,81.343,113.7l-47.024,89.389l101.987-70.515c16.955,3.645,34.6,6.234,53.129,6.234 C294.053,319.992,378.74,257.846,378.74,181.184z M129.942,196.24H89.95v-40.014h39.992V196.24z M251.3,156.226h39.992v40.014 H251.3V156.226z M170.625,156.226h39.971v40.014h-39.971V156.226z"
              ></path>
              <path
                style={{ fill: "#010002" }}
                d="M502.664,268.481c0-50.325-38.763-93.984-95.602-115.943c2.804,10.332,4.314,21.053,4.314,32.097 c0,90.77-100.304,164.412-224.25,164.412c-1.532,0-2.955-0.324-4.465-0.324c32.68,30.868,83.695,50.799,141.138,50.799 c17.515,0,34.147-2.438,50.152-5.846l96.378,66.546l-44.457-84.363C472.206,352.111,502.664,312.981,502.664,268.481z"
              ></path>
            </svg>
            Comment ({comments?.length})
          </a>
        </p>
        </>
      )}
      {isOpenShareRequestModal && (
        <ShareRequestModal
          isOpen={isOpenShareRequestModal}
          isClose={() => setIsOpenShareRequestModal(false)}
          requestId={singleRequest?.id}
        />
      )}
      {isOpenCommentModal && (
        <CommentsModal
          isOpen={isOpenCommentModal}
          isClose={() => setIsOpenCommentModal(false)}
          requestId={singleRequest?.id}
          setComments={setComments}
          comments={comments}
        />
      )}
    </div>
  );
};

export default RequestActions;
