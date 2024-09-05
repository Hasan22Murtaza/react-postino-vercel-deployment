import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/apiService';
import { AppContext } from '../contexts/context';
import { getDefaultSingleRequest } from '../config/utils';

const Sidebar = () => {
  const [collections, setCollections] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const { singleRequest, setSingleRequest, collection } = useContext(AppContext);
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setRequestId(query.get('request_id'));
    if (projectId) {
      getCollection();
    } else {
      setCollections([]);
    }
  }, [projectId]);

  useEffect(() => {
    if (singleRequest) {
      handleUpdateCollectionList(singleRequest);
    }
  }, [singleRequest]);
  useEffect(() => {
    if (collection) {
      getCollection();
      // setCollections(prevCollections => [collection, ...prevCollections]);
    }
  }, [collection]);

  const getCollection = async () => {
    try {
      const response = await api.get(`/collections/${projectId}`);
      handleCollectionSuccess(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCollectionSuccess = (data) => {
    setCollections(data.data.collections);

    if (requestId) {
      setTimeout(() => {
        const element = document.querySelector(`[data-request-id="${requestId}"]`);
        element.parentElement.parentElement.classList.toggle('hide');
        element.parentElement.parentElement.classList.toggle('show');
        element.click();
      }, 1);
    }
  };

  const handleUpdateCollectionList = (singleRequest) => {
    setCollections((prevCollections) => {
      const updatedCollections = prevCollections.map((collection) => {
        if (collection.id === singleRequest.collection_id) {
          const requestExists = collection?.requests?.some(
            (request) => request.id === singleRequest.id
          );
  
          if (requestExists) {
            if (singleRequest.requestDelete) {
              return {
                ...collection,
                requests: collection.requests.filter(
                  (request) => request.id !== singleRequest.id
                ),
              };
            } else {
              return {
                ...collection,
                requests: collection.requests.map((request) =>
                  request.id === singleRequest.id ? singleRequest : request
                ),
              };
            }
          } else if (!singleRequest.requestDelete) {
            return {
              ...collection,
              requests: [...collection?.requests, singleRequest],
            };
          }
        }
        return collection;
      });
  
      return updatedCollections;
    });
  
    if (singleRequest.requestDelete) {
      setSingleRequest(getDefaultSingleRequest());
    }
  };
  
  

  const handleToggleSidebar = (event) => {
    const target = event.currentTarget;
    const buttons = document.querySelectorAll('.sidebar-body .nav-item > a.red');
    buttons.forEach((button) => button.classList.remove('red'));
    target.classList.add('red');
    const children = target.parentElement.childNodes;
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === 'DIV') {
        children[i].classList.toggle('hide');
        children[i].classList.toggle('show');
      }
    }
  };

  const handleSelectRequest = (request) => {
    setSingleRequest(request);
  };

  const filterCollections = (collections) => {
    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const renderRecursiveList = (collections) => {
    return collections.map((item, index) => (
      <li className="nav-item" key={item.id}>
        <a
          className="nav-link"
          href="javascript:void(0);"
          role="button"
          aria-expanded="false"
          aria-controls="emails"
          onClick={handleToggleSidebar}
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
            className="feather feather-database"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <span className="link-title">{item.name}</span>
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
            className="feather feather-chevron-down link-arrow"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </a>
        <div className="hide">
          <ul style={{ listStyleType: 'none' }}>
            {item.children_collections &&
              item.children_collections.length > 0 &&
              renderRecursiveList(item.children_collections)}
          </ul>
          <ul className="nav sub-menu">
            {item.requests &&
              item.requests.length > 0 &&
              item.requests
                .filter((request) =>
                  request.name.toLowerCase().includes(searchKeyword.toLowerCase())
                )
                .map((request, i) => (
                  <li
                    className={`nav-item ${selectedIndex === i ? 'active' : ''}`}
                    data-request-id={request.id}
                    key={request.id}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <a
                      href="javascript:void(0);"
                      className="nav-link"
                      onClick={() => handleSelectRequest(request)}
                      title={request.name}
                    >
                      {i + 1}. {request.name.slice(0, 20)}
                    </a>
                  </li>
                ))}
          </ul>
        </div>
      </li>
    ));
  };

  return (
    <nav className="sidebar" resizable-min-width="10">
      <div className="sidebar-header">
        <a href="javascript:void(0);" className="sidebar-brand">
          Post<span>ino</span>
        </a>
        <div className="sidebar-toggler not-active">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="sidebar-body">
        <ul className="nav">
          <li className="nav-item">
            <input
              type="text"
              name="search_keyword"
              className="form-control"
              placeholder="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </li>
          {collections.length > 0 && (
            <li className="nav-item nav-category">Collections</li>
          )}
          {renderRecursiveList(filterCollections(collections))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
