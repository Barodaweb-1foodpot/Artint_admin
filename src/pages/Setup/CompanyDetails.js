import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Input,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import UiContent from "../../Components/Common/UiContent";
import DataTable from "react-data-table-component";

import myImage from "../../assets/images/logo/Image_not_available.png";

import {
  createCompanyDetails,
  listCompanynDetails,
  updateDetails,
  getDetail,
  CompanyFileUpload,
} from "../../functions/Setup/CompanyDetails";
import { listState, listCountry } from "../../functions/Location/Location";

const initialState = {
  CompanyName: "",
  ContactPersonName: "",
  GSTNo: "",
  Website2: "",
  Website1: "",
  ContactNo_Office: "",
  ContactNo_Sales: "",
  ContactNo_Support: "",
  EmailID_Office: "",
  EmailID_Sales: "",
  EmailID_Support: "",
  CountryID: "",
  StateID: "",
  City: "",
  Address: "",
  Pincode: "",
  Favicon: "",
  Icon: "",
  Logo: "",
  DigitalSignature: "",
  IsActive: true,
};

const CompanyDetails = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  //validation
  const [errCN, setErrCN] = useState(false);
  const [errCPN, setErrCPN] = useState(false);
  const [errCountry, setErrCountry] = useState(false);
  const [errState, setErrState] = useState(false);
  const [errCity, setErrCity] = useState(false);
  const [errPincode, setErrPincode] = useState(false);
  const [errAddress, setErrAddress] = useState(false);
  const [errCNOffice, setErrCNOffice] = useState(false);
  const [errCNSupport, setErrCNSupport] = useState(false);
  const [errCNSales, setErrCNSales] = useState(false);
  const [errEmailOffice, setErrEmailOffice] = useState(false);
  const [errEmailSales, setErrEmailSales] = useState(false);
  const [errEmailSupport, setErrEmailSupport] = useState(false);
  const [errGST, setErrGST] = useState(false);
  const [errWeb1, setErrWeb1] = useState(false);

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [values, setValues] = useState(initialState);
  const {
    CompanyName,
    ContactPersonName,
    GSTNo,
    Website2,
    Website1,
    ContactNo_Office,
    ContactNo_Sales,
    ContactNo_Support,
    EmailID_Office,
    EmailID_Sales,
    EmailID_Support,
    CountryID,
    StateID,
    Address,
    Pincode,
    City,
    Favicon,
    Icon,
    Logo,
    DigitalSignature,
    IsActive,
  } = values;

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [details, setDetails] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setIsSubmit(false);
    setValues([]);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setUpdateForm(true);
    setIsSubmit(false);
    set_Id(_id);
    getDetail(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          CompanyName: res.CompanyName,
          ContactPersonName: res.ContactPersonName,
          CountryID: res.CountryID,
          StateID: res.StateID,
          City: res.City,
          Address: res.Address,
          Pincode: res.Pincode,
          ContactNo_Office: res.ContactNo_Office,
          ContactNo_Sales: res.ContactNo_Sales,
          ContactNo_Support: res.ContactNo_Support,
          EmailID_Office: res.EmailID_Office,
          EmailID_Sales: res.EmailID_Sales,
          EmailID_Support: res.EmailID_Support,
          Website1: res.Website1,
          Website2: res.Website2,
          Logo: res.Logo,
          Icon: res.Icon,
          Favicon: res.Favicon,
          DigitalSignature: res.DigitalSignature,
          GSTNo: res.GSTNo,
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadDetails();
    loadCountries();
    loadStates();
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const loadDetails = () => {
    listCompanynDetails().then((res) => {
      setDetails(res);
      console.log(details);
    });
  };

  const loadCountries = () => {
    listCountry().then((res) => setCountries(res));
  };

  const loadStates = () => {
    listState().then((res) => {
      setStates(res);
      console.log(res);
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(values));
    setIsSubmit(true);

    createCompanyDetails(values)
      .then((res) => {
        setValues(initialState);
        setShowForm(false);
        loadDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    // debugger;
    e.preventDefault();
    let errors = validate(values);
    setFormErrors(errors);
    console.log("errors", errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      updateDetails(_id, values)
        .then((res) => {
          setUpdateForm(false);
          loadDetails();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setShowForm(false);
    setUpdateForm(false);
    setIsSubmit(false);
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const FaviconUploadAndResize = (e) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formdata = new FormData();
        formdata.append("file", files[i]);
        formdata.append("filefor", "Favicon");
        formdata.append("_id", _id);
        CompanyFileUpload(formdata).then(
          (res) => {
            setValues({ ...values, Favicon: res.url });
          },
          (err) => {
            // debugger;
          }
        );
        // Resizer.imageFileResizer(
        //   files[i],
        //   300,
        //   300,
        //   "JPEG",
        //   100,
        //   0,
        //   (uri) => {
        //     // console.log(uri);
        //     setLoading(true);
        //     axios
        //       .post(process.env.REACT_APP_API_URL + "/api/uploadimages", {
        //         image: uri,
        //       })
        //       .then((res) => {
        //         console.log("favicon upload", res);
        //         setValues({ ...values, Favicon: res.url });
        //         setLoading(false);
        //       })
        //       .catch((err) => {
        //         console.log("cloudinary upload err", err);
        //       });
        //   },
        //   "base64"
        // );
      }
    }
  };

  const LogoUploadAndResize = (e) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formdata = new FormData();
        formdata.append("file", files[i]);
        formdata.append("filefor", "Logo");
        formdata.append("_id", _id);
        CompanyFileUpload(formdata).then(
          (res) => {
            setValues({ ...values, Logo: res.url });
            // debugger;
          },
          (err) => {
            // debugger;
          }
        );

        // Resizer.imageFileResizer(
        //   files[i],
        //   300,
        //   300,
        //   "JPEG",
        //   100,
        //   0,
        //   (uri) => {
        //     // console.log(uri);
        //     axios
        //       .post(process.env.REACT_APP_API_URL + "/api/uploadimages", {
        //         image: uri,
        //       })
        //       .then((res) => {
        //         console.log("logo upload", res);
        //         setValues({ ...values, Logo: res.url });
        //       })
        //       .catch((err) => {
        //         console.log("cloudinary upload err", err);
        //       });
        //   },
        //   "base64"
        // );
      }
    }
  };

  const IconUploadAndResize = (e) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formdata = new FormData();
        formdata.append("file", files[i]);
        formdata.append("filefor", "Icon");
        formdata.append("_id", _id);
        CompanyFileUpload(formdata).then(
          (res) => {
            setValues({ ...values, Icon: res.url });
            // debugger;
          },
          (err) => {
            // debugger;
          }
        );

        // Resizer.imageFileResizer(
        //   files[i],
        //   300,
        //   300,
        //   "JPEG",
        //   100,
        //   0,
        //   (uri) => {
        //     // console.log(uri);
        //     axios
        //       .post(process.env.REACT_APP_API_URL + "/api/uploadimages", {
        //         image: uri,
        //       })
        //       .then((res) => {
        //         console.log("icon upload", res);
        //         setValues({ ...values, Icon: res.url });
        //       })
        //       .catch((err) => {
        //         console.log("cloudinary upload err", err);
        //       });
        //   },
        //   "base64"
        // );
      }
    }
  };

  const DSUploadAndResize = (e) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formdata = new FormData();
        formdata.append("file", files[i]);
        formdata.append("filefor", "DigitalSignature");
        formdata.append("_id", _id);
        CompanyFileUpload(formdata).then(
          (res) => {
            setValues({ ...values, DigitalSignature: res.url });
            // debugger;
          },
          (err) => {
            // debugger;
          }
        );

        // Resizer.imageFileResizer(
        //   files[i],
        //   300,
        //   300,
        //   "JPEG",
        //   100,
        //   0,
        //   (uri) => {
        //     // console.log(uri);
        //     axios
        //       .post(process.env.REACT_APP_API_URL + "/api/uploadimages", {
        //         image: uri,
        //       })
        //       .then((res) => {
        //         console.log("DS upload", res);
        //         setValues({ ...values, DigitalSignature: res.url });
        //       })
        //       .catch((err) => {
        //         console.log("cloudinary upload err", err);
        //       });
        //   },
        //   "base64"
        // );
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    //const phone = /^\d{10}$/;
    const phone =
      /^(?!.*(\d)(-?\1){4})(?!0123456789|1234567890|2345678901|3456789012|4567890123|5678901234|6789012345|7890123456|8901234567|9012345678)\d{10}$/;
    if (!values.CompanyName) {
      errors.CompanyName = "Company name is required!";
      setErrCN(true);
    } else {
      setErrCN(false);
    }
    if (!values.ContactPersonName) {
      errors.ContactPersonName = "Company person name is required!";
      setErrCPN(true);
    } else {
      setErrCPN(false);
    }
    if (!values.CountryID) {
      errors.CountryID = "Country name is required!";
      setErrCountry(true);
    } else {
      setErrCountry(false);
    }
    if (!values.StateID) {
      errors.StateID = "State name is required!";
      setErrState(true);
    } else {
      setErrState(false);
    }
    if (!values.City) {
      errors.City = "City name is required!";
      setErrCity(true);
    } else {
      setErrCity(false);
    }
    if (!values.Pincode) {
      errors.Pincode = "Pincode is required!";
      setErrPincode(true);
    } else {
      setErrPincode(false);
    }
    if (!values.Address) {
      errors.Address = "Address is required!";
      setErrAddress(true);
    } else {
      setErrAddress(false);
    }
    if (!values.EmailID_Office) {
      errors.EmailID_Office = "Email is required!";
      setErrEmailOffice(true);
    } else if (!regex.test(values.EmailID_Office)) {
      errors.EmailID_Office = "This is not a valid email format!";
      setErrEmailOffice(true);
    } else {
      setErrEmailOffice(false);
    }
    // if (!values.EmailID_Sales) {
    //   errors.EmailID_Sales = "Email is required!";
    //   setErrEmailSales(true);
    // } else if (!regex.test(values.EmailID_Sales)) {
    //   errors.EmailID_Sales = "This is not a valid email format!";
    //   setErrEmailSales(true);
    // } else {
    //   setErrEmailSales(false);
    // }
    // if (!values.EmailID_Support) {
    //   errors.EmailID_Support = "Email is required!";
    //   setErrEmailSupport(true);
    // } else if (!regex.test(values.EmailID_Support)) {
    //   errors.EmailID_Support = "This is not a valid email format!";
    //   setErrEmailSupport(true);
    // } else {
    //   setErrEmailSupport(false);
    // }
    if (!values.ContactNo_Office) {
      errors.ContactNo_Office = "Contact No. is required";
      setErrCNOffice(true);
    } else if (!phone.test(values.ContactNo_Office)) {
      errors.ContactNo_Office = "This is not a valid Contact Number";
      setErrCNOffice(true);
    } else {
      setErrCNOffice(false);
    }
    if (values.ContactNo_Sales) {
      // errors.ContactNo_Sales = "Contact No. is required";
      // setErrCNSales(true);
      if (!phone.test(values.ContactNo_Sales)) {
        errors.ContactNo_Sales = "This is not a valid Contact Number";
        setErrCNSales(true);
      } else {
        setErrCNSales(false);
      }
    }

    if (values.ContactNo_Support) {
      // errors.ContactNo_Support = "Contact No. is required";
      // setErrCNSupport(true);

      if (!phone.test(values.ContactNo_Support)) {
        errors.ContactNo_Support = "This is not a valid Contact Number";
        setErrCNSupport(true);
      } else {
        setErrCNSupport(false);
      }
    }

    // if (!values.GSTNo) {
    //   errors.GSTNo = "GST No is required!";
    //   setErrGST(true);
    // } else {
    //   setErrGST(false);
    // }
    if (!values.Website1) {
      errors.Website1 = "website is required!";
      setErrWeb1(true);
    }
    // if (!values.Favicon) {
    //   errors.Favicon = "Favicon is required!";
    // }
    // if (!values.Icon) {
    //   errors.Icon = "Icon is required!";
    // }
    // if (!values.Logo) {
    //   errors.Logo = "Logo is required!";
    // }
    // if (!values.DigitalSignature) {
    //   errors.DigitalSignature = "Digital Signature is required!";
    // }

    return errors;
  };

  const validClassCN =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCPN =
    errCPN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCountry =
    errCountry && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassState =
    errState && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCity =
    errCity && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAddress =
    errAddress && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPincode =
    errPincode && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCNOffice =
    errCNOffice && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCNSales =
    errCNSales && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCNSupport =
    errCNSupport && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailOffice =
    errEmailOffice && isSubmit ? "form-control is-invalid" : "form-control";
  // const validClassEmailSales =
  //   errEmailSales && isSubmit ? "form-control is-invalid" : "form-control";
  // const validClassEmailSupport =
  //   errEmailSupport && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassWeb1 =
    errWeb1 && isSubmit ? "form-control is-invalid" : "form-control";
  // const validClassGST =
  //   errGST && isSubmit ? "form-control is-invalid" : "form-control";

  const columns = [
    {
      name: "Company Name",
      selector: (row) => row.CompanyName,
      minWidth: "150px",
    },
    {
      name: "Contact Person Name",
      selector: (row) => row.ContactPersonName,
      minWidth: "180px",
    },
    {
      name: "Office Contact No.",
      selector: (row) => row.ContactNo_Office,
      minWidth: "150px",
    },
    {
      name: "Office Email",
      selector: (row) => row.EmailID_Office,
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
      },
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
  document.title = "Company Details | ArtTint";

  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle=" Setup"
            title="Company Details"
            pageTitle=" Setup"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm">
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Company Details
                      </h2>
                    </Col>

                    <Col className="col-sm-auto">
                      <div className="d-flex justify-content-sm-end">
                        <div>
                          <div
                            style={{
                              display: showForm || updateForm ? "" : "none",
                            }}
                          >
                            <Row>
                              <Col lg={12}>
                                <div className="text-end">
                                  <button
                                    className="btn bg-success text-light mb-3 "
                                    onClick={() => {
                                      setValues(initialState);
                                      setShowForm(false);
                                      setUpdateForm(false);
                                    }}
                                  >
                                    <i class="ri-list-check align-bottom me-1"></i>{" "}
                                    List
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                {/* update form */}
                <div
                  style={{
                    display: !showForm && updateForm ? "block" : "none",
                  }}
                >
                  <Row>
                    <Col lg={3}>
                      <Card>
                        <CardBody>
                          <div className="form-floating mb-3">
                            <input
                              type="file"
                              name="Favicon"
                              className="form-control"
                              accept="images/*"
                              onChange={FaviconUploadAndResize}
                            />
                            <label>Favicon</label>
                          </div>
                          {values.Favicon && (
                            <div className="card col-3">
                              <img
                                key={values.Favicon}
                                alt="fav-icon"
                                src={
                                  process.env.REACT_APP_API_URL +
                                  "/" +
                                  values.Favicon
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = myImage;
                                }}
                              />
                            </div>
                          )}

                          {Favicon == "" && <h6>No Image</h6>}

                          <div className=" form-floating mb-3">
                            <input
                              type="file"
                              name="Icon"
                              className="form-control"
                              accept="images/*"
                              onChange={IconUploadAndResize}
                            />
                            <label>Menu Icon</label>
                            {isSubmit && (
                              <p className="text-danger">{formErrors.Icon}</p>
                            )}
                          </div>
                          {values.Icon && (
                            <div className="card col-3">
                              <img
                                key={values.Icon}
                                alt="menu-icon"
                                src={
                                  process.env.REACT_APP_API_URL +
                                  "/" +
                                  values.Icon
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = myImage;
                                }}
                              />
                            </div>
                          )}
                          {Icon == "" && <h6>No Image</h6>}
                          <div className="form-floating mb-3">
                            <input
                              type="file"
                              name="Logo"
                              className="form-control"
                              accept="images/*"
                              onChange={LogoUploadAndResize}
                            />
                            <label>Logo</label>
                          </div>
                          {values.Logo && (
                            <div className="card col-3">
                              <img
                                key={values.Logo}
                                alt="logo-img"
                                src={
                                  process.env.REACT_APP_API_URL +
                                  "/" +
                                  values.Logo
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = myImage;
                                }}
                              />
                            </div>
                          )}
                          {Logo == "" && <h6>No Image</h6>}
                          <div className="form-floating mb-3">
                            <input
                              type="file"
                              name="DigitalSignature"
                              className="form-control"
                              accept="images/*"
                              onChange={DSUploadAndResize}
                            />
                            <label>Digital Signature</label>
                          </div>
                          {values.DigitalSignature && (
                            <div className="card col-3">
                              <img
                                key={values.DigitalSignature}
                                src={
                                  process.env.REACT_APP_API_URL +
                                  "/" +
                                  values.DigitalSignature
                                }
                                alt="digital-signature-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = myImage;
                                }}
                              />
                            </div>
                          )}
                          {DigitalSignature == "" && <h6>No Image</h6>}
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={9}>
                      <Card>
                        <CardBody>
                          <div className="live-preview">
                            <Form>
                              <Row>
                                <Col lg={6}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validClassCN}
                                        placeholder="Enter company name"
                                        name="CompanyName"
                                        value={CompanyName}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        Company Name
                                        <span className="text-danger">
                                          *
                                        </span>{" "}
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.CompanyName}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>
                                <Col lg={6}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCPN}
                                      placeholder="Enter contact person name"
                                      name="ContactPersonName"
                                      value={ContactPersonName}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Contact Person Name
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.ContactPersonName}
                                      </p>
                                    )}
                                  </div>
                                </Col>

                                <Col md={3}>
                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClassCountry}
                                      name="CountryID"
                                      value={CountryID}
                                      data-choices
                                      data-choices-sorting="true"
                                      onChange={handleChange}
                                    >
                                      <option>Select Country</option>

                                      {countries.map((c) => {
                                        return (
                                          <React.Fragment key={c._id}>
                                            {c.isActive && (
                                              <option value={c._id}>
                                                {c.CountryName}
                                              </option>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </select>
                                    <Label>
                                      Country
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.CountryID}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="form-floating mb-3">
                                    <select
                                      id="ForminputState"
                                      className={validClassState}
                                      value={StateID}
                                      name="StateID"
                                      data-choices
                                      data-choices-sorting="true"
                                      onChange={handleChange}
                                    >
                                      <option>Select State</option>
                                      {states.map((s) => {
                                        return (
                                          <React.Fragment key={s._id}>
                                            {s.isActive &&
                                              CountryID === s.CountryID && (
                                                <option value={s._id}>
                                                  {s.StateName}
                                                </option>
                                              )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </select>
                                    <Label>
                                      State
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.StateID}
                                      </p>
                                    )}
                                  </div>
                                </Col>

                                <Col md={3}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCity}
                                      placeholder="Enter city name"
                                      name="City"
                                      value={City}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      City<span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.City}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="number"
                                      className={validClassPincode}
                                      placeholder="Enter pincode"
                                      name="Pincode"
                                      value={Pincode}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Pincode
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.Pincode}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={12}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="textarea"
                                      className={validClassAddress}
                                      placeholder="Enter address"
                                      style={{ height: "100px" }}
                                      name="Address"
                                      value={Address}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Address
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.Address}
                                      </p>
                                    )}
                                  </div>
                                </Col>

                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="tel"
                                      className={validClassCNOffice}
                                      placeholder="Enter contact no. of office"
                                      name="ContactNo_Office"
                                      value={ContactNo_Office}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Office ContactNo
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.ContactNo_Office}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="tel"
                                      className={validClassCNSales}
                                      placeholder="Enter contact no. of sales"
                                      name="ContactNo_Sales"
                                      value={ContactNo_Sales}
                                      onChange={handleChange}
                                    />
                                    <Label>Sales ContactNo</Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.ContactNo_Sales}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="tel"
                                      className={validClassCNSupport}
                                      placeholder="Enter contact no. of support"
                                      name="ContactNo_Support"
                                      value={ContactNo_Support}
                                      onChange={handleChange}
                                    />
                                    <Label>Support ContactNo</Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.ContactNo_Support}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="email"
                                      className={validClassEmailOffice}
                                      placeholder="example@gmail.com"
                                      id="emailidInput"
                                      name="EmailID_Office"
                                      value={EmailID_Office}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Office EmailID
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.EmailID_Office}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="email"
                                      className="form-control"
                                      placeholder="example@gmail.com"
                                      id="emailidInput"
                                      name="EmailID_Sales"
                                      value={EmailID_Sales}
                                      onChange={handleChange}
                                    />
                                    <Label>Sales EmailID</Label>
                                    {/* {isSubmit && (
                                <p className="text-danger">
                                  {formErrors.EmailID_Sales}
                                </p>
                              )} */}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="email"
                                      className="form-control"
                                      placeholder="example@gmail.com"
                                      id="emailidInput"
                                      name="EmailID_Support"
                                      value={EmailID_Support}
                                      onChange={handleChange}
                                    />
                                    <Label>Support EmailID</Label>
                                    {/* {isSubmit && (
                                <p className="text-danger">
                                  {formErrors.EmailID_Support}
                                </p>
                              )} */}
                                  </div>
                                </Col>

                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassWeb1}
                                      placeholder="Enter website1"
                                      name="Website1"
                                      value={Website1}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Website1
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.Website1}
                                      </p>
                                    )}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter website2"
                                      name="Website2"
                                      value={Website2}
                                      onChange={handleChange}
                                    />
                                    <Label>Website2</Label>
                                    {/* {isSubmit && (
                                <p className="text-danger">
                                  {formErrors.Website2}
                                </p>
                              )} */}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter GST No."
                                      name="GSTNo"
                                      value={GSTNo}
                                      onChange={handleChange}
                                    />
                                    <Label>GST No.</Label>
                                  </div>
                                </Col>

                                <Row>
                                  <Col lg={6}>
                                    <div className="mb-3">
                                      <Input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="IsActive"
                                        value={IsActive}
                                        checked={IsActive}
                                        onChange={handleCheck}
                                      />
                                      <Label className="form-check-label ms-1">
                                        &nbsp;Is Active
                                      </Label>
                                    </div>
                                  </Col>
                                  <Col lg={6}>
                                    <div className=" text-end">
                                      <button
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn btn-outline-danger m-1"
                                        onClick={handleUpdateCancel}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </Row>
                            </Form>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* list  */}
                <div
                  style={{ display: showForm || updateForm ? "none" : "block" }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        {/* <Table columns={col} dataSource={details}></Table> */}
                        <DataTable columns={columns} data={details} />
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CompanyDetails;
