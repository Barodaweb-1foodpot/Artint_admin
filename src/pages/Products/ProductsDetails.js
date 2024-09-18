import React, { useState, useEffect } from "react";
import {
  Input,
  Label,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";

import {
  createProductsDetails,
  getProductsDetails,
  removeProductsDetails,
  updateProductsDetails,
} from "../../functions/Products/ProductsDetails";
import { listCategory } from "../../functions/Category/CategoryMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";

const ProductDetails = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");

  const initialState = {
    category: "",
    productName: "",
    productImage: "",
    productDescription: "",
    price: 0,
    IsActive: false,
    IsSubscriptionProduct: false,
    isOutOfStock: false,
  };

  const [remove_id, setRemove_id] = useState("");

  //search and pagination state
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [values, setValues] = useState(initialState);

  const {
    category,
    productName,
    productDescription,
    productImage,
    price,
    IsActive,
    IsSubscriptionProduct,
    isOutOfStock,
  } = values;

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [data, setData] = useState([]);

  const columns = [
    {
      name: "Product Category",
      selector: (row) => row.category.categoryName,
      sortable: true,
      sortField: "row.category.categoryName",
      minWidth: "150px",
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
      sortField: "productName",
      minWidth: "150px",
    },
    {
      name: "Subscription",
      selector: (row) => {
        return <p>{row.IsSubscriptionProduct ? "Yes" : "No"}</p>;
      },
      sortable: false,
      sortField: "IsSubscriptionProduct",
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

  useEffect(() => {
    fetchProducts();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchProducts = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/product-details`,
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
          setData(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setData([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const [errPN, setErrPN] = useState(false);
  const [errCN, setErrCN] = useState(false);
  const [errPI, setErrPI] = useState(false);
  const [errwt, setErrwt] = useState(false);
  const [errut, setErrut] = useState(false);

  const [errPr, setErrPr] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (values.category === "") {
      errors.category = "Category Name is required";
      setErrCN(true);
    }
    if (values.category !== "") {
      setErrCN(false);
    }

    if (values.productName === "") {
      errors.productName = "Product Name is required";
      setErrPN(true);
    }

    if (values.productName !== "") {
      setErrPN(false);
    }

    if (values.productImage === "") {
      errors.productImage = "Product Image is required";
      setErrPI(true);
    }

    if (values.productImage !== "") {
      setErrPI(false);
    }

    return errors;
  };

  const validClassCategory =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassUnit =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPN =
    errPN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClasswt =
    errwt && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPr =
    errPr && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPI =
    errPI && isSubmit ? "form-control is-invalid" : "form-control";

  const [modal_delete, setmodal_delete] = useState(false);

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);

  const handlecheck = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, IsActive: e.target.checked });
  };
  const handlecheckGH = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, IsGiftHamper: e.target.checked });
  };

  const handlecheckSubs = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, IsSubscriptionProduct: e.target.checked });
  };

  const handlecheckDrink = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isDrink: e.target.checked });
  };

  const handlecheckSize = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isSize: e.target.checked });
  };

  const handlecheckMilk = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isMilk: e.target.checked });
  };

  const handlecheckOutStock = (e) => {
    console.log(e.target.checked);
    setValues({ ...values, isOutOfStock: e.target.checked });
  };

  const [modal_list, setModalList] = useState(false);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [drinkCategories, setDrinkCategories] = useState([]);

  useEffect(() => {
    loadDrinkCategories();
  }, [category]);

  const loadDrinkCategories = () => {
    listCategory().then((res) => setDrinkCategories(res));
  };

  const handleClick = (e) => {
    e.preventDefault();
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      const formdata = new FormData();

      formdata.append("myFile", values.productImage);
      formdata.append("category", values.category);
      formdata.append("productName", values.productName);
      formdata.append("productDescription", values.productDescription);
      formdata.append("IsActive", values.IsActive);
      formdata.append("IsGiftHamper", values.IsGiftHamper);
      formdata.append("IsSubscriptionProduct", values.IsSubscriptionProduct);
      formdata.append("isOutOfStock", values.isOutOfStock);
      formdata.append("price", values.price);

      createProductsDetails(formdata)
        .then((res) => {
          // setModalList(!modal_list);
          setShowForm(false);
          setValues(initialState);
          setCheckImagePhoto(false);
          setPhotoAdd("");
          setIsSubmit(false);
          setFormErrors({});
          fetchProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const tog_list = () => {
    setModalList(!modal_list);
    setIsSubmit(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeProductsDetails(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchProducts();
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

    // let errors = validate(values);
    // setFormErrors(errors);
    setIsSubmit(true);
    // if (Object.keys(errors).length === 0) {
    const formdata = new FormData();

    formdata.append("myFile", values.productImage);
    formdata.append("category", values.category);
    formdata.append("productName", values.productName);
    formdata.append("productDescription", values.productDescription);
    formdata.append("IsActive", values.IsActive);
    formdata.append("IsGiftHamper", values.IsGiftHamper);
    formdata.append("IsSubscriptionProduct", values.IsSubscriptionProduct);
    formdata.append("isOutOfStock", values.isOutOfStock);
    formdata.append("price", values.price);
    updateProductsDetails(_id, formdata)
      .then((res) => {
        // setmodal_edit(!modal_edit);
        setPhotoAdd("");
        setUpdateForm(false);

        fetchProducts();
        setCheckImagePhoto(false);
        setValues(initialState);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const handleAddCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setPhotoAdd("");
    setCheckImagePhoto(false);
    // setModalList(false);
    setShowForm(false);
    setUpdateForm(false);
    setValues(initialState);
  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setPhotoAdd("");
    setUpdateForm(false);
    setShowForm(false);

    setCheckImagePhoto(false);
    setValues(initialState);
  };

  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setIsSubmit(false);
    setUpdateForm(true);

    set_Id(_id);
    console.log(_id);
    setFormErrors(false);
    getProductsDetails(_id)
      .then((res) => {
        setValues({
          ...values,
          category: res.category,
          productName: res.productName,
          productImage: res.productImage,
          productDescription: res.productDescription,
          IsActive: res.IsActive,
          IsGiftHamper: res.IsGiftHamper,
          IsSubscriptionProduct: res.IsSubscriptionProduct,
          price: res.price,
          isOutOfStock: res.isOutOfStock,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
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

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        // Now, you have the image width and height available.
        // You can use this information when sending the image to the backend.
      };

      setPhotoAdd(imageurl);
      setValues({ ...values, productImage: e.target.files[0] });
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
  document.title = "Product Details | ArtTint";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Product Master"
            title="Product Details"
            pageTitle="Product Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Product Details"
                    filter={filter}
                    handleFilter={handleFilter}
                    tog_list={tog_list}
                    setQuery={setQuery}
                    initialState={initialState}
                    setValues={setValues}
                    updateForm={updateForm}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setUpdateForm={setUpdateForm}
                  />
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
                                  <Row>
                                    <Col lg={6}>
                                      <div className="form-floating  mb-3">
                                        <select
                                          name="category"
                                          className={validClassCategory}
                                          onChange={handleChange}
                                          value={category}
                                          data-choices
                                          data-choices-sorting="true"
                                        >
                                          <option>Select Category</option>
                                          {drinkCategories.map((c) => {
                                            return (
                                              <React.Fragment key={c._id}>
                                                  <option value={c._id}>
                                                    {c.categoryName}
                                                  </option>
                                              </React.Fragment>
                                            );
                                          })}
                                        </select>
                                        <Label>
                                          Product Category{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.category}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className={validClassPN}
                                          placeholder="Enter product name"
                                          required
                                          name="productName"
                                          value={values.productName}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor="role-field"
                                          className="form-label"
                                        >
                                          Product Name
                                          <span className="text-danger">*</span>
                                        </label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.productName}
                                          </p>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={2}>
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="Enter price"
                                          required
                                          name="price"
                                          value={values.price}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor="role-field"
                                          className="form-label"
                                        >
                                          Price
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </Col>
                                  </Row>

                                  <Col>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="textarea"
                                        className="form-control"
                                        placeholder="Enter product description..."
                                        name="productDescription"
                                        rows="5"
                                        style={{ height: "150px" }}
                                        value={values.productDescription}
                                        onChange={handleChange}
                                      />

                                      <label
                                        htmlFor="role-field"
                                        className="form-label"
                                      >
                                        Description
                                      </label>
                                    </div>
                                  </Col>
                                  <Col lg={6}>
                                    <label>
                                      Product Image{" "}
                                      <span className="text-danger">*</span>
                                    </label>

                                    <input
                                      type="file"
                                      name="productImage"
                                      className={validClassPI}
                                      // accept="images/*"
                                      accept=".jpg, .jpeg, .png"
                                      onChange={PhotoUpload}
                                    />
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.productImage}
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
                                  <Col lg={6}>
                                    <div className="form-check mb-2 mt-2">
                                      <Input
                                        type="checkbox"
                                        name="isOutOfStock"
                                        value={isOutOfStock}
                                        onChange={handlecheckGH}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Is OutOfStock
                                      </Label>
                                    </div>
                                  </Col>

                                  <Col lg={6}>
                                    <div className="form-check mb-2 mt-2">
                                      <Input
                                        type="checkbox"
                                        name="IsSubscriptionProduct"
                                        value={IsSubscriptionProduct}
                                        onChange={handlecheckSubs}
                                        // checked={IsTopProducts}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Subscription Product
                                      </Label>
                                    </div>
                                  </Col>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          onChange={handlecheck}
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
                                  <Row>
                                    <Col lg={6}>
                                      <div className="form-floating  mb-3">
                                        <select
                                          name="category"
                                          className={validClassCategory}
                                          onChange={handleChange}
                                          value={category}
                                          data-choices
                                          data-choices-sorting="true"
                                        >
                                          {/* <option>Select Category</option> */}
                                          {drinkCategories.map((c) => {
                                            return (
                                              <React.Fragment key={c._id}>
                                                  <option value={c._id}>
                                                    {c.categoryName}
                                                  </option>
                                              </React.Fragment>
                                            );
                                          })}
                                        </select>
                                        <Label>
                                          Product Category{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.category}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <input
                                          type="text"
                                          className={validClassPN}
                                          placeholder="Enter product name"
                                          required
                                          name="productName"
                                          value={values.productName}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor="role-field"
                                          className="form-label"
                                        >
                                          Product Name
                                          <span className="text-danger">*</span>
                                        </label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.productName}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={2}>
                                      <div className="form-floating mb-3">
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="Enter price"
                                          required
                                          name="price"
                                          value={values.price}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor="role-field"
                                          className="form-label"
                                        >
                                          Price
                                          <span className="text-danger">*</span>
                                        </label>
                                      </div>
                                    </Col>
                                  </Row>

                                  <Col lg={6}>
                                    <div className="form-floating mb-3 mt-4">
                                      <input
                                        type="textarea"
                                        className="form-control"
                                        placeholder="Enter product description..."
                                        name="productDescription"
                                        rows="5"
                                        style={{ height: "150px" }}
                                        value={values.productDescription}
                                        onChange={handleChange}
                                      />

                                      <label
                                        htmlFor="role-field"
                                        className="form-label"
                                      >
                                        Description
                                      </label>
                                    </div>
                                  </Col>

                                  <Col lg={6}>
                                    <label>
                                      Product Image{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      key={"productImage" + _id}
                                      type="file"
                                      name="productImage"
                                      className={validClassPI}
                                      // accept="images/*"
                                      accept=".jpg, .jpeg, .png"
                                      onChange={PhotoUpload}
                                    />
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.productImage}
                                      </p>
                                    )}

                                    {values.productImage || photoAdd ? (
                                      <img
                                        // key={photoAdd}
                                        className="m-2"
                                        src={
                                          checkImagePhoto
                                            ? photoAdd
                                            : `${process.env.REACT_APP_API_URL}/${values.productImage}`
                                        }
                                        width="180"
                                        height="200"
                                      />
                                    ) : null}
                                  </Col>

                                  <Col lg={6}>
                                    <div className="form-check mb-2 mt-2">
                                      <Input
                                        type="checkbox"
                                        name="isOutOfStock"
                                        value={isOutOfStock}
                                        onChange={handlecheckGH}
                                        checked={isOutOfStock}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Is OutOfStock
                                      </Label>
                                    </div>
                                  </Col>

                                  <Col lg={6}>
                                    <div className="form-check mb-2 mt-2">
                                      <Input
                                        type="checkbox"
                                        name="IsSubscriptionProduct"
                                        value={IsSubscriptionProduct}
                                        onChange={handlecheckSubs}
                                        checked={IsSubscriptionProduct}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Subscription Product
                                      </Label>
                                    </div>
                                  </Col>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          onChange={handlecheck}
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

                                  <Col lg={12}>
                                    <div className="text-end">
                                      <button
                                        type="submit"
                                        className=" btn btn-success m-1"
                                        id="add-btn"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger m-1"
                                        onClick={handleUpdateCancel}
                                      >
                                        Cancel
                                      </button>
                                    </div>
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
                          columns={columns}
                          data={data}
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

export default ProductDetails;
