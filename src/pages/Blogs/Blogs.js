import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
  createBlogs,
  getBlogs,
  removeBlogs,
  updateBlogs,
  uploadImage,
} from "../../functions/Blogs/Blogs";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";

const Blogs = () => {
  const [blogTitle, setblogTitle] = useState("");
  const [blogDesc, setblogDesc] = useState("");
  const [blogImage, setblogImage] = useState("");
  const [blogThumnailDesc, setblogThumnailDesc] = useState("");
  const [views, setViews] = useState(0);

  const [loadingOption, setLoadingOption] = useState(false);

  const [likes, setlikes] = useState([]);
  const [comments, setcomments] = useState([]);
  const [userId, setuserId] = useState(localStorage.getItem("AdminUser"));
  const [IsActive, setIsActive] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file
            .then((file) => {
              body.append("uploadImg", file);
              uploadImage(body)
                .then((res) => {
                  console.log("res", res.url);
                  resolve({
                    default: `${process.env.REACT_APP_API_URL}/uploads/BlogCKImages/${res.url}`,
                  });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => reject(err));
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setIsSubmit(false);
    setUpdateForm(true);

    setIsSubmit(false);
    set_Id(_id);
    getBlogs(_id)
      .then((res) => {
        setblogTitle(res.blogTitle);
        setblogDesc(res.blogDesc);
        setblogImage(res.blogImage);
        setlikes(res.likes);
        setcomments(res.comments);
        setblogThumnailDesc(res.blogThumnailDesc);
        setViews(res.views);
        setuserId(res.userId);
        setIsActive(res.IsActive);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    let errors = validate(blogTitle, blogDesc, blogImage);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      setLoadingOption(true);
      const formdata = new FormData();

      formdata.append("myFile", blogImage);
      formdata.append("blogTitle", blogTitle);
      formdata.append("blogDesc", blogDesc);
      formdata.append("IsActive", IsActive);
      formdata.append("comments", comments);
      formdata.append("views", views);
      formdata.append("blogThumnailDesc", blogThumnailDesc);
      formdata.append("likes", likes);
      formdata.append("userId", localStorage.getItem("RCCoffeeAdmin"));

      createBlogs(formdata)
        .then((res) => {
          console.log(res);
          // setmodal_list(!modal_list);
          setShowForm(false);
          setLoadingOption(false);
          // setValues(initialState);
          setblogDesc("");
          setblogTitle("");
          setlikes([]);
          setcomments([]);
          setuserId("");
          setIsActive(false);
          setblogImage("");
          setblogThumnailDesc("");
          setViews(0);
          setIsSubmit(false);
          setCheckImagePhoto(false);
          setPhotoAdd("");
          setFormErrors({});
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeBlogs(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(blogTitle, blogDesc, blogImage);
    setFormErrors(erros);
    setIsSubmit(true);
    const likesString = JSON.stringify(likes);
    const commentString = JSON.stringify(comments);

    if (Object.keys(erros).length === 0) {
      setLoadingOption(true);
      const formdata = new FormData();

      formdata.append("myFile", blogImage);
      formdata.append("blogTitle", blogTitle);
      formdata.append("blogDesc", blogDesc);
      formdata.append("IsActive", IsActive);
      formdata.append("comments", commentString);
      formdata.append("views", views);
      formdata.append("blogThumnailDesc", blogThumnailDesc);
      formdata.append("likes", likesString);
      formdata.append("userId", userId);

      updateBlogs(_id, formdata)
        .then((res) => {
          // setmodal_edit(!modal_edit);
          setPhotoAdd("");
          setUpdateForm(false);
          setLoadingOption(false);

          setCheckImagePhoto(false);
          // setValues(initialState);
          setblogDesc("");
          setblogTitle("");
          setlikes([]);
          setcomments([]);
          setuserId("");
          setIsActive(false);
          setblogThumnailDesc("");
          setViews(0);
          setblogImage("");
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [errBT, setErrBT] = useState(false);
  const [errBD, setErrBD] = useState(false);
  const [errBTD, setErrBTD] = useState(false);
  const [errBI, setErrBI] = useState(false);

  const validate = (blogDesc, blogTitle, blogImage) => {
    const errors = {};

    if (blogTitle === "") {
      errors.blogTitle = "Blog Title is required!";
      setErrBT(true);
    }
    if (blogTitle !== "") {
      setErrBT(false);
    }

    if (blogDesc === "") {
      errors.blogDesc = "Blog Description is required!";
      setErrBD(true);
    }
    if (blogDesc !== "") {
      setErrBD(false);
    }
    if (blogThumnailDesc === "") {
      errors.blogThumnailDesc = "Blog Thumbnail Description is required!";
      setErrBTD(true);
    }
    if (blogThumnailDesc !== "") {
      setErrBTD(false);
    }

    if (blogImage === "") {
      errors.blogImage = "Blog Image is required!";
      setErrBI(true);
    }
    if (blogImage !== "") {
      setErrBI(false);
    }

    return errors;
  };

  const validClassBT =
    errBT && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassBD =
    errBD && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBTD =
    errBTD && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassBI =
    errBI && isSubmit ? "form-control is-invalid" : "form-control";

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
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/blogs`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          IsActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setBlogs(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setBlogs([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const [photoAdd, setPhotoAdd] = useState();
  const [checkImagePhoto, setCheckImagePhoto] = useState(false);

  const PhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);
      console.log("img", e.target.files[0]);

      setPhotoAdd(imageurl);
      // setValues({ ...values, blogImage: e.target.files[0] });
      setblogImage(e.target.files[0]);
      setCheckImagePhoto(true);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const handleAddCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setPhotoAdd("");
    setCheckImagePhoto(false);
    setShowForm(false);
    setUpdateForm(false);
    setblogThumnailDesc("");
    setViews(0);
    // setValues(initialState);
    setblogDesc("");
    setblogTitle("");
    setlikes([]);
    setcomments([]);
    setuserId("");
    setIsActive(false);
    setblogImage("");
  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setPhotoAdd("");
    setUpdateForm(false);
    setShowForm(false);
    setblogThumnailDesc("");
    setViews(0);
    setCheckImagePhoto(false);
    // setValues(initialState);
    setblogDesc("");
    setblogTitle("");
    setlikes([]);
    setcomments([]);
    setuserId("");
    setIsActive(false);
    setblogImage("");
  };

  const col = [
    {
      name: "Title",
      cell: (row) => row.blogTitle,
      sortable: true,
      sortField: "blogTitle",
      minWidth: "150px",
    },

    // {
    //   name: " Written By",
    //   cell: (row) => row.adminuser,
    //   sortable: true,
    //   sortField: "adminuser",
    //   minWidth: "150px",
    // },

    {
      name: "Date & Time",
      selector: (row) => {
        const dateObject = new Date(row.createdAt);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format(
              "DD-MM-YYYY hh:mm A"
            )}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "createdAt",
      minWidth: "150px",
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

  document.title = "Blogs | ArtTint";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="Blogs" title="Blogs" pageTitle="Blogs" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">Blogs</h2>
                    </Col>
                    <Col lg={4} md={6} sm={6}>
                      <div
                        style={{
                          display: showForm || updateForm ? "none" : "",
                        }}
                      >
                        <div className="text-end mt-1">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            name="filter"
                            value={filter}
                            defaultChecked={true}
                            onChange={handleFilter}
                          />
                          <Label className="form-check-label ms-2">
                            Active
                          </Label>
                        </div>
                      </div>
                    </Col>
                    <Col className="col-sm-auto" lg={4} md={12} sm={12}>
                      <div className="d-flex justify-content-sm-end">
                        {/* add btn */}
                        <div
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <Row>
                            <Col lg={12}>
                              <div className="d-flex justify-content-sm-end">
                                <div>
                                  <Button
                                    color="success"
                                    className="add-btn me-1"
                                    onClick={() => {
                                      setShowForm(!showForm);
                                      // setValues(initialState);
                                      setblogDesc("");
                                      setblogTitle("");
                                      setlikes([]);
                                      setcomments([]);
                                      setuserId("");
                                      setIsActive(false);
                                      setblogImage("");
                                      // setFileId(Math.random() * 100000);
                                    }}
                                    // onClick={() => tog_list()}
                                    // id="create-btn"
                                  >
                                    <i className="ri-add-line align-bottom me-1"></i>
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* update list btn */}

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
                                    // setValues(initialState);
                                    setblogDesc("");
                                    setblogTitle("");
                                    setlikes([]);
                                    setcomments([]);
                                    setuserId("");
                                    setIsActive(false);
                                    setblogImage("");
                                    setShowForm(false);
                                    setUpdateForm(false);
                                    // setFileId(Math.random() * 100000);
                                  }}
                                >
                                  <i class="ri-list-check align-bottom me-1"></i>{" "}
                                  List
                                </button>
                              </div>
                            </Col>
                          </Row>
                          {/* </div> */}
                        </div>

                        {/* search */}
                        <div
                          className="search-box ms-2"
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <input
                            className="form-control search"
                            placeholder="Search..."
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <i className="ri-search-line search-icon "></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                {/* ADD FORM  */}
                <div
                  style={{
                    display: showForm && !updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col xxl={12}>
                        <Card className="">
                          {/* <PreviewCardHeader title="Billing Product Form" /> */}
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <Input
                                        key={"blogTitle_" + _id}
                                        type="text"
                                        className={validClassBT}
                                        placeholder="Enter blog title"
                                        required
                                        name="blogTitle"
                                        value={blogTitle}
                                        onChange={(e) => {
                                          setblogTitle(e.target.value);
                                        }}
                                      />
                                      <Label>
                                        Blog Title{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.blogTitle}
                                        </p>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="textarea"
                                        className={validClassBTD}
                                        style={{ height: "100px" }}
                                        placeholder="Remarks..."
                                        name="blogThumnailDesc"
                                        value={blogThumnailDesc}
                                        onChange={(e) => {
                                          setblogThumnailDesc(e.target.value);
                                        }}
                                      />
                                      <Label className="form-label">
                                        Blog Thumbnail Description
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.blogThumnailDesc}
                                        </p>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg={12}>
                                    <Card>
                                      <Label>
                                        Blog Description
                                        <span className="text-danger">*</span>
                                      </Label>
                                      <CardBody>
                                        {/* <Form method="post"> */}
                                        <CKEditor
                                          key={"blogDesc_" + _id}
                                          editor={ClassicEditor}
                                          data={blogDesc}
                                          config={{
                                            extraPlugins: [uploadPlugin],
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();

                                            setblogDesc(data);
                                            console.log(blogDesc);
                                          }}
                                        />
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.blogDesc}
                                          </p>
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Col>

                                  <Col lg={6}>
                                    <label>
                                      Blog Image{" "}
                                      <span className="text-danger">*</span>
                                    </label>

                                    <Input
                                      key={"blogImage_" + _id}
                                      type="file"
                                      name="blogImage"
                                      className={validClassBI}
                                      // accept="images/*"
                                      accept=".jpg, .jpeg, .png"
                                      onChange={PhotoUpload}
                                    />
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.blogImage}
                                      </p>
                                    )}
                                    {checkImagePhoto ? (
                                      <img
                                        //   src={image ?? myImage}
                                        className="m-2"
                                        src={photoAdd}
                                        alt="Profile"
                                        width="180"
                                        height="200"
                                      />
                                    ) : null}
                                  </Col>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          key={"IsActive_" + _id}
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          // onChange={handleCheck}
                                          onChange={(e) => {
                                            setIsActive(e.target.checked);
                                          }}
                                          checked={IsActive}
                                        />
                                        <Label
                                          className="form-check-label"
                                          htmlFor="activeCheckBox"
                                        >
                                          Is Active
                                        </Label>
                                      </div>
                                    </Col>
                                  </div>

                                  {loadingOption && (
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="spinner-border"
                                        role="status"
                                      >
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                      <h6 className="p-2">
                                        Wait for a few seconds.This process
                                        might take some time.
                                      </h6>
                                    </div>
                                  )}

                                  <Col lg={12}>
                                    <FormsFooter
                                      handleSubmit={handleClick}
                                      handleSubmitCancel={handleAddCancel}
                                    />
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                          </CardBody>{" "}
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                {/* UPDATE FORM  */}
                <div
                  style={{
                    display: !showForm && updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col xxl={12}>
                        <Card className="">
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <Input
                                        key={"blogTitle_" + _id}
                                        type="text"
                                        className={validClassBT}
                                        placeholder="Enter blog title"
                                        required
                                        name="blogTitle"
                                        value={blogTitle}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                          setblogTitle(e.target.value);
                                        }}
                                      />
                                      <Label>
                                        Blog Title{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.blogTitle}
                                        </p>
                                      )}
                                    </div>
                                  </Col>

                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="textarea"
                                        className={validClassBTD}
                                        style={{ height: "100px" }}
                                        placeholder="Remarks..."
                                        name="blogThumnailDesc"
                                        value={blogThumnailDesc}
                                        onChange={(e) => {
                                          setblogThumnailDesc(e.target.value);
                                        }}
                                      />
                                      <Label className="form-label">
                                        Blog Thumbnail Description
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.blogThumnailDesc}
                                        </p>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={12}>
                                    <Card>
                                      <Label>
                                        Blog Description
                                        <span className="text-danger">*</span>
                                      </Label>
                                      <CardBody>
                                        {/* <Form method="post"> */}
                                        <CKEditor
                                          key={"blogDesc_" + _id}
                                          editor={ClassicEditor}
                                          data={blogDesc}
                                          config={{
                                            extraPlugins: [uploadPlugin],
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();

                                            setblogDesc(data);
                                          }}
                                        />
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.blogDesc}
                                          </p>
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Col>

                                  <Col lg={6}>
                                    <label>
                                      Blog Image{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                      key={"blogImage_" + _id}
                                      type="file"
                                      name="blogImage"
                                      className={validClassBI}
                                      // accept="images/*"
                                      accept=".jpg, .jpeg, .png"
                                      onChange={PhotoUpload}
                                    />
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.blogImage}
                                      </p>
                                    )}

                                    {blogImage || photoAdd ? (
                                      <img
                                        // key={photoAdd}
                                        className="m-2"
                                        src={
                                          checkImagePhoto
                                            ? photoAdd
                                            : `${process.env.REACT_APP_API_URL}/${blogImage}`
                                        }
                                        width="180"
                                        height="200"
                                      />
                                    ) : null}
                                  </Col>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          key={"IsActive_" + _id}
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          onChange={(e) => {
                                            setIsActive(e.target.checked);
                                          }}
                                          checked={IsActive}
                                        />
                                        <Label
                                          className="form-check-label"
                                          htmlFor="activeCheckBox"
                                        >
                                          Is Active
                                        </Label>
                                      </div>
                                    </Col>
                                  </div>

                                  {loadingOption && (
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="spinner-border"
                                        role="status"
                                      >
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                      <h6 className="p-2">
                                        Wait for a few seconds.This process
                                        might take some time.
                                      </h6>
                                    </div>
                                  )}

                                  <Col lg={12}>
                                    <FormUpdateFooter
                                      handleUpdate={handleUpdate}
                                      handleUpdateCancel={handleUpdateCancel}
                                    />
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                {/* list */}
                <div
                  style={{
                    display: showForm || updateForm ? "none" : "block",
                  }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        <DataTable
                          columns={col}
                          data={blogs}
                          progressPending={loading}
                          sortServer
                          onSort={(column, sortDirection, sortedRows) => {
                            handleSort(column, sortDirection);
                          }}
                          pagination
                          paginationServer
                          paginationTotalRows={totalRows}
                          paginationRowsPerPageOptions={[
                            10,
                            50,
                            100,
                            totalRows,
                          ]}
                          onChangeRowsPerPage={handlePerRowsChange}
                          onChangePage={handlePageChange}
                        />
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <DeleteModal
        show={modal_delete}
        handleDelete={handleDelete}
        toggle={handleDeleteClose}
        setmodal_delete={setmodal_delete}
      />
    </React.Fragment>
  );
};

export default Blogs;
