import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import { useErrorService } from "../../config/MessageServiceProvider";
import { AppContext } from "../../contexts/context";
import CollectionModal from "../Modles/CollectionModal";

const SubRequestForm = () => {
  const { projectId } = useParams();
  const { flashMessage } = useErrorService();
  const { singleRequest, setSingleRequest, setCollection } = useContext(AppContext);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/collections/${projectId}/onlyCollections`
      );
      setCollections(response.data.data.collections);
    } catch (error) {
      flashMessage({ type: "error", messages: error.data.msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setSingleRequest((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleAddCollection = (project) => {
    setOpenCollectionModal(true);
  };

  const handleCollectionRes = (collection) => {
    setCollection(collection);
    setCollections(prevCollections => [collection, ...prevCollections]);
};

  return (
    <div className="row">
      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
        <div className="form-group">
          <label htmlFor="collectionSelect">Collection</label>
          <a
            className="add-collection"
            href="javascript:void(0);"
            onClick={handleAddCollection}
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
              className="feather feather-plus-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </a>
          <select
            name="collection_id"
            id="collectionSelect"
            className="form-control"
            required
            value={singleRequest?.collection_id}
            onChange={handleChange("collection_id")}
          >
            <option value="" disabled>
              Select
            </option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
        <div className="form-group">
          <label htmlFor="requestName">Request</label>
          <input
            type="text"
            name="name"
            id="requestName"
            className="form-control request_name"
            value={singleRequest?.name}
            onChange={handleChange("name")}
          />
        </div>
      </div>
      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
        <div className="form-group">
          <label htmlFor="orderBy">Order By</label>
          <input
            type="text"
            name="order_by"
            id="orderBy"
            className="form-control request_name"
            value={singleRequest?.order_by}
            onChange={handleChange("order_by")}
          />
        </div>
      </div>
      <CollectionModal
        isOpen={openCollectionModal}
        isClose={() => setOpenCollectionModal(false)}
        handleCollectionRes={handleCollectionRes}
      />
    </div>
  );
};

export default SubRequestForm;
