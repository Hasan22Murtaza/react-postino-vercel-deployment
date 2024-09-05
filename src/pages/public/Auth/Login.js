import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../../api/apiService";
import { useErrorService } from "../../../config/MessageServiceProvider";
const Login = () => {
  const { flashMessage } = useErrorService();
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
        const response = await api.post("/login", data);
        console.log("responso", response.data);

        flashMessage({ 'type': 'success', 'messages': response.data.msg });
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('type', response.data.data.user.roles[0].slug);
        navigate('/user/projects');       
        setIsLoading(false);

    } catch (error) {
      flashMessage( {'type': 'error', 'messages': error.data.msg } );
      console.error("Login failed:", error.data.msg);
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
              Welcome back! Log in to your account.
            </h5>
            <form
              className="forms-sample"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  id="email"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="form-check form-check-flat form-check-primary">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                  />
                  Remember me
                </label>
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary mr-2 mb-2 mb-md-0"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
              <Link
                to="/auth/forgot-password"
                className="d-block mt-3 text-muted"
              >
                Forgot Password
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
