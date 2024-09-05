import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Input,
  Modal,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";

const ProjectModal = ({ isOpen, isClose, handleProjectRes, project }) => {
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);

  const projectSchema = yup.object().shape({
    name: yup.string().required("Project Name is required"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
    },
  });

  // Form submission logic
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = project?.id
        ? await api.post(`/projects/${project.id}/update`, data)
        : await api.post("/projects", data);

      console.log("response", response.data.data.project);
      handleProjectRes(response.data.data.project);
      flashMessage({ type: "success", messages: response.data.msg });
      isClose();
      setIsLoading(false);
      reset();
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
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
      <Box className="modal-content inputcontrasts galaxy-width">
        <Box display="flex" justifyContent="space-between" id="modal-title">
          <Typography className="h3-text modalTitle">
            {project?.id ? "Edit Project" : "Add New Project"}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box id="modal-description">
            <Box mb={2}>
              <p className="f-14 gray7 m-b-0 font-weight-400">
                Title of Project<span className="text-black">*</span>{" "}
              </p>
              <Input
                type="text"
                name="name"
                id="name"
                className={`form-control input-group m-b-0 inputcontrasts ${
                  errors.name ? "is-invalid" : ""
                }`}
                margin="normal"
                placeholder="Enter title of Project"
                {...register("name")}
              />
              <span className="danger-color error-msg">
                {errors.name && errors.name.message}
              </span>
            </Box>
            <Box mb={2}>
              <p className="f-14 gray7 m-b-0 font-weight-400 mt-15">
                Description
              </p>
              <Input
                type="text"
                name="description"
                id="description"
                className="form-control input-group mb-0 inputcontrasts"
                margin="normal"
                placeholder="Enter Description"
                {...register("description")}
              />
            </Box>
          </Box>

          <Box
            id="modal-footer"
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !isValid}
            >
              Save
            </button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ProjectModal;
