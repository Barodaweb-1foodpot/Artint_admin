import React, { useState, useEffect, useRef } from "react";
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
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  createBannerImages,
  getBannerImages,
  removeBannerImages,
  updateBannerImages,
} from "../../functions/CMS/Banner";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
const initialState = {
  Title: "",
  keyWord: "",
  Description: "",
  bannerImage: "",
  IsActive: false,
};

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const Banner = () => {
  const [values, setValues] = useState(initialState);
  const { Title, keyWord, Description, bannerImage, IsActive } = values;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    aspect: ASPECT_RATIO,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

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
    getBannerImages(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          Title: res.Title,
          keyWord: res.keyWord,
          Description: res.Description,
          bannerImage: res.bannerImage,
          IsActive: res.IsActive,
        });

        setImgSrc(res.bannerImage);
        console.log("res", values.Title);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const [errTT, setErrTT] = useState(false);
  const [errKW, setErrKW] = useState(false);
  const [errBI, setErrBI] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.Title === "") {
      errors.Title = "Title is required!";
      setErrTT(true);
    }
    if (values.Title !== "") {
      setErrTT(false);
    }

    if (values.keyWord === "") {
      errors.keyWord = "KeyWord is required!";
      setErrKW(true);
    }
    if (values.keyWord !== "") {
      setErrKW(false);
    }

    // if (values.bannerImage === "") {
    //   errors.bannerImage = "Banner Image is required!";
    //   setErrBI(true);
    // }
    // if (values.bannerImage !== "") {
    //   setErrBI(false);
    // }

    return errors;
  };

  const validClassTT =
    errTT && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassKW =
    errKW && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassBI =
    errBI && isSubmit ? "form-control is-invalid" : "form-control";

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
    setCheckImagePhoto(false);
    setPhotoAdd("");
    setImgSrc(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setFormErrors({});
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();

      if (completedCrop && previewCanvasRef.current) {
        const canvas = previewCanvasRef.current;
        await new Promise((resolve) => {
          canvas.toBlob((blob) => {
            formData.append("myFile", blob, "filename.png");
            resolve();
          });
        });
      } else if (imgSrc) {
        formData.append("myFile", imgSrc);
      }

      formData.append("Description", values.Description);
      formData.append("keyWord", values.keyWord);
      formData.append("IsActive", values.IsActive);
      formData.append("Title", values.Title);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      createBannerImages(formData)
        .then((res) => {
          setmodal_list(!modal_list);
          setValues(initialState);
          setIsSubmit(false);
          setFormErrors({});
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeBannerImages(remove_id)
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

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = new Image();
        image.src = reader.result.toString();
        image.onload = function () {
          const { naturalWidth, naturalHeight } = this;
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setError("Image must be at least 150 x 150 pixels.");
            setImgSrc("");
          } else {
            setError("");
            setImgSrc(this.src);
          }
        };
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, ASPECT_RATIO));
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      const formData = new FormData();

      if (completedCrop && previewCanvasRef.current) {
        const canvas = previewCanvasRef.current;
        await new Promise((resolve) => {
          canvas.toBlob((blob) => {
            formData.append("myFile", blob, "filename.png");
            resolve();
          });
        });
      } else if (imgSrc) {
        formData.append("myFile", imgSrc);
      }

      formData.append("Description", values.Description);
      formData.append("keyWord", values.keyWord);
      formData.append("IsActive", values.IsActive);
      formData.append("Title", values.Title);

      updateBannerImages(_id, formData)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchCategories();
          setPhotoAdd("");

          setCheckImagePhoto(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list-by-params/banner-images`,
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

  const [photoAdd, setPhotoAdd] = useState();
  const [checkImagePhoto, setCheckImagePhoto] = useState(false);

  const PhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);
      console.log("img", e.target.files[0]);

      setPhotoAdd(imageurl);
      setValues({ ...values, bannerImage: e.target.files[0] });
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

  const col = [
    {
      name: "Title",
      selector: (row) => row.Title,
      sortable: true,
      sortField: "Title",
      minWidth: "150px",
    },
    {
      name: "Key Word",
      selector: (row) => row.keyWord,
      sortable: true,
      sortField: "keyWord",
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

  document.title = "Bannner | Project Name";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb maintitle="CMS" title="Banner" pageTitle="CMS" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Products Category"
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
            setCompletedCrop(null);
            setImgSrc(null);
          }}
        >
          Add Banner
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassTT}
                placeholder="Enter code "
                required
                name="Title"
                value={Title}
                onChange={handleChange}
              />
              <Label>
                Title<span className="text-danger">*</span>{" "}
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Title}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassKW}
                placeholder="Enter keyWord "
                required
                name="keyWord"
                value={keyWord}
                onChange={handleChange}
              />
              <Label>
                key Word<span className="text-danger">*</span>{" "}
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.keyWord}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="textarea"
                className="form-control"
                placeholder="Enter Blog Description..."
                style={{ height: "150px" }}
                name="Description"
                value={Description}
                onChange={handleChange}
              />
              <Label>Banner Description</Label>
            </div>

            <Col lg={6}>
              <div className="mb-3">
                <Label className="form-label">Banner Image</Label>
                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                {imgSrc && (
                  <div>
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={ASPECT_RATIO}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: "1px solid black",
                        objectFit: "contain",
                        width: completedCrop?.width ?? 0,
                        height: completedCrop?.height ?? 0,
                      }}
                    />
                  </div>
                )}
                <p className="text-danger">{formErrors.bannerImage}</p>
              </div>
            </Col>

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
          Edit Banner
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassTT}
                placeholder="Enter code "
                required
                name="Title"
                value={Title}
                onChange={handleChange}
              />
              <Label>
                Title <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Title}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassKW}
                placeholder="Enter code "
                required
                name="keyWord"
                value={keyWord}
                onChange={handleChange}
              />
              <Label>
                key Word <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.keyWord}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="textarea"
                className="form-control"
                placeholder="Enter Blog Description..."
                style={{ height: "150px" }}
                name="Description"
                value={Description}
                onChange={handleChange}
              />
              <Label>Banner Description</Label>
            </div>

            <Col lg={6}>
              <div className="mb-3">
                <Label className="form-label">Banner Image</Label>
                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  onChange={onSelectFile}
                />
                {imgSrc && (
                  <div>
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={ASPECT_RATIO}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: "1px solid black",
                        objectFit: "contain",
                        width: completedCrop?.width ?? 0,
                        height: completedCrop?.height ?? 0,
                      }}
                    />
                  </div>
                )}
                <p className="text-danger">{formErrors.bannerImage}</p>
              </div>
            </Col>

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
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setCheckImagePhoto(false);
                  setFormErrors({});
                  setPhotoAdd("");
                }}
              >
                Cancel
              </button>
            </div>
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

export default Banner;
