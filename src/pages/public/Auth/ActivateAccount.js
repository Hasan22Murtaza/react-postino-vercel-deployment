import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { api } from '../../../api/apiService';
import { useErrorService } from '../../../config/MessageServiceProvider';

const ActivateAccount = () => {
  const navigate = useNavigate();
  const { email, code } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const { flashMessage } = useErrorService();

  const schema = yup.object().shape({
    password: yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (email && code) {
      setIsLoading(true);
      api.get(`/activate/${email}/${code}`)
        .then(response => handleActivateSuccess(response.data))
        .catch(error => handleError(error));
    }
  }, [email, code]);

  const handleActivateSuccess = (data) => {
    setValue('email', data.data.email);
    setValue('code', data.data.code);
    localStorage.setItem('is_active', '1');
    flashMessage({ type: 'success', messages: data.msg });
    setActivated(true);
    setIsLoading(false);
  };

  const handleError = (error) => {
    console.log(error);
    flashMessage({ type: 'error', messages: error.response?.data?.msg || 'An error occurred' });
    setIsLoading(false);
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await api.post('/setup-password', formData);
      
      const response = api.post('/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('email', response.data.data.user.email);
      localStorage.setItem('id', response.data.data.user.id);

      navigate('/projects');
      flashMessage({ type: 'success', messages: response.data.msg });
    } catch (error) {
      handleError(error);
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
              {/* Add any additional content or component here */}
            </div>
          </div>
          <div className="col-md-8 pl-md-0">
            <div className="auth-form-wrapper px-4 py-5">
              <a href="#" className="noble-ui-logo d-block mb-2">
                Post<span>ino</span>
              </a>
              <h5 className="text-muted font-weight-normal mb-4">
              Your Account is Activated Successfully...
              Setup your Account Password
              </h5>
              <form className="forms-sample" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="New Password"
                      {...register('password')}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input
                      type="password"
                      id="password_confirmation"
                      className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                      placeholder="Confirm Password"
                      {...register('password_confirmation')}
                    />
                    {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
                  </div>
                  <div className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary mr-2 mb-2 mb-md-0"
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ActivateAccount;
