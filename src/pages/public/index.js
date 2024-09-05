import React from "react";
import { Route, Routes } from "react-router-dom";
import PreLoginLayout from "../../components/Layouts/PreLoginLayout";
import Login from "./Auth/Login";
import Request from "./Requests/Request";
import ForgetPassword from "./Auth/ForgetPassword";
import ResetPassword from "./Auth/ResetPassword";
import ActivateAccount from "./Auth/ActivateAccount";

const PublicPortal = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
      <Route
        path="/"
        element={
          <React.Suspense fallback={<></>}>
            <Request />
          </React.Suspense>
        }
      />
      <Route
        path="share/:id/:code"
        element={
          <React.Suspense fallback={<></>}>
            <Request />
          </React.Suspense>
        }
      />
        <Route path="/auth" element={<>{<PreLoginLayout />}</>}>
          <Route
            path="login"
            element={
              <React.Suspense fallback={<></>}>
                <Login />
              </React.Suspense>
            }
          />
          <Route
            path="forgot-password"
            element={
              <React.Suspense fallback={<></>}>
                <ForgetPassword />
              </React.Suspense>
            }
          />
          <Route
            path="reset-password/:email/:code"
            element={
              <React.Suspense fallback={<></>}>
                <ResetPassword />
              </React.Suspense>
            }
          />
          <Route
            path="activate/:email/:code"
            element={
              <React.Suspense fallback={<></>}>
                <ActivateAccount />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default PublicPortal;
