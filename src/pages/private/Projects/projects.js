import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/apiService";
import { useErrorService } from "../../../config/MessageServiceProvider";
import ProjectModal from "../../../components/Modles/ProjectModal";
import TeamsModal from "../../../components/Modles/TeamsModal";

const Projects = () => {
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [iOpenTeamModal, setIsOpenTeamModal] = useState(false);

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const type = localStorage.getItem("type");
    setUserType(type);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/projects");
      setProjects(response.data.data.projects);
    } catch (error) {
      flashMessage({ type: "error", messages: error.data.msg });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setIsLoading(true);
      try {
        const response = await api.delete(`/projects/${id}`);
        setProjects((prevProjects) =>
          prevProjects.filter((_, i) => i !== index)
        );
        flashMessage({ type: "success", messages: response.data.msg });
      } catch (error) {
        flashMessage({ type: "error", messages: error.data.msg });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProjectView = (project) => {
    navigate(`/user/projects/${project.id}`);
    localStorage.setItem("project_name", project.name);
  };

  const handleProjectRes = (updatedProject) => {
    setProjects((prevProjects) => {
      const projectIndex = prevProjects.findIndex((project) => project.id === updatedProject.id);
      if (projectIndex > -1) {
        const newProjects = [...prevProjects];
        newProjects[projectIndex] = updatedProject;
        return newProjects;
      } else {
        return [updatedProject, ...prevProjects];
      }
    });
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleEditProject = (project) => {
    setProject(project);
    setModalOpen(true);
  }

  const handleOpenTeamModal = (project) => {
    setProject(project);
    setIsOpenTeamModal(true);
  }


  return (
    <div className="page-content">
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {userType === "super-admin" && (
                <button
                  type="button"
                  className="btn btn-success m-b-20"
                  data-toggle="modal"
                  data-target="#add_project"
                  onClick={() => setModalOpen(true)}
                >
                  Add New Project
                </button>
              )}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Updated At</th>
                    <th scope="col"></th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, i) => (
                    <tr key={project.id}>
                      <td>{i + 1}</td>
                      <td>
                        <a
                          href="javascript:void(0);"
                          onClick={() => handleProjectView(project)}
                        >
                          {project.name}
                        </a>
                      </td>
                      <td>{project?.description?.slice(0, 30)}...</td>
                      <td>
                        {new Date(project.updated_at).toLocaleDateString()}
                      </td>
                      <td></td>
                      <td>
                        <a
                          href="javascript:void(0);"
                          className="pointer m-r-10"
                          onClick={() => handleOpenTeamModal(project)}
                          
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-activity"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </a>
                        <a
                          href="javascript:void(0);"
                          onClick={() => handleProjectView(project)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-activity"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </a>
                        &nbsp;
                        {userType === "super-admin" && (
                          <>
                            <a
                              href="javascript:void(0);"
                              className="pointer m-r-10"
                              onClick={() => handleEditProject(project)}                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-activity"
                              >
                                <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                              </svg>
                            </a>
                            <a
                              href="javascript:void(0);"
                              className="pointer m-r-10"
                              onClick={() => deleteProject(project.id, i)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-trash-2"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen &&
      <ProjectModal
        isOpen={isModalOpen}
        isClose={handleCloseModal}
        handleProjectRes={handleProjectRes}
        project={project}
        // isLoading={isLoading}
      />}
      {iOpenTeamModal &&
      <TeamsModal
        isOpen={iOpenTeamModal}
        isClose={() => setIsOpenTeamModal(false)}
        handleProjectRes={handleProjectRes}
        project={project}
        userType={userType}
        // isLoading={isLoading}
      />}

    </div>
  );
};

export default Projects;
