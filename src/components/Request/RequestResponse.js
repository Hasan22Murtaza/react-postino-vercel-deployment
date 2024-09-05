import React from "react";
const RequestResponse = (props) => {
  const { request } = props;

  return (
    <>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-tabs">
              <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="editor-tab"
                    data-toggle="tab"
                    href="#editor"
                    role="tab"
                    aria-controls="editor"
                    aria-selected="true"
                  >
                    Editor
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="pretty-tab"
                    data-toggle="tab"
                    href="#pretty"
                    role="tab"
                    aria-controls="pretty"
                    aria-selected="true"
                  >
                    Pretty
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="raw-tab"
                    data-toggle="tab"
                    href="#raw"
                    role="tab"
                    aria-controls="raw"
                  >
                    Raw
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="html-tab"
                    data-toggle="tab"
                    href="#html"
                    role="tab"
                    aria-controls="html"
                  >
                    HTML
                  </a>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
              <div
                  className="tab-pane fade show active"
                  id="editor"
                  role="tabpanel"
                  aria-labelledby="editor-tab"
                >
                  <pre>{request?.response}</pre>
                </div>
                <div
                  className="tab-pane fade show"
                  id="pretty"
                  role="tabpanel"
                  aria-labelledby="pretty-tab"
                >
                  <pre>{request?.response}</pre>
                </div>
                <div
                  className="tab-pane fade"
                  id="raw"
                  role="tabpanel"
                  aria-labelledby="raw-tab"
                >
                  <textarea cols="129" rows="20"   value={request?.response_raw || ''} />
                </div>
                <div
                  className="tab-pane fade"
                  id="html"
                  role="tabpanel"
                  aria-labelledby="html-tab"
                >
                  <pre>{request?.response_html}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestResponse;
