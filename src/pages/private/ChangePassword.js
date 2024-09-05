import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";

const ChangePassword = () => {
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    old_password: yup.string().required("Current Password is required"),
    password: yup
      .string()
      .min(6, "New Password must be at least 6 characters")
      .required("New Password is required"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await api.post("/change-password", data);
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({ type: "error", messages: error.response.data.msg });
      console.error("Change password failed:", error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h5 className="text-muted font-weight-normal mb-4">
                Change Password
              </h5>
              <form
                className="forms-sample"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="form-group setup-password-field">
                  <label htmlFor="old_password">Current Password</label>
                  <input
                    type="password"
                    name="old_password"
                    id="old_password"
                    className={`form-control ${
                      errors.old_password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your current password"
                    {...register("old_password")}
                  />
                  {errors.old_password && (
                    <div className="invalid-feedback">
                      {errors.old_password.message}
                    </div>
                  )}
                </div>

                <div
                  className="form-group setup-password-field"
                  style={{ marginTop: "15px" }}
                >
                  <label htmlFor="password">
                    New Password (Min 6 characters)
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your new password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label htmlFor="password_confirmation">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    className={`form-control ${
                      errors.password_confirmation ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm your new password"
                    {...register("password_confirmation")}
                  />
                  {errors.password_confirmation && (
                    <div className="invalid-feedback">
                      {errors.password_confirmation.message}
                    </div>
                  )}
                </div>

                <div className="form-row" style={{ marginTop: "15px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Change Password
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

export default ChangePassword;
