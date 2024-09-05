import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../../api/apiService";
import { useErrorService } from "../../../config/MessageServiceProvider";

const ResetPassword = () => {
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();
  const { email, code } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/setup-password", { ...data, email, code });

      const response = await api.post("/login", {
        email,
        password: data.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("type", response.data.data.user.roles[0].slug);
      navigate("/user/projects");
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({
        type: "error",
        messages: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-md-8 col-xl-6 mx-auto">
    <div className="card">
      <div className="row">
        <div className="col-md-4 pr-md-0">
          <div className="auth-left-wrapper">
            {/* You can add content or components here */}
          </div>
        </div>
        <div className="col-md-8 pl-md-0">
          <div className="auth-form-wrapper px-4 py-5">
            <a
              href="javascript:void(0);"
              className="noble-ui-logo d-block mb-2"
            >
              Post<span>ino</span>
            </a>
            <h5 className="text-muted font-weight-normal mb-4">
            Reset Password
            </h5>
            <form className="forms-sample" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  placeholder="New Password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password_confirmation">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  className={`form-control ${
                    errors.password_confirmation ? "is-invalid" : ""
                  }`}
                  id="password_confirmation"
                  placeholder="Confirm Password"
                  {...register("password_confirmation")}
                />
                {errors.password_confirmation && (
                  <div className="invalid-feedback">
                    {errors.password_confirmation.message}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary mr-2 mb-2 mb-md-0"
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
