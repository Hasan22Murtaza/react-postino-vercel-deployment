import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import {
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
  sendUpdateRequest,
} from "../../api/MainService";
import { AppContext } from "../../contexts/context";
import axios from "axios";
import { getDefaultSingleRequest } from "../../config/utils";
const RequestForm = (props) => {
  const { singleRequest, setSingleRequest } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const headerMethod = [
    { key: "Select", value: "" },
    { key: "Authorization", value: "" },
    { key: "Content-type", value: "" },
    { key: "jwt", value: "" },
    { key: "client_id", value: "" },
  ];
  const requestMethods = ["GET", "POST", "PUT", "DELETE"];

  const [variables, setVariables] = useState([]);
  const [responseError, setResponseError] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [endpointError, setEndpointError] = useState("");
  const [tab, setTab] = useState("Params");
  const { id, code, projectId } = useParams();

  const [fileToUploads, setFileToUploads] = useState(null);


  useEffect(() => {
    if (code && id) {
      getShareRequest(code);
    } else {
      setSingleRequest(getDefaultSingleRequest);
      getVariables(projectId);
    }
  }, []);

  const getVariables = async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/veriables`);
      setVariables(response.data.data.projectVeriables);
    } catch (error) {
      console.error("Error fetching variables", error);
    }
  };

  const getShareRequest = async () => {
    try {
      const response = await api.get(`/request_access_code/${code}`);
      const request = response.data.data.request;
      const updatedRequest = {
        ...singleRequest,
        url: request.url,
        type: request.type,
        response: request.response,
        raw_data: request.response,
        response_raw: request.response,
        response_html: request.response,
        header: request.header || [{ selected: true, key: "", value: "" }],
        params: request.params || [
          { selected: true, type: "Text", key: "", value: "" },
        ],
      };
      setSingleRequest(updatedRequest);
      setVariables(response.data.data.veriables);
    } catch (error) {
      console.error("Error fetching variables", error);
    }
  };

  const handleRequestChange = (key, value) => {
    setSingleRequest((prevRequest) => ({
      ...prevRequest,
      [key]: value,
    }));
  };
  const addParams = () => {
    setSingleRequest((prevState) => ({
      ...prevState,
      params: [
        ...prevState.params,
        { selected: true, type: "Text", key: "", value: "" },
      ],
    }));
  };

  const addHeader = () => {
    setSingleRequest((prevState) => ({
      ...prevState,
      header: [...prevState.header, { selected: true, key: "", value: "" }],
    }));
  };

  const removeItem = (index, ctx) => {
    setSingleRequest((prevState) => ({
      ...prevState,
      [ctx.toLowerCase()]: prevState[ctx.toLowerCase()].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const constructParams = () => {
    let constructedObject = {};

    // Handle GET request parameters
    if (tab != "Body" || tab == null) {
      let formData = new FormData();

      singleRequest?.params.forEach((item) => {
        if (item.selected) {
          constructedObject[item.key] = item.type === "File" ? fileToUploads : item.value;
        }
      });

      for (let key in constructedObject) {
        formData.append(key, constructedObject[key]);
      }

      return formData;
    }
    // Handle the raw data or POST request parameters
    if (singleRequest?.method === "GET") {
      singleRequest?.params.forEach((item) => {
        if (item.selected) {
          constructedObject[item.key] = item.value;
        }
      });

      return constructedObject;
    } else {
      return singleRequest?.raw_data;
    }
  };

  const constructObjectHeader = () => {
    let constructedObjectHeader = {};
    constructedObjectHeader = singleRequest?.header.reduce((object, item) => {
      if (item.selected) {
        if (item.value) {
          let itemValue = item.value;
          variables.forEach((variable) => {
            const templateString = `{{${variable.name}}}`;
            if (item.value.includes(templateString)) {
              itemValue = item.value.replace(templateString, variable.value);
            }
          });
          object[item.key] = itemValue;
        }
      }
      return object;
    }, {});

    return constructedObjectHeader;
  };

  const requestUrl = () => {
    if (singleRequest?.url) {
      let url = singleRequest?.url;
      variables.forEach((variable) => {
        const templateString = `{{${variable.name}}}`;
        if (url.includes(templateString)) {
          url = url.replace(templateString, variable.value);
        }
      });
      return url;
    }
    return "";
  };

  const sendRequest = () => {
    setEndpointError("");
    setResponseError(null);
    setResponseStatus(null);

    if (!singleRequest?.url) {
      setEndpointError("URL field is required");
      return;
    }

    setIsLoading(true);
    const headers = constructObjectHeader();
    const url = requestUrl();
    const params = tab === "Body" ? singleRequest?.raw_data : constructParams();

    switch (singleRequest?.type) {
      case "GET":
        sendGetRequest(url, params, headers)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
        break;

      case "POST":
        sendPostRequest(url, params, headers)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
        break;

      case "PUT":
        sendUpdateRequest(url, params, headers)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
        break;

      case "DELETE":
        sendDeleteRequest(url, headers)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
        break;

      default:
        break;
    }
  };

  const handleResponse = (response) => {
    setIsLoading(false);
    const formattedResponse = JSON.stringify(response.data, undefined, 4);

    const updatedRequest = {
      ...singleRequest,
      response_raw: formattedResponse,
      response_html: formattedResponse,
      response: formattedResponse,
    };

    setSingleRequest(updatedRequest);
  };

  const handleError = (error) => {
    setIsLoading(false);
  
    const isAxiosError = axios.isAxiosError(error);
  
    // Extract error details
    const status = isAxiosError ? (error.response?.status || 500) : 500;
    const errorMessage = isAxiosError
      ? (error.response?.data?.message || error.message)
      : error.message;
  
    const updatedRequest = {
      ...singleRequest,
      response_raw: JSON.stringify({
        status,
        message: errorMessage,
        ...(error.response?.data || {}),
      }, null, 4),
      response_html: `<pre>${errorMessage}</pre>`,
      response: errorMessage,
    };
  
  
    setSingleRequest(updatedRequest);
    setResponseError(error);
    setResponseStatus(status);
  };
  
  

  const handleTabClick = (option) => {
    if (option === "Body") {
      setTab("Body");
    } else {
      setTab(option);
    }
  };

  const fileChanged = (event) => {
    console.log(event.target.files[0]);
    setFileToUploads(event.target.files[0])
    // Handle file change logic here
  };

  return (
    <>
      <form className="forms-sample">
        <div className="row">
          <div className="col-xs-4 col-sm-2">
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                className="form-control"
                value={singleRequest?.type}
                onChange={(e) => handleRequestChange("type", e.target.value)}
              >
                {requestMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-xs-8 col-sm-6">
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                name="url"
                className="form-control"
                placeholder="Enter URL here..."
                value={singleRequest?.url}
                onChange={(e) => handleRequestChange("url", e.target.value)}
              />
            </div>
          </div>
          <div className="col-xs-8 col-sm-4">
            <div className="form-group">
              <label>&nbsp;</label>
              <p>
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={sendRequest}
                  disabled={isLoading}
                >
                  <span>{!isLoading ? "Send" : "Sending..."}</span>
                </button>
              </p>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="params-tab"
              data-toggle="tab"
              href="#params"
              role="tab"
              aria-controls="params"
              aria-selected="true"
              onClick={() => handleTabClick("Params")}
            >
              Params
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="headers-tab"
              data-toggle="tab"
              href="#headers"
              role="tab"
              aria-controls="headers"
              onClick={() => handleTabClick("Header")}
            >
              Headers
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="body-tab"
              data-toggle="tab"
              href="#body"
              role="tab"
              aria-controls="body"
              onClick={() => handleTabClick("Body")}
            >
              Body
            </a>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          {/* Params Tab */}
          <div
            className="params tab-pane fade show active"
            id="params"
            role="tabpanel"
            aria-labelledby="params-tab"
          >
            <a className="add" href="javascript:void(0);" onClick={addParams}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </a>
            {singleRequest?.params.map((item, index) => (
              <div className="row" key={index}>
                <div className="col-md-6 d-flex mb-2">
                  <input
                    type="checkbox"
                    name={`params[${index}]selected`}
                    className="form-control"
                    style={{ width: "4%", marginRight: "4px" }}
                    checked={item.selected}
                    onChange={(e) => {
                      const updatedParams = [...singleRequest?.params];
                      updatedParams[index].selected = e.target.checked;
                      setSingleRequest({
                        ...singleRequest,
                        params: updatedParams,
                      });
                    }}
                  />
                  <input
                    type="text"
                    name={`params[${index}]key`}
                    className="form-control"
                    placeholder="KEY"
                    value={item?.key}
                    onChange={(e) => {
                      const updatedParams = [...singleRequest?.params];
                      updatedParams[index].key = e.target.value;
                      setSingleRequest({
                        ...singleRequest,
                        params: updatedParams,
                      });
                    }}
                    onKeyDown={(e) => e.key === "Tab" && addParams()}
                  />
                  <select
                    name={`params[${index}]type`}
                    className="form-control"
                    style={{
                      position: "absolute",
                      width: "20%",
                      right: 0,
                      top: 0,
                    }}
                    value={item.type}
                    onChange={(e) => {
                      const updatedParams = [...singleRequest?.params];
                      updatedParams[index].type = e.target.value;
                      setSingleRequest({
                        ...singleRequest,
                        params: updatedParams,
                      });
                    }}
                  >
                    <option value="Text">Text</option>
                    <option value="File">File</option>
                  </select>
                </div>
                <div className="col-md-6 d-flex">
                  {item.type === "Text" ? (
                    <input
                      type="text"
                      name={`params[${index}]value`}
                      className="form-control"
                      placeholder="VALUE"
                      value={item.value}
                      onChange={(e) => {
                        const updatedParams = [...singleRequest?.params];
                        updatedParams[index].value = e.target.value;
                        setSingleRequest({
                          ...singleRequest,
                          params: updatedParams,
                        });
                      }}
                    />
                  ) : (
                    <input
                      type="file"
                      name={`params[${index}]value`}
                      className="form-control"
                      placeholder="VALUE"
                      onChange={fileChanged}
                    />
                  )}
                  <a
                    href="javascript:void(0);"
                    style={{ marginLeft: "8px" }}
                    onClick={() => removeItem(index, "Params")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-trash-2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Headers Tab */}
          <div
            className="params tab-pane fade"
            id="headers"
            role="tabpanel"
            aria-labelledby="headers-tab"
          >
            <a className="add" href="javascript:void(0);" onClick={addHeader}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </a>
            {singleRequest?.header.map((item, index) => (
              <div className="row" key={index}>
                <div className="col-md-6 d-flex mb-2">
                  <input
                    type="checkbox"
                    name={`header[${index}]selected`}
                    className="form-control"
                    style={{ width: "4%", marginRight: "8px" }}
                    checked={item.selected}
                    onChange={(e) => {
                      const updatedHeaders = [...singleRequest?.header];
                      updatedHeaders[index].selected = e.target.checked;
                      setSingleRequest({
                        ...singleRequest,
                        header: updatedHeaders,
                      });
                    }}
                  />
                  <select
                    name={`header[${index}]key`}
                    className="form-control"
                    value={item.key}
                    onChange={(e) => {
                      const updatedHeaders = [...singleRequest?.header];
                      updatedHeaders[index].key = e.target.value;
                      setSingleRequest({
                        ...singleRequest,
                        header: updatedHeaders,
                      });
                    }}
                  >
                    {headerMethod.map((method, methodIndex) => (
                      <option key={methodIndex} value={method.key}>
                        {method.key}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 d-flex">
                  <input
                    type="text"
                    name={`header[${index}]value`}
                    className="form-control"
                    placeholder="VALUE"
                    value={item.value}
                    onChange={(e) => {
                      const updatedHeaders = [...singleRequest?.header];
                      updatedHeaders[index].value = e.target.value;
                      setSingleRequest({
                        ...singleRequest,
                        header: updatedHeaders,
                      });
                    }}
                  />
                  <a
                    href="javascript:void(0);"
                    style={{ marginLeft: "8px" }}
                    onClick={() => removeItem(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-trash-2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Body Tab */}
          <div
            className="tab-pane fade"
            id="body"
            role="tabpanel"
            aria-labelledby="body-tab"
          >
            <textarea
              className="form-control"
              id="bodyText"
              name="bodyText"
              rows="5"
              placeholder="Enter body here..."
              value={singleRequest?.raw_data}
              onChange={(e) =>
                setSingleRequest({ ...singleRequest, raw_data: e.target.value })
              }
            ></textarea>
          </div>
        </div>
      </form>
    </>
  );
};

export default RequestForm;
