import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../../api/apiService";
import { useErrorService } from "../../../config/MessageServiceProvider";

const ForgetPassword = () => {
    const { flashMessage } = useErrorService();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
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
        const response = await api.post("/forget-password", data);
        flashMessage({ 'type': 'success', 'messages': response.data.msg });
        navigate('/auth/login');       
        setIsLoading(false);

    } catch (error) {
      // Handle errors here

      flashMessage( {'type': 'error', 'messages': error.data.msg } );
      console.error("Login failed:", error);
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
            <h5 class="text-muted font-weight-normal mb-4">Forgot Password.</h5>
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
              <div className="mt-3" style={{display: "inline"}}>
                <button
                  type="submit"
                  className="btn btn-primary mr-2 mb-2 mb-md-0"
                  disabled={isLoading}
                >
                    Forgot Password
                </button>
              </div>
              <Link
                to="/auth/login"
                className="d-block mt-3 text-muted"
                style={{float:"right"}}
              >
                Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ForgetPassword;
