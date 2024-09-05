import React, { useEffect, useState } from 'react';
import { api } from '../../../api/apiService';
import { useErrorService } from '../../../config/MessageServiceProvider';

const Users = () => {
  const { flashMessage } = useErrorService();
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageObj, setPageObj] = useState({
    page: 1,
    pageSize: 15,
    totalElements: 0,
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users`, {
          page: pageObj.page,
          search_keyword: searchKeyword,
      });
      const data = response.data;
      setUsers(data.data.users.data);
      setPageObj(prev => ({
        ...prev,
        pageSize: data.data.users.per_page,
        totalElements: data.data.users.total,
      }));
    } catch (error) {
      flashMessage({ type: 'error', messages: error.data });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (index) => {
    setUsers(prevUsers =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, banned: !user.banned } : user
      )
    );
  };

  const updateStatus = async (user) => {
    try {
    const response =  await api.post(`/usersStatus`, {
        user_id: user.id,
        status: +user.banned,
      });
      flashMessage({ type: 'success', messages: response.data.msg });
    } catch (error) {
      flashMessage({ type: 'error', messages: error.data.msg });
    }
  };

  const deleteMember = async (id, index) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
       const response = await api.delete(`/users/${id}`);
        setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
        flashMessage({ type: 'success', messages: response.data.msg });
      } catch (error) {
        flashMessage({ type: 'error', messages: error.data.msg });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pageChange = (selectedPage) => {
    setPageObj(prev => ({ ...prev, page: selectedPage }));
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
            placeholder="Search by UserName / Email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyUp={getAllUsers}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last Login</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id}>
                      <th scope="row">{i + 1}</th>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-primary">
                          {user.roles[0].name}
                        </span>
                      </td>
                      <td>
                        <a onClick={() => {
                          toggleSection(i);
                          updateStatus(user);
                        }}>
                          <span style={{ color: 'Dodgerblue' }}>
                            <i
                              className={`fa-2x ${user.banned ? 'fad fa-toggle-on' : 'fas fa-toggle-off'}`}
                            ></i>
                          </span>
                        </a>
                      </td>
                      <td>
                        <span>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never Logged In'}
                        </span>
                      </td>
                      <td>
                        <a
                          href="javascript:void(0);"
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteMember(user.id, i)}
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
              </table>
            </div>
            <div className="row">
              <div className="col-md-12" style={{ paddingLeft: '50px' }}>
                {/* {pageObj.totalElements > 10 && (
                  <ngb-pagination
                    collectionSize={pageObj.totalElements}
                    page={pageObj.page}
                    onPageChange={pageChange}
                    pageSize={pageObj.pageSize}
                    boundaryLinks={true}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
