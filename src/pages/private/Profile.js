import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/profile");
        const { first_name, last_name, email } = response.data.data.profile;
        setValue("first_name", first_name);
        setValue("last_name", last_name);
        setValue("email", email);
        setIsLoading(false);
      } catch (error) {
        flashMessage({ type: "error", messages: error.response.data.error });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);

    if (fileToUpload) {
      formData.append("profile_picture", fileToUpload);
    }

    try {
      const response = await api.post("/profile", formData);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      flashMessage({ type: "success", messages: response.data.msg });
      setIsLoading(false);
    } catch (error) {
      flashMessage({ type: "error", messages: error.response.data.error });
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        name="first_name"
                        id="first_name"
                        className={`form-control ${
                          errors.first_name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("first_name")}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">
                          {errors.first_name.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        name="last_name"
                        id="last_name"
                        className={`form-control ${
                          errors.last_name ? "is-invalid" : ""
                        }`}
                        type="text"
                        {...register("last_name")}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">
                          {errors.last_name.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="email"
                    {...register("email")}
                    readOnly
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="profile_picture">
                    Update Profile Picture
                  </label>
                  <input
                    name="profile_picture"
                    type="file"
                    id="profile_picture"
                    className="form-control"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="form-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
