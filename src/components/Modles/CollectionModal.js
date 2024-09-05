import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Input,
  Modal,
  Typography
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";
import { useParams } from "react-router-dom";

const CollectionModal = ({ isOpen, isClose, handleCollectionRes, collection }) => {
  const { projectId } = useParams();
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);

  const Schema = yup.object().shape({
    name: yup.string().required("Collection Name is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      name: "", 
    },
  });

  useEffect(() => {
    if (collection) {
      setValue("name", collection.name || ""); 
    }
  }, [collection, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = collection?.id
        ? await api.post(`/collections/${collection.id}/update/${collection.project_id}`, data)
        : await api.post(`/collections/${projectId}`, data);

      handleCollectionRes(response.data.data.collection);
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
      <Box
        className="modal-content inputcontrasts galaxy-width"
        p={3}
        sx={{
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {collection?.id ? "Edit Collection" : "Add Collection"}
          </Typography>
          <CloseIcon
            onClick={isClose}
            aria-label="Close icon"
            sx={{ cursor: 'pointer' }}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Title of Collection<span className="text-black">*</span>
            </Typography>
            <Input
              type="text"
              name="name"
              id="name"
              className={`form-control input-group m-b-0 inputcontrasts ${
                errors.name ? "is-invalid" : ""
              }`}
              margin="normal"
              placeholder="Enter title of collection"
              {...register("name")}
            />
            <Typography color="error" variant="body2">
              {errors.name && errors.name.message}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="end" alignItems="center" mt={2}>
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

export default CollectionModal;
