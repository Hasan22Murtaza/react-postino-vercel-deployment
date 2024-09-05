import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../api/apiService";
import { useErrorService } from "../../../config/MessageServiceProvider";
import CollectionModal from "../../../components/Modles/CollectionModal";

const ProjectsCollections = () => {
  const [projectsCollections, setProjectsCollections] = useState([]);
  const [collection, setCollection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();
  const completeModalRef = useRef(null);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);

  useEffect(() => {
    getProjectsCollections();
  }, []);

  const getProjectsCollections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("projects/collections");
      setProjectsCollections(response.data.data.projects);
    } catch (error) {
      flashMessage({ type: "error", messages: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProjectCollection = async (id) => {
    if (window.confirm("Are you sure you want to delete this Collection?")) {
      setIsLoading(true);
      try {
        const response = await api.delete(`/collections/${id}`);
        flashMessage({ type: "success", messages: response.data.msg });
        getProjectsCollections();
      } catch (error) {
        flashMessage({ type: "error", messages: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportCollection = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/projects/collection/export?collection_id=${id}&by=collection`
      );
      window.open(response.data.data.JSONFileUrl, "_blank");
      flashMessage({ type: "success", messages: response.data.msg });
    } catch (error) {
      flashMessage({ type: "error", messages: error.data.msg });
    } finally {
      setIsLoading(false);
    }
  };

  const gotoProject = (project) => {
    console.log("pro", project);
    navigate(`/user/projects/${project.id}`);
    localStorage.setItem("project_name", project.name);
  };
  const handleUpdateCollection = (collection) => {
    console.log("coll", collection);
    setCollection(collection)
    setOpenCollectionModal(true);
  };

  const handleCollectionRes = (collection) => {
    getProjectsCollections();
  }


  return (
    <div className="page-content">
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {projectsCollections.map((projectsCollection, index) => (
                <table
                  className="table table-hover"
                  style={{ width: "60%" }}
                  key={index}
                >
                  {projectsCollection.collections.length > 0 && (
                    <>
                      <thead>
                        <tr>
                          <th colSpan="3">{projectsCollection.name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectsCollection.collections.map((collection, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <a
                                href="javascript:void(0);"
                                onClick={() => gotoProject(projectsCollection)}
                              >
                                {collection.name}
                              </a>{" "}
                              {collection.requests_count
                                ? collection.requests_count
                                : 0}{" "}
                              Requests
                            </td>
                            <td className="d-flex float-right">
                              <Link
                                to={`/user/collections/${collection.id}`}
                                className="pointer m-r-10"
                                >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-activity"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </Link>
                              <a
                                href="javascript:void(0);"
                                onClick={() =>
                                  handleExportCollection(collection.id)
                                }
                                className="pointer m-r-10"

                              >
                                <i
                                  className="fas fa-cloud-download-alt"
                                  style={{ fontSize: "24px" }}
                                ></i>
                              </a>
                              <a
                                href="javascript:void(0);"
                                onClick={() => handleUpdateCollection(collection)}
                                className="pointer m-r-10"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-activity"
                                >
                                  <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                                </svg>
                              </a>
                              <a
                                href="javascript:void(0);"
                                onClick={() =>
                                  deleteProjectCollection(collection.id)
                                }
                                className="pointer m-r-10" style={{marginTop: '4px'}}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing collection */}
      <CollectionModal
        isOpen={openCollectionModal}
        isClose={() => setOpenCollectionModal(false)}
        handleCollectionRes={handleCollectionRes}
        collection={collection}
      />
    </div>
  );
};

export default ProjectsCollections;
