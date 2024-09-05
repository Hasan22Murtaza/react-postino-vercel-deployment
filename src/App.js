import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageServiceProvider } from "./config/MessageServiceProvider";
import { AppContext } from "./contexts/context";
import PrivatePortal from "./pages/private";
import PublicPortal from "./pages/public";
import Request from "./pages/public/Requests/Request";
import { getDefaultSingleRequest } from "./config/utils";

function App() {
  const [singleRequest, setSingleRequest] = useState(getDefaultSingleRequest());
  const [collection, setCollection] = useState();

  return (
    <>
      <MessageServiceProvider>
        <AppContext.Provider
          value={{
            singleRequest,
            setSingleRequest,
            collection,
            setCollection
          }}
        >
          <Routes>
            <Route
              path="/*"
              element={
                <AuthGuardRedirect redirectTo="/user/projects">
                  <PublicPortal />
                </AuthGuardRedirect>
              }
            />
            <Route
              path="user/*"
              element={
                <RequireAuth redirectTo="/auth/login">
                  <PrivatePortal />
                </RequireAuth>
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
          </Routes>
        </AppContext.Provider>

        <ToastContainer hideProgressBar />
      </MessageServiceProvider>
    </>
  );
}

export default App;

function RequireAuth({ children, redirectTo }) {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    const currentPath = window.location.pathname + window.location.search;
    const redirectPath = `${redirectTo}?redirectTo=${encodeURIComponent(
      currentPath
    )}`;
    return <Navigate to={redirectPath} />;
  }
  return isAuthenticated ? children : null;
}
function AuthGuardRedirect({ children, redirectTo }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}
