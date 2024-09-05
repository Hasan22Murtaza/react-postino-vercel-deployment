import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Input, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";

const TeamsModal = ({ isOpen, isClose, project, userType }) => {
  const { flashMessage } = useErrorService();
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/projectMembers/${project.id}`);
      setTeamMembers(response.data.data.projectMembers);
    } catch (error) {
      flashMessage({ type: "error", messages: error.data.msg });
    } finally {
      setIsLoading(false);
    }
  };

  const userSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "Admin",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/projectMembers/${project.id}`, data);
      fetchTeamMembers();
      flashMessage({ type: "success", messages: response.data.msg });
      reset();
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeamMember = async (id, index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Team Member?"
    );
    if (confirmed) {
      setIsLoading(true);
      try {
        const response = await api.delete(`/projectMembers/${id}`);
        const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updatedTeamMembers);
        flashMessage({
          type: "success",
          messages: response.data.msg,
        });
      } catch (error) {
        flashMessage({
          type: "error",
          messages: error.response?.data?.msg || "An error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={isClose}
      aria-labelledby="team-modal-title"
      aria-describedby="team-modal-description"
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
          <Typography variant="h6" component="div">Team Members</Typography>
          <CloseIcon onClick={isClose} aria-label="Close icon" />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Box mb={2}>
            <table className="table" width="100%">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {userType === "super-admin" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((teamMember, index) => (
                  <tr key={teamMember.id}>
                    <td>{index + 1}</td>
                    <td>{`${teamMember.user.first_name} ${teamMember.user.last_name}`}</td>
                    <td>{teamMember.user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          teamMember.role === "Admin"
                            ? "badge-success"
                            : "badge-info"
                        }`}
                      >
                        {teamMember.role}
                      </span>
                    </td>
                    {userType === "super-admin" && (
                      <td>
                        <Button
                          onClick={() => deleteTeamMember(teamMember.id, index)}
                          style={{ marginRight: "13px" }}
                        >
                          <DeleteIcon />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <hr style={{ color: "red" }} />

            {userType === "super-admin" && (
              <>
                <Box display="flex" mb={2}>
                  <Box flex={1} pr={1}>
                    <p className="f-14 gray7 m-b-0 font-weight-400">
                      First Name<span className="text-black">*</span>
                    </p>
                    <Input
                      type="text"
                      name="first_name"
                      id="first_name"
                      className={`form-control input-group m-b-0 inputcontrasts ${
                        errors.first_name ? "is-invalid" : ""
                      }`}
                      margin="normal"
                      placeholder="Enter first name"
                      {...register("first_name")}
                    />
                    <span className="danger-color error-msg">
                      {errors.first_name && errors.first_name.message}
                    </span>
                  </Box>
                  <Box flex={1} pl={1}>
                    <p className="f-14 gray7 m-b-0 font-weight-400">
                      Last Name<span className="text-black">*</span>
                    </p>
                    <Input
                      type="text"
                      name="last_name"
                      id="last_name"
                      className={`form-control input-group m-b-0 inputcontrasts ${
                        errors.last_name ? "is-invalid" : ""
                      }`}
                      margin="normal"
                      placeholder="Enter last name"
                      {...register("last_name")}
                    />
                    <span className="danger-color error-msg">
                      {errors.last_name && errors.last_name.message}
                    </span>
                  </Box>
                </Box>
                <Box display="flex" mb={2}>
                  <Box flex={1} pr={1}>
                    <p className="f-14 gray7 m-b-0 font-weight-400">
                      Email<span className="text-black">*</span>
                    </p>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      className={`form-control input-group m-b-0 inputcontrasts ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      margin="normal"
                      placeholder="Enter email"
                      {...register("email")}
                    />
                    <span className="danger-color error-msg">
                      {errors.email && errors.email.message}
                    </span>
                  </Box>
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" justifyContent="end" mt={2}>
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

export default TeamsModal;
