import React, { useState, useEffect } from "react";

import UiContent from "../../Components/Common/UiContent";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
  listState,
  listCountry,
} from "../../functions/Location/Location";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  createCompanyLocation,
  getCompanyLocation,
  updateCompanyLocation,
  removeCompanyLocation,
} from "../../functions/Location/CompanyLocation";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";

const initialState = {
  CityID: "",
  CountryID: "",
  StateID: "",
  Area: "",
  Location: "",
  latitude: "",
  longitude: "",
  Address: "",
  StoreLogo: "",
  IsActive: false,
};

const CompanyLocation = () => {
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [remove_id, setRemove_id] = useState("");
  const [_id, set_Id] = useState("");

  const [query, setQuery] = useState("");

  const {
    CityID,
    CountryID,
    StateID,
    Area,
    Address,
    StoreLogo,
    longitude,
    latitude,
    Location,
    IsActive,
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
  const [newProfileImageSelected, setNewProfileImageSelected] = useState(false);
  const [image, setImage] = useState();

  const imageUpload = (e) => {
    if (e.target.files.length > 0) {
      let imageurl = URL.createObjectURL(e.target.files[0]);
      setImage(imageurl);
      setValues({ ...values, StoreLogo: e.target.files[0] });
      setNewProfileImageSelected(true);
    }
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getCompanyLocation(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          CityID: res.CityID,
          Area: res.Area,
          Location: res.Location,
          latitude: res.latitude,
          StoreLogo: res.StoreLogo,
          Address: res.Address,
          longitude: res.longitude,
          CountryID: res.CountryID,
          StateID: res.StateID,
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateCancel = () => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
    setImage("");
    setValues(initialState);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(erros).length === 0) {
    const formdata = new FormData();

    formdata.append("CityID", values.CityID);
    formdata.append("CountryID", values.CountryID);
    formdata.append("StateID", values.StateID);
    formdata.append("Area", values.Area);
    formdata.append("Address", values.Address);
    formdata.append("longitude", values.longitude);
    formdata.append("latitude", values.latitude);
    formdata.append("Location", values.Location);
    formdata.append("myFile", values.StoreLogo);
    formdata.append("IsActive", values.IsActive);

    updateCompanyLocation(_id, formdata)
      .then((res) => {
        setmodal_edit(!modal_edit);
        fetchData();
        setNewProfileImageSelected(false);
        setImage("");
        setFormErrors({});
        setValues(initialState);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const [Cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadCountries();
    loadCity();
    loadStates();
  }, []);

  const loadCity = () => {
    listCity().then((res) => {
      setCities(res);
    });
  };

  const loadCountries = () => {
    listCountry().then((res) => setCountries(res));
  };

  const loadStates = () => {
    listState().then((res) => {
      setStates(res);
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
    setFormErrors({});
    setImage("");
  };

  const handleClick = (e) => {
    e.preventDefault();
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(erros).length === 0) {
    const formdata = new FormData();

    formdata.append("CityID", values.CityID);
    formdata.append("CountryID", values.CountryID);
    formdata.append("StateID", values.StateID);
    formdata.append("Area", values.Area);
    formdata.append("Address", values.Address);
    formdata.append("longitude", values.longitude);
    formdata.append("latitude", values.latitude);
    formdata.append("Location", values.Location);
    formdata.append("myFile", values.StoreLogo);
    formdata.append("IsActive", values.IsActive);

    createCompanyLocation(formdata)
      .then((res) => {
        if (res.isOk) {
          setmodal_list(!modal_list);
          setValues(initialState);
          setIsSubmit(false);
          setFormErrors({});
          setImage("");
          setNewProfileImageSelected(false);
          fetchData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeCompanyLocation(remove_id)
      .then((res) => {
        setmodal_delete(false);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const [errCiN, setErrCiN] = useState(false);
  const [errCC, setErrCC] = useState(false);
  const [errSN, setErrSN] = useState(false);
  const [errCN, setErrCN] = useState(false);
  const [errAD, setErrAD] = useState(false);
  const [errLocation, setErrLocation] = useState(false);
  const [errLAT, setErrLAT] = useState(false);
  const [errLONG, setErrLONG] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (values.CityID == "") {
      errors.CityID = "Select City required!";
      setErrCiN(true);
    }
    if (values.CityID !== "") {
      setErrCiN(false);
    }
    if (values.CountryID == "") {
      errors.CountryID = "Select country name!";
      setErrCN(true);
    }
    if (values.CountryID !== "") {
      setErrCN(false);
    }
    if (values.Address == "") {
      errors.Address = "Address is Required!";
      setErrAD(true);
    }
    if (values.Address !== "") {
      setErrAD(false);
    }

    if (values.Location == "") {
      errors.Location = "Location is Required!";
      setErrLocation(true);
    }
    if (values.Location !== "") {
      setErrLocation(false);
    }

    if (values.latitude == "") {
      errors.latitude = "Latitude is Required!";
      setErrLAT(true);
    }
    if (values.latitude !== "") {
      setErrLAT(false);
    }

    if (values.longitude == "") {
      errors.longitude = "Longitude is Required!";
      setErrLONG(true);
    }
    if (values.longitude !== "") {
      setErrLONG(false);
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
  const validClassCityName =
    errCiN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassStateName =
    errSN && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassAdd =
    errAD && isSubmit ? "form-control is-invalid" : "form-control";
  // const validClassArea =
  //   errArea && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLocation =
    errLocation && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassLAT =
    errLAT && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLONG =
    errLONG && isSubmit ? "form-control is-invalid" : "form-control";

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
    fetchData();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchData = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list-by-params/company-locations`,
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
          setData(res.data);
          //console.log("response", res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setData([]);
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
      name: "Location Name",
      cell: (row) => row.Address,
      sortable: true,
      sortField: "Address",
      minWidth: "180px",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
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

  document.title = "Company Location | Project Name";
  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Location Setup"
            title="Company Location"
            pageTitle="Location SetUp"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Company Location"
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
                        data={data}
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
        className="modal-dialog modal-lg"
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
          Add Company Location
        </ModalHeader>
        <form>
          <ModalBody>
            <Row>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="CountryID"
                    className={validClassCountryName}
                    onChange={handleChange}
                    value={CountryID}
                    data-choices
                    data-choices-sorting="true"
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
                    Country <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.CountryID}</p>
                  )}
                </div>
              </Col>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="StateID"
                    className={validClassStateName}
                    onChange={handleChange}
                    value={StateID}
                    data-choices
                    data-choices-sorting="true"
                  >
                    <option>Select State </option>
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
                    State <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.StateID}</p>
                  )}
                </div>
              </Col>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="CityID"
                    className={validClassCityName}
                    onChange={handleChange}
                    value={CityID}
                    data-choices
                    data-choices-sorting="true"
                  >
                    <option>Select City</option>
                    {Cities.map((s) => {
                      return (
                        <React.Fragment key={s._id}>
                          {s.isActive &&
                            CountryID === s.CountryID &&
                            StateID === s.StateID && (
                              <option value={s._id}>{s.CityName}</option>
                            )}
                        </React.Fragment>
                      );
                    })}
                  </select>
                  <Label>
                    City <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.CityID}</p>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Enter area"
                    name="Area"
                    value={Area}
                    onChange={handleChange}
                  />
                  <Label>Area</Label>
                  {/* {isSubmit && <p className="text-danger">{formErrors.Area}</p>} */}
                </div>
              </Col>

              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLocation}
                    placeholder="Enter location"
                    name="Location"
                    value={Location}
                    onChange={handleChange}
                  />
                  <Label>
                    Location <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.Location}</p>
                  )}
                </div>
              </Col>
            </Row>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassAdd}
                placeholder="Enter address"
                name="Address"
                value={Address}
                onChange={handleChange}
              />
              <Label>
                Address <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Address}</p>}
            </div>

            <Row>
              <Col lg={6}>
                {" "}
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLAT}
                    placeholder="Enter latitude"
                    name="latitude"
                    value={latitude}
                    onChange={handleChange}
                  />
                  <Label>
                    Latitude <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.latitude}</p>
                  )}
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLONG}
                    placeholder="Enter longitude"
                    name="longitude"
                    value={longitude}
                    onChange={handleChange}
                  />
                  <Label>
                    Longitude <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.longitude}</p>
                  )}
                </div>
              </Col>
            </Row>

            <Col lg={6}>
              <label>
                Store Logo <span className="text-danger">*</span>
              </label>

              <input
                type="file"
                name="StoreLogo"
                // className={validClassLogo}
                // accept="images/*"
                accept=".jpg, .jpeg, .png"
                onChange={imageUpload}
              />
              {isSubmit && (
                <p className="text-danger">{formErrors.StoreLogo}</p>
              )}
              {newProfileImageSelected || image ? (
                <img src={image} alt="Profile" width="200" height="160" />
              ) : null}
            </Col>

            <div className=" mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
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
        className="modal-dialog modal-lg"
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
          Edit Company Location
        </ModalHeader>
        <form>
          <ModalBody>
            <Row>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="CountryID"
                    className={validClassCountryName}
                    onChange={handleChange}
                    value={CountryID}
                    data-choices
                    data-choices-sorting="true"
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
                    Country <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.CountryID}</p>
                  )}
                </div>
              </Col>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="StateID"
                    className={validClassStateName}
                    onChange={handleChange}
                    value={StateID}
                    data-choices
                    data-choices-sorting="true"
                  >
                    <option>Select State</option>
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
                  {isSubmit && (
                    <p className="text-danger">{formErrors.StateID}</p>
                  )}
                </div>
              </Col>
              <Col lg={4}>
                <div className="form-floating  mb-3">
                  <select
                    name="CityID"
                    className={validClassCityName}
                    // className="form-control"
                    onChange={handleChange}
                    value={CityID}
                    data-choices
                    data-choices-sorting="true"
                  >
                    <option>Select City</option>
                    {Cities.map((s) => {
                      return (
                        <React.Fragment key={s._id}>
                          {s.isActive &&
                            CountryID === s.CountryID &&
                            StateID === s.StateID && (
                              <option value={s._id}>{s.CityName}</option>
                            )}
                        </React.Fragment>
                      );
                    })}
                  </select>
                  <Label>
                    {" "}
                    City <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.CityID}</p>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Enter area"
                    name="Area"
                    value={Area}
                    onChange={handleChange}
                  />
                  <Label>Area</Label>
                  {/* {isSubmit && <p className="text-danger">{formErrors.Area}</p>} */}
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLocation}
                    // className="form-control"
                    placeholder="Enter location"
                    name="Location"
                    value={Location}
                    onChange={handleChange}
                  />
                  <Label>
                    Location <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.Location}</p>
                  )}
                </div>
              </Col>
            </Row>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassAdd}
                // className="form-control"
                placeholder="Enter address"
                name="Address"
                value={Address}
                onChange={handleChange}
              />
              <Label>
                Address <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.CityCode}</p>}
            </div>

            <Row>
              <Col lg={6}>
                {" "}
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLAT}
                    // className="form-control"
                    placeholder="Enter latitude"
                    name="latitude"
                    value={latitude}
                    onChange={handleChange}
                  />
                  <Label>
                    Latitude <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.latitude}</p>
                  )}
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-floating mb-3">
                  <Input
                    type="text"
                    className={validClassLONG}
                    // className="form-control"
                    placeholder="Enter longitude"
                    name="longitude"
                    value={longitude}
                    onChange={handleChange}
                  />
                  <Label>
                    Longitude <span className="text-danger">*</span>
                  </Label>
                  {isSubmit && (
                    <p className="text-danger">{formErrors.longitude}</p>
                  )}
                </div>
              </Col>
            </Row>

            <Col lg={6}>
              <label>
                Store Logo <span className="text-danger">*</span>
              </label>
              <input
                key={"StoreLogo_" + _id}
                type="file"
                name="StoreLogo"
                // className={validClassLogo}
                // accept="images/*"
                accept=".jpg, .jpeg, .png"
                onChange={imageUpload}
              />
              {isSubmit && (
                <p className="text-danger">{formErrors.StoreLogo}</p>
              )}

              {values.StoreLogo || image ? (
                <img
                  // key={photoAdd}
                  src={
                    newProfileImageSelected
                      ? image
                      : `${process.env.REACT_APP_API_URL_COFFEE}/${values.StoreLogo}`
                  }
                  width="180"
                  height="180"
                />
              ) : null}
            </Col>

            <div className=" mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
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

export default CompanyLocation;
