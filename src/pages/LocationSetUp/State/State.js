import React, { useState, useEffect } from "react";

import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  listCountry,
  createState,
  listState,
  removeAndUpdatState,
  updateState,
  getState,
  removeState,
} from "../../../functions/Location/Location";
import DeleteModal from "../../../Components/Common/DeleteModal";
import FormsHeader from "../../../Components/Common/FormsModalHeader";
import FormsFooter from "../../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../../Components/Common/FormUpdateFooter";

const initialState = {
  StateName: "",
  // StateCode: "",
  CountryID: "",
  CountryName: "",
  isActive: false,
};

const State = () => {
  const [countries, setCountries] = useState([]);

  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");
  //validation check
  const [errCN, setErrCN] = useState(false);
  const [errsC, setErrsC] = useState(false);
  const [errSN, setErrSN] = useState(false);

  const [query, setQuery] = useState("");

  const {
    StateName,
    // StateCode,
    CountryID,
    isActive,
    CountryName,
  } = values;

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [States, setStates] = useState([]);
  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setIsSubmit(false);
    // setCompanyUsers(initialState);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    set_Id(_id);
    getState(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          CountryID: res.CountryID,
          StateName: res.StateName,
          // StateCode: res.StateCode,
          isActive: res.isActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCountryName();
  }, [CountryID]);

  const fetchCountryName = () => {
    countries.map((c) => {
      return (
        <React.Fragment key={c._id}>
          {c._id == CountryID &&
            setValues({ ...values, CountryName: c.CountryName })}
        </React.Fragment>
      );
    });
  };

  const loadCountries = () => {
    listCountry().then((res) => setCountries(res));
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const loadStates = () => {
    listState().then((res) => {
      setStates(res);
      console.log(res);
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isActive: e.target.checked });
  };

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log(values);

    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (
      // StateCode !== "" &&
      StateName !== "" &&
      CountryID !== ""
    ) {
      createState(values)
        .then((res) => {
          console.log(res);
          if (res.isOk) {
            console.log(res);
            setmodal_list(false);
            fetchStates();
            setValues(initialState);
          } else {
            if (res.field === 1) {
              setErrSN(true);
              setFormErrors({ StateName: "State with this name is exists!" });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("state id", remove_id);
    removeState(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(false);
        fetchStates();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const handleUpdateCancel = (e) => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateState(_id, values)
        .then((res) => {
          console.log(res);
          setmodal_edit(!modal_edit);
          fetchStates();
          setValues(initialState);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.StateName) {
      errors.StateName = "State Name is required!";
      setErrSN(true);
    }
    if (values.StateName) {
      setErrSN(false);
    }
    if (!values.CountryID) {
      errors.CountryID = "Select country name!";
      setErrCN(true);
    }
    if (values.CountryID) {
      setErrCN(false);
    }

    return errors;
  };

  const validClassCountryName =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassStateName =
    errSN && isSubmit ? "form-control is-invalid" : "form-control";

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    // fetchUsers(1); // fetch page 1 of users
  }, []);

  useEffect(() => {
    fetchStates();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchStates = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/location/states`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          isActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setStates(res.data);
          console.log(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setStates([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };
  const col = [
    {
      name: "State",
      selector: (row) => row.StateName,
      sortable: true,
      sortField: "StateName",
    },

    {
      name: "Country",
      selector: (row) => row.countryname,
      sortable: true,
      sortField: "countryname",
    },

    {
      name: "Status",
      selector: (row) => {
        return <p>{row.isActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "Status",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div>

              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = "State | ArtTint";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Location Setup"
            title="State"
            pageTitle="Location SetUp"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Country"
                    filter={filter}
                    handleFilter={handleFilter}
                    tog_list={tog_list}
                    setQuery={setQuery}
                  />
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={States}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add State
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <select
                name="CountryID"
                onChange={handleChange}
                className={validClassCountryName}
              >
                <option>Select Country</option>
                {countries.map((c) => {
                  return (
                    <React.Fragment key={c._id}>
                      {c.isActive && (
                        <option value={c._id}>{c.CountryName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                {" "}
                Country<span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.CountryID}</p>
              )}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassStateName}
                placeholder="Enter State Name"
                name="StateName"
                value={StateName}
                onChange={handleChange}
              />
              <Label>
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.StateName}</p>
              )}
            </div>

            <div className=" mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                value={isActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label ms-1">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <FormsFooter
              handleSubmit={handleClick}
              handleSubmitCancel={handleSubmitCancel}
            />
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit State
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <select
                name="CountryID"
                className={validClassCountryName}
                onChange={handleChange}
                value={CountryID}
              >
                {countries.map((c) => {
                  return (
                    <React.Fragment key={c._id}>
                      {c.isActive && (
                        <option value={c._id}>{c.CountryName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                {" "}
                Country<span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.CountryID}</p>
              )}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassStateName}
                placeholder="Enter State Name"
                id="StateName"
                name="StateName"
                value={StateName}
                onChange={handleChange}
              />
              <Label>
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.StateName}</p>
              )}
            </div>

            <div className=" mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                value={isActive}
                checked={isActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label ms-1">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <FormUpdateFooter
              handleUpdate={handleUpdate}
              handleUpdateCancel={handleUpdateCancel}
            />
          </ModalFooter>
        </form>
      </Modal>

      <DeleteModal
        show={modal_delete}
        handleDelete={handleDelete}
        toggle={handleDeleteClose}
        setmodal_delete={setmodal_delete}
      />
    </React.Fragment>
  );
};

export default State;
