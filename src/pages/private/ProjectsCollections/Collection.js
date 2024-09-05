import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useErrorService } from "../../../config/MessageServiceProvider";
import { api } from "../../../api/apiService";

const Collection = () => {
  const [requests, setRequests] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { flashMessage } = useErrorService();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  useEffect(() => {
    getProjectsCollections();
  }, [collectionId]);

  const getProjectsCollections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/collections/${collectionId}/view?`);
      setRequests(response.data.data.collection.requests);
      setCollectionName(response.data.data.collection.name);
      setIsLoading(false);
    } catch (error) {
        flashMessage({ type: "error", messages: error.message });
        setIsLoading(false);
    }
  };

  const goTo = (projectId, requestId) => {
    navigate(`/user/projects/${projectId}`, { search: `?request_id=${requestId}` });
  };

  return (
    <div className="page-content">
      <div className="main">
        <div className="form-group has-search">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            type="text"
            className="form-control"
            name="search_keyword"
            placeholder="Search by Name / EndPoint"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col" style={{ width: "30%" }}>Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">EndPoint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, i) => (
                      <tr key={request.id}>
                        <td scope="row" className="tabel_boder">{i + 1}</td>
                        <td
                          scope="row"
                          className="tabel_boder"
                          title={request.name}
                          onClick={() => goTo(request.project_id, request.id)}
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          {request.name.slice(0, 25)}
                        </td>
                        <td className="tabel_boder">
                          <span className={`badge bg-${getTypeBadge(request.type)}`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="tabel_boder" title={request.url}>
                          {request.url.slice(0, 35)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTypeBadge = (type) => {
  switch (type) {
    case 'GET':
      return 'success';
    case 'POST':
      return 'warning';
    case 'PUT':
      return 'secondary';
    case 'PATCH':
      return 'primary';
    case 'DELETE':
      return 'danger';
    default:
      return 'default';
  }
};

export default Collection;
