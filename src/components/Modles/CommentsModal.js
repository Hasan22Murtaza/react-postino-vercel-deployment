import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";
import { useParams } from "react-router-dom";

const CommentsModal = ({
  isOpen,
  isClose,
  requestId,
  setComments,
  comments,
}) => {
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);

  const Schema = yup.object().shape({
    comment: yup.string().required("Comment is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      comment: "",
    },
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("/comments", {
        comment: data.comment,
        request_id: requestId,
      });
      setComments([...comments, response.data.data.comment]);
      reset();
      flashMessage({
        type: "success",
        messages: response.data.msg,
      });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "Failed to add comment",
      });
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
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="div">
            Comments
          </Typography>
          <CloseIcon
            onClick={isClose}
            aria-label="Close icon"
            sx={{ cursor: "pointer" }}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              multiline
              rows={4}
              placeholder="Enter your comment here"
              {...register("comment")}
              error={!!errors.comment}
              helperText={errors.comment ? errors.comment.message : ""}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box display="flex" justifyContent="end" alignItems="center" mt={2}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </Box>
        </form>

        <Box mt={3}>
          {comments.length > 0 ? (
            comments.map((c) => (
              <Box key={c.id} mb={2}>
                <Box
                  p={2}
                  bgcolor="background.default"
                  borderRadius={1}
                  boxShadow={1}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {c?.user?.first_name} {c?.user?.last_name}
                  </Typography>
                  <Typography variant="body2">{c?.comment}</Typography>
                </Box>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentsModal;
