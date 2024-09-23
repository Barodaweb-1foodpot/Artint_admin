import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  // Alert,
} from "reactstrap";
import { Alert } from "react-bootstrap";

import logo from "../../assets/images/main-logo.png";

import { ToastContainer, toast } from "react-toastify";
//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../store/actions";

import withRouter from "../../Components/Common/withRouter";
import axios from "axios";

const initialState = {
  email: "",
  password: "",
};

const Login = (props) => {
  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  // const [showError, setShowError] = useState(false);
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { email, password } = values;
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const login = () => {
    setIsSubmit(true);
    setFormErrors(validate(values));

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/adminLogin`, values)
      .then((res) => {
        if (res.isOk) {
          console.log(" login", res);

          localStorage.setItem("AdminUser", res.data._id);
          localStorage.setItem("AdminUserEmail", res.data.email);

          window.location.replace("/admin-user");
        } else {
          toast.error("Authentication failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Authentication failed!");
      });
  };

  const [errEmail, seterrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email === "") {
      errors.email = "Email is required!";
      seterrEmail(true);
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email address!";
      seterrEmail(true);
    } else {
      seterrEmail(false);
    }
    if (values.password === "") {
      errors.password = "Password is required!";
      setErrPassword(true);
    }
    if (values.password !== "") {
      setErrPassword(false);
    }
    return errors;
  };
  const validClassEmail =
    errEmail && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPassword =
    errPassword && isSubmit ? "form-control is-invalid" : "form-control pe-5";

  document.title = " SignIn | ArtTint ";
  return (
    <React.Fragment>
      {/* <ParticlesAuth> */}
      <ToastContainer />
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50"></div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card style={{ marginTop: "35%" }}>
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="site-logo">
                        <Link to="index.html">
                          <img
                            style={{ display: "flex", alignItems: "center" }}
                            src={logo}
                            height={"70px"}
                            width={"100%"}
                            alt="ArtTint"
                          />
                        </Link>
                      </div>
                    </div>
                    <h5 className="text-primary mt-2">Welcome Back !</h5>
                    <p className="text-muted">Sign in to continue.</p>
                  </div>
                  {error && error ? (
                    <Alert color="danger"> {error} </Alert>
                  ) : null}
                  <div className="p-2 mt-4">
                    {/* <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                      action="#"
                    > */}
                    <div className="mb-3">
                      <Label htmlFor="email" className="form-label">
                        Email
                      </Label>
                      <Input
                        name="email"
                        className={validClassEmail}
                        placeholder="Enter email"
                        type="email"
                        onChange={handleChange}
                        value={email}
                      />
                      {isSubmit && (
                        <p className="text-danger">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label" htmlFor="password-input">
                        Password
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          name="password"
                          value={password}
                          type={showPassword ? "text" : "Password"}
                          className={validClassPassword}
                          placeholder="Enter Password"
                          onChange={handleChange}
                        />
                        {isSubmit && (
                          <p className="text-danger">{formErrors.password}</p>
                        )}
                        <button
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button"
                          id="password-addon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <i class="ri-eye-off-fill  align-middle"></i>
                          ) : (
                            <i className="ri-eye-fill align-middle"></i>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        color="success"
                        className="btn btn-success w-100"
                        type="submit"
                        onClick={login}
                      >
                        Sign In
                      </Button>
                    </div>
                    {/* </Form> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);
