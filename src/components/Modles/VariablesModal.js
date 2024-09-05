import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Input, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";

const VariablesModal = ({ isOpen, isClose }) => {
  const { projectId } = useParams();
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);
  const [variables, setVariables] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentVariableId, setCurrentVariableId] = useState(null);

  const userSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    value: yup.string().required("Value is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (projectId) {
      getVariables(projectId);
    }
  }, [projectId]);

  const getVariables = async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/veriables`);
      setVariables(response.data.data.projectVeriables);
    } catch (error) {
      console.error("Error fetching variables", error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editMode) {
        await updateVariable(currentVariableId, data);
      } else {
        const requestData = {
          ...data,
          project_id: projectId,
        };
        const response = await api.post(`/projects/veriable`, requestData);
        handlePostVariableSuccess(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      handlePostVariableError(error);
      setIsLoading(false);
    }
  };

  const updateVariable = async (id, data) => {
    try {
      const response = await api.post(`/projects/veriable/${id}/update`, data);
      handleUpdateVariableSuccess(response.data.data.projectVeriable);
    } catch (error) {
      handlePostVariableError(error);
    }
  };

  const handlePostVariableSuccess = (data) => {
    const updatedVariables = [data.data.projectVeriable, ...variables];
    setVariables(updatedVariables);
    reset();
    flashMessage({ type: "success", messages: data.msg });
    setEditMode(false);
    setCurrentVariableId(null);
  };

  const handleUpdateVariableSuccess = (data) => {
    const updatedVariables = variables.map((variable) =>
      variable.id === data.id ? data : variable
    );
    setVariables(updatedVariables);
    reset();
    flashMessage({ type: "success", messages: data.msg });
    setEditMode(false);
    setCurrentVariableId(null);
  };

  const handlePostVariableError = (error) => {
    flashMessage({
      type: "error",
      messages: error.response?.data?.msg || "An error occurred",
    });
  };

  const editVariable = (variable) => {
    reset({ name: variable.name, value: variable.value });
    setEditMode(true);
    setCurrentVariableId(variable.id);
  };

  const deleteVariable = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.delete(`/projects/veriable/${id}`);
      setVariables(variables.filter((variable) => variable.id !== id));
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({ type: "error", messages: "Failed to delete variable" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={isClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="modal-content inputcontrasts galaxy-width"
        p={3}
        sx={{
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="div">
            Manage Environments
          </Typography>
          <CloseIcon onClick={isClose} aria-label="Close icon" />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} display="flex" gap={2}>
            <Box flex={1}>
              <Typography variant="body2" color="textSecondary">
                Name<span className="text-black">*</span>
              </Typography>
              <Input
                type="text"
                name="name"
                id="name"
                className={`form-control input-group m-b-0 inputcontrasts ${
                  errors.name ? "is-invalid" : ""
                }`}
                margin="normal"
                placeholder="Enter name"
                {...register("name")}
              />
              <Typography color="error" variant="body2">
                {errors.name && errors.name.message}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="body2" color="textSecondary">
                Value<span className="text-black">*</span>
              </Typography>
              <Input
                type="text"
                name="value"
                id="value"
                className={`form-control input-group m-b-0 inputcontrasts ${
                  errors.value ? "is-invalid" : ""
                }`}
                margin="normal"
                placeholder="Enter value"
                {...register("value")}
              />
              <Typography color="error" variant="body2">
                {errors.value && errors.value.message}
              </Typography>
            </Box>
          </Box>
          <Box mb={2} display="flex" justifyContent="start">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              Save
            </button>
          </Box>
        </form>

        <Box>
          <table
            className="table"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th>VARIABLE</th>
                <th>INITIAL VALUE</th>
                <th></th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((variable) => (
                <tr key={variable.id}>
                  <td>{variable.name}</td>
                  <td style={{ overflow: "hidden" }}>{variable.value}</td>
                  <td></td>
                  <td>
                    <a
                      href="javascript:void(0);"
                      style={{ cursor: "pointer", marginRight: "13px" }}
                      onClick={() => editVariable(variable)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit"
                      >
                        <path d="M3 17.25V21h3.75L21.08 7.75l-3.75-3.75L3 17.25z"></path>
                        <path d="M14.09 4.91l3.75 3.75"></path>
                      </svg>
                    </a>
                    <a
                      href="javascript:void(0);"
                      style={{ cursor: "pointer", marginRight: "13px" }}
                      onClick={() => deleteVariable(variable.id)}
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
                        <path d="M19 6L17.861 19.447a1 1 0 01-.999.883H7.138a1 1 0 01-.999-.883L5 6M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Modal>
  );
};

export default VariablesModal;
