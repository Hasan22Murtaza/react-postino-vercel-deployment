import React from "react";
import { Route, Routes } from "react-router-dom";
import PostLoginLayout from "../../components/Layouts/PostLoginLayout";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";
import Collection from "./ProjectsCollections/Collection";
import ProjectsCollections from "./ProjectsCollections/ProjectsCollections";
import RequestView from "./Request/RequestView";
import Users from "./Users/Users";

const Projects = React.lazy(() => import("./Projects/projects"));

const PrivatePortal = () => {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <PostLoginLayout />
          }
        >
          <Route
            path="/projects"
            element={
              <React.Suspense fallback={<></>}>
                <Projects />
              </React.Suspense>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <React.Suspense fallback={<></>}>
                <RequestView />
              </React.Suspense>
            }
          />
         <Route
            path="/collections"
            element={
              <React.Suspense fallback={<></>}>
                <ProjectsCollections />
              </React.Suspense>
            }
          />
          <Route
            path="/collections/:collectionId"
            element={
              <React.Suspense fallback={<></>}>
                <Collection />
              </React.Suspense>
            }
          />
          <Route
            path="/users"
            element={
              <React.Suspense fallback={<></>}>
                <Users />
              </React.Suspense>
            }
          />
           <Route
            path="/profile"
            element={
              <React.Suspense fallback={<></>}>
                <Profile />
              </React.Suspense>
            }
          />
          <Route
            path="/change-password"
            element={
              <React.Suspense fallback={<></>}>
                <ChangePassword />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
      </React.Suspense>
  );
};

export default PrivatePortal;
