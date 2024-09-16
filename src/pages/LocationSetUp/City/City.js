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

import {
  listCity,
  createCity,
  removeAndUpdateCity,
  removeCity,
  listState,
  listCountry,
  getCity,
  updateCity,
} from "../../../functions/Location/Location";
import axios from "axios";
import DataTable from "react-data-table-component";
import DeleteModal from "../../../Components/Common/DeleteModal";
import FormsHeader from "../../../Components/Common/FormsModalHeader";
import FormsFooter from "../../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../../Components/Common/FormUpdateFooter";

const initialState = {
  CityName: "",
  // CityCode: "",
  CountryID: "",
  StateID: "",
  isActive: false,
};

const City = () => {
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [remove_id, setRemove_id] = useState("");
  const [_id, set_Id] = useState("");
  //validation check
  const [errCiN, setErrCiN] = useState(false);
  const [errCC, setErrCC] = useState(false);
  const [errSN, setErrSN] = useState(false);
  const [errCN, setErrCN] = useState(false);

  const [query, setQuery] = useState("");

  const {
    CityName,
    // CityCode,
    CountryID,
    StateID,
    isActive,
  } = values;

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getCity(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          CityName: res.CityName,
          // CityCode: res.CityCode,
          CountryID: res.CountryID,
          StateID: res.StateID,
          isActive: res.isActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateCancel = (e) => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("city update", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateCity(_id, values)
        .then((res) => {
          console.log("updated city form", res);
          setmodal_edit(!modal_edit);
          fetchCity();
          setValues(initialState);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [Cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    loadCountries();
    // loadCity();
    loadStates();
  }, []);

  const loadCity = () => {
    listCity().then((res) => {
      setCities(res);
      console.log(res);
    });
  };

  const loadCountries = () => {
    listCountry().then((res) => setCountries(res));
  };

  const loadStates = () => {
    listState().then((res) => {
      setStates(res);
      //console.log(res);
    });
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
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
    setFormErrors({});
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log(values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    console.log(Object.keys(erros).length);
    if (Object.keys(erros).length === 0) {
      createCity(values)
        .then((res) => {
          if (res.isOk) {
            console.log(res);
            setmodal_list(!modal_list);
            setValues(initialState);
            setIsSubmit(false);
            setFormErrors({});
            fetchCity();
          } else {
            if (res.field === 1) {
              setErrCiN(true);
              setFormErrors({ CityName: "City with this name is exists!" });
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
    removeCity(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(false);
        fetchCity();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const validate = (values) => {
    const errors = {};
    if (values.CityName == "") {
      errors.CityName = "City name is required!";
      setErrCiN(true);
    }
    if (values.CityName !== "") {
      setErrCiN(false);
    }

    if (values.CountryID == "") {
      errors.CountryID = "Select country name!";
      setErrCN(true);
    }
    if (values.CountryID !== "") {
      setErrCN(false);
    }
    if (values.StateID == "") {
      errors.StateID = "Select state name!";
      setErrSN(true);
    }
    if (values.StateID !== "") {
      setErrSN(false);
    }

    return errors;
  };

  const validClassCountryName =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  // const validClassCityCode =
  //   errCC && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCityName =
    errCiN && isSubmit ? "form-control is-invalid" : "form-control";
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
    fetchCity();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCity = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/location/cities`,
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
          setCities(res.data);
          //console.log("response", res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setCities([]);
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
      name: "Country",
      selector: (row) => row.countryname,
      sortable: true,
      sortField: "countryname",
    },
    {
      name: "State",
      selector: (row) => row.statename,
      sortable: true,
      sortField: "statename",
    },
    {
      name: "City",
      selector: (row) => row.CityName,
      sortable: true,
      sortField: "CityName",
      minWidth: "180px",
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

  document.title = "City | Project Name";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Location Setup"
            title="City"
            pageTitle="Location SetUp"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="City"
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
                        data={Cities}
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
            setValues(initialState);
          }}
        >
          Add City
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating  mb-3">
              <select
                name="CountryID"
                className={validClassCountryName}
                onChange={handleChange}
              >
                <option>Please Select</option>
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

            <div className="form-floating  mb-3">
              <select
                name="StateID"
                className={validClassStateName}
                onChange={handleChange}
              >
                <option>Please Select</option>
                {states.map((s) => {
                  return (
                    <React.Fragment key={s._id}>
                      {s.isActive && CountryID === s.CountryID && (
                        <option value={s._id}>{s.StateName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                {" "}
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.StateID}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassCityName}
                placeholder="Enter City Name"
                id="CityName"
                name="CityName"
                value={CityName}
                onChange={handleChange}
              />
              <Label>
                City <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.CityName}</p>}
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
          Edit Country
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating  mb-3">
              <select
                name="CountryID"
                className={validClassCountryName}
                onChange={handleChange}
                value={CountryID}
              >
                <option>Please Select</option>
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
                Country <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.CountryID}</p>
              )}
            </div>

            <div className="form-floating  mb-3">
              <select
                name="StateID"
                className={validClassStateName}
                onChange={handleChange}
                value={StateID}
              >
                <option>Please Select</option>
                {states.map((s) => {
                  return (
                    <React.Fragment key={s._id}>
                      {s.isActive && CountryID === s.CountryID && (
                        <option value={s._id}>{s.StateName}</option>
                      )}
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                {" "}
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.StateID}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassCityName}
                placeholder="Enter City Name"
                id="CityName"
                name="CityName"
                value={CityName}
                onChange={handleChange}
              />
              <Label>
                City <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.CityName}</p>}
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

export default City;
