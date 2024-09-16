import React, { useState, useEffect } from "react";
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
  Label,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  createPromocodeMaster,
  getPromocodeMaster,
  removePromocodeMaster,
  updatePromocodeMaster,
} from "../../functions/Products/PromocodeMaster";
import moment from "moment-timezone";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";
const initialState = {
  code: "",
  savePercentage: "",
  startDate: moment().format("MM-DD-YYYY"),
  endDate: moment().format("MM-DD-YYYY"),
  IsActive: false,
};

const PromocodeMaster = () => {
  const [values, setValues] = useState(initialState);
  const { code, savePercentage, startDate, endDate, IsActive } = values;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [data, setData] = useState([]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
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
    getPromocodeMaster(_id)
      .then((res) => {
        setValues({
          ...values,
          code: res.code,
          savePercentage: res.savePercentage,
          startDate: moment(res.startDate).format("YYYY-MM-DD"),
          endDate: moment(res.endDate).format("YYYY-MM-DD"),
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(errors).length === 0) {
    createPromocodeMaster(values)
      .then((res) => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setIsSubmit(false);
        setFormErrors({});
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removePromocodeMaster(remove_id)
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

  const handleUpdateCancel = (e) => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(erros).length === 0) {
    updatePromocodeMaster(_id, values)
      .then((res) => {
        setmodal_edit(!modal_edit);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

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
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list-by-params/PromocodeMaster`,
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
      name: "Promocode",
      selector: (row) => row.code,
      sortable: true,
      sortField: "code",
      minWidth: "150px",
    },
    {
      name: "Save(%)",
      selector: (row) => row.savePercentage,
      sortable: true,
      sortField: "savePercentage",
      minWidth: "150px",
    },
    {
      name: "Start Date",
      selector: (row) => {
        const dateObject = new Date(row.startDate);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "startDate",
      minWidth: "150px",
    },
    {
      name: "End Date",
      selector: (row) => {
        const dateObject = new Date(row.endDate);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "endDate",
      minWidth: "150px",
    },
    {
      name: "Created Date & Time",
      selector: (row) => {
        const dateObject = new Date(row.createdAt);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format(
              "MM-DD-YYYY hh:mm A"
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

  document.title = "Promocode Master | Project Name";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Subscriptions"
            title="Promocode Master"
            pageTitle="Subscriptions"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Promocode Master"
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
          Add Promocode
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="Enter code "
                required
                name="code"
                value={code}
                onChange={handleChange}
              />
              <Label>
                Promocode<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="savePercentage "
                required
                name="savePercentage"
                value={savePercentage}
                onChange={handleChange}
              />
              <Label>
                Save(%)<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="startDate "
                required
                name="startDate"
                value={startDate}
                onChange={handleChange}
                min={moment().format("YYYY-MM-DD")}
              />
              <Label>
                Start Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="endDate "
                required
                name="endDate"
                value={endDate}
                onChange={handleChange}
                min={startDate}
              />
              <Label>
                End Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
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
          Edit Promocode
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="Enter code "
                required
                name="code"
                value={code}
                onChange={handleChange}
              />
              <Label>
                Promocode <span className="text-danger">*</span>
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="savePercentage "
                required
                name="savePercentage"
                value={savePercentage}
                onChange={handleChange}
              />
              <Label>
                Save(%) <span className="text-danger">*</span>
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="startDate "
                required
                name="startDate"
                value={startDate}
                onChange={handleChange}
                min={moment().format("YYYY-MM-DD")}
              />
              <Label>
                Start Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="endDate "
                required
                name="endDate"
                value={endDate}
                onChange={handleChange}
                min={startDate}
              />
              <Label>
                End Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
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

export default PromocodeMaster;
