import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorContext = createContext();

export const MessageServiceProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alert, setAlert] = useState(null);
  const [timeout, setTimeoutState] = useState(0);

  const flashMessage = (data) => {
    console.log('data', data);
    if (data?.messages?.error === 'token_expired' || data?.messages?.error === 'token_invalid') {
      localStorage.clear();
      navigate('/login');
      return;
    }

    if (data?.messages) {
      if (data.messages.success !== 'Request completed successfully.') {
        setTimeoutState((prevTimeout) => prevTimeout + 60000);

        if (data.type === 'success') {
          let output = '';
          if (Array.isArray(data.messages.success)) {
            // Join array elements into a single string with line breaks
            output = data.messages.success.join('\n');
          } else {
            // Handle a single message string
            output = data.messages.success || '';
          }
          toast.success(output);
        }

        if (data.type === 'error') {
          let output = '';
          if (Array.isArray(data.messages)) {
            // Join array elements into a single string with line breaks
            output = data.messages.join('\n');
          } else {
            // Handle a single message string
            output = data.messages.msg || data.messages;
          }
          toast.error(output);
        }

        setAlert(data);
      } else {
        toast.success(data.messages.success);
      }
    }
  };

  const clear = () => {
    setAlert({ type: '', messages: '' });
  };

  useEffect(() => {
    clear();
  }, [location.pathname]); // Clear alert on route change

  useEffect(() => {
    const interval = setInterval(() => {
      clear();
    }, timeout);

    return () => clearInterval(interval);
  }, [timeout]);

  return (
    <ErrorContext.Provider value={{ flashMessage, clear }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorService = () => useContext(ErrorContext);
