import React, { useState, useEffect, useRef } from "react";
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
import { Spinner } from 'reactstrap';


import {
    createArtPiece,
    getArtPiece,
    removeArtPiece,
    updateArtPiece,
} from "../../functions/ArtPiece/ArtPiece.js";
import { listCategory } from "../../functions/Category/CategoryMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { toast, ToastContainer } from "react-toastify";

import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";



let ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;


const ArtPiece = () => {
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);
    const [_id, set_Id] = useState("");

    const initialState = {
        category: "",           
        artName: "",           
        artImage: "",         
        price: "",             
        isActive: true,       
        artistName: "",  
        artistLastName:"",       
        year: "",               
        artType: "",            
        size: "",               
        artForm: "",            
        signature: "",          
        certificate: "",        
        frame: "",              
        link1: "",              
        URL_link: "",              
    };


    const [remove_id, setRemove_id] = useState("");

    //search and pagination state
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [values, setValues] = useState(initialState);

    const {
        category,
        artName,
        artImage,
        price,
        isActive,
        artistName,
        year,
        artType,
        size,
        artForm,
        signature,
        certificate,
        frame,
        link1,
        URL_link,
        artistLastName
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


    const renderImage = (uploadimage) => {
        const imageUrl = `${process.env.REACT_APP_API_URL}/${uploadimage}`;

        return (
            <img
                src={imageUrl}
                alt="Image"
                style={{ width: "75px", height: "75px", padding: "5px" }}
            />
        );
    };
    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => index + 1, // Adding 1 to the index for 1-based numbering
            sortable: false, // Serial numbers generally aren't sorted, so no need for sorting here
            minWidth: "80px",
        },
        {
            name: "Art Name",
            selector: (row) => row.artName,
            sortable: true,
            sortField: "artName",
            minWidth: "150px",
        },
        {
            name: "Artist Name",
            selector: (row) => row.artistName,
            sortable: true,
            sortField: "artistName",
            minWidth: "150px",
        },
        {
            name: "Artist Last Name",
            selector: (row) => row.artistLastName,
            sortable: true,
            sortField: "artistLastName",
            minWidth: "150px",
        },
        {
            name: "Image",
            cell: (row) => renderImage(row.artImage),
            sortable: true,
            sortField: "Image",
            minWidth: "150px",
        },
        {
            name: "Position",
            cell: (row) => {
                const categoryLabel = cat.find((item) => item.value === row.category)?.label;
                return categoryLabel || "Unknown"; // Return "Unknown" if no match is found
            },

            sortable: true,
            sortField: "category",
            minWidth: "150px",
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
                `${process.env.REACT_APP_API_URL}/api/auth/listByparams/ArtPiece`,
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

    const validate = () => {
        const errors = {};
        if (values.artName === "") {
            errors.artName = "Art Name is required";
            setErrCN(true);
        }
        if (values.artName !== "") {
            setErrCN(false);
        }

        if (values.artistName === "") {
            errors.artistName = "Artist Name is required";
            setErrPN(true);
        }

        if (values.artist !== "") {
            setErrPN(false);
        }

        if (croppedImages.length === 0) {
            errors.artImage = "Image is required!";
            // setErrGI(true);
        }



        if (values.category === "") {
            errors.category = "Category is required";
            setErrPI(true);
        }

        if (values.category !== "") {
            setErrPI(false);
        }

        if (values.URL_link === "") {
            errors.URL_link = "URL is required";
            setErrPI(true);
        }

        if (values.URL_link !== "") {
            setErrPI(false);
        }

        return errors;
    };

    const validateEdit = () => {
        const errors = {};
        if (values.artName === "") {
            errors.artName = "Art Name is required";
            setErrCN(true);
        }
        if (values.artName !== "") {
            setErrCN(false);
        }

        if (values.artistName === "") {
            errors.artistName = "Artist Name is required";
            setErrPN(true);
        }

        if (values.artist !== "") {
            setErrPN(false);
        }

  



        if (values.category === "") {
            errors.category = "Category is required";
            setErrPI(true);
        }

        if (values.category !== "") {
            setErrPI(false);
        }

        if (values.URL_link === "") {
            errors.URL_link = "URL is required";
            setErrPI(true);
        }

        if (values.URL_link !== "") {
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
        setValues({ ...values, isActive: e.target.checked });
    };
    const handlecheckGH = (e) => {
        console.log(e.target.checked);
        setValues({ ...values, IsGiftHamper: e.target.checked });
    };

    const handlecheckSubs = (e) => {
        console.log(e.target.checked);
        setValues({ ...values, IsSubscriptionProduct: e.target.checked });
    };



    const [modal_list, setModalList] = useState(false);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);


    const handleCategoryChange = (e) => {
        const { value } = e.target;

        if (value === "bigImage" || value === "rightsidewallBigImage") {
            ASPECT_RATIO = 42 / 53; // Set aspect ratio for "Big Image"
        } else {
            console.log(value)
            ASPECT_RATIO = 1; // Reset or set a default aspect ratio for other categories
        }

        handleChange(e); // Call your existing handleChange function to update form state
    };
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [drinkCategories, setDrinkCategories] = useState([]);



    const handleClick = (e) => {
        e.preventDefault();
        let errors = validate();
        setFormErrors(errors);
        setIsSubmit(true);
        console.log(croppedImages)
        console.log(values)
        if (Object.keys(errors).length === 0) {
            setLoading(true)
            const formdata = new FormData();

            formdata.append("artImage", croppedBlobs, "artImage.png");
            formdata.append("category", values.category);          // Corresponds to `category`
            formdata.append("artName", values.artName);            // Corresponds to `artName`
            formdata.append("price", values.price);                // Corresponds to `price`
            formdata.append("isActive", values.isActive);          // Corresponds to `isActive`
            formdata.append("artistName", values.artistName);      // Corresponds to `artistName`
            formdata.append("year", values.year);                  // Corresponds to `year`
            formdata.append("artType", values.artType);            // Corresponds to `artType`
            formdata.append("size", values.size);                  // Corresponds to `size`
            formdata.append("artForm", values.artForm);            // Corresponds to `artForm`
            formdata.append("signature", values.signature);        // Corresponds to `signature`
            formdata.append("certificate", values.certificate);    // Corresponds to `certificate`
            formdata.append("frame", values.frame);                // Corresponds to `frame`
            formdata.append("link1", values.link1);                // Corresponds to `link1`
            formdata.append("URL_link", values.URL_link);                // Corresponds to `URL_link`
            formdata.append("artistLastName", values.artistLastName);        



            createArtPiece(formdata)
                .then((res) => {
                    if (res.isOk) {
                        setLoading(false)
                        toast.success(res.message)
                        // setModalList(!modal_list);
                        setShowForm(false);
                        setValues(initialState);
                        setCheckImagePhoto(false);
                        setPhotoAdd("");
                        setIsSubmit(false);
                        setFormErrors({});
                        fetchProducts();
                        setCheckImagePhoto(false);
                        setCroppedImages([])
                        setCroppedBlobs([])
                        setShowCrop(false);
                        setCompletedCrop(null);
                        setCroppedImages([])
                        setImgSrc("")
                    }
                    else {
                        toast.error(res.message)
                    }
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
        removeArtPiece(remove_id)
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

        let errors = validateEdit();
        setFormErrors(errors);
        console.log(errors)
        setIsSubmit(true);
        if (Object.keys(errors).length === 0) {
            setLoading(true)
        const formdata = new FormData();

        if (croppedBlobs.length === 0) {
            formdata.append("artImage", artImage);
        }
        else {
            formdata.append("artImage", croppedBlobs, "artImage.png");
        }
        formdata.append("category", values.category);          
        formdata.append("artName", values.artName);            
        formdata.append("price", values.price);                
        formdata.append("isActive", values.isActive);          
        formdata.append("artistName", values.artistName);      
        formdata.append("year", values.year);                  
        formdata.append("artType", values.artType);            
        formdata.append("size", values.size);                 
        formdata.append("artForm", values.artForm);           
        formdata.append("signature", values.signature);        
        formdata.append("certificate", values.certificate);    
        formdata.append("frame", values.frame);              
        formdata.append("link1", values.link1);                
        formdata.append("URL_link", values.URL_link);           
        formdata.append("artistLastName", values.artistLastName);    

        updateArtPiece(_id, formdata)
            .then((res) => {
                if(res.isOk)
                // setmodal_edit(!modal_edit);
               { setPhotoAdd("");
                setLoading(false)
                setUpdateForm(false);
                toast.success(res.message)
                fetchProducts();
                setCheckImagePhoto(false);
                setValues(initialState);}
                else{
                    toast.error(res.message)
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
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
        getArtPiece(_id)
            .then((res) => {
                setValues({
                    ...values,

                    category: res.category,                   // Keeping this field the same
                    artName: res.artName,                 // productName -> artName
                    artImage: res.artImage,               // productImage -> artImage
                    price: res.price,                         // price -> price
                    isActive: res.isActive,                   // IsActive -> isActive
                    artistName: res.artistName,                         // You need to manually fill this as there's no corresponding field in `res`
                    year: res.year,                                 // Fill this manually, or map if available
                    artType: res.artType,                              // Fill this manually, or map if available
                    size: res.size,                                 // Fill this manually, or map if available
                    artForm: res.artForm,                              // Fill this manually, or map if available
                    signature: res.signature,                            // Fill this manually, or map if available
                    certificate: res.certificate,                          // Fill this manually, or map if available
                    frame: res.frame,                                // Fill this manually, or map if available
                    link1: res.link1,                                // Fill this manually, or map if available
                    URL_link: res.URL_link,  
                    artistLastName:res.artistLastName?res.artistLastName:""                              // Fill this manually, or map if available

                });

                if (res.category === "bigImage" || res.category ==="rightsidewallBigImage") {
                    ASPECT_RATIO = 42 / 54; // Set aspect ratio for "Big Image"
                } else {
                    ASPECT_RATIO = 1; // Reset or set a default aspect ratio for other categories
                }
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

    const handleFileUpload = (e) => {
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
            setValues({ ...values, artImage: e.target.files[0] });
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

    const [showCrop, setShowCrop] = useState(false);
    const [error, setError] = useState("");

    const [croppedImages, setCroppedImages] = useState([]);
    const [images, setImages] = useState([]);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState({
        unit: "%",
        width: 90,
        aspect: ASPECT_RATIO,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const onImageLoad = (e) => {
        console.log("onImageLoad")
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
    const tog_showCrop = (_id) => {
        setShowCrop(!showCrop);

    };

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        console.log("file", file)
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const image = new Image();
                image.src = reader.result.toString();
                image.onload = function () {
                    const { naturalWidth, naturalHeight } = this;
                    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                        toast.error("Image must be at least 150 x 150 pixels.")
                        setError("Image must be at least 150 x 150 pixels.");
                        setImgSrc("");
                    } else {
                        setError("");
                        setImgSrc(this.src);
                        // Add the uploaded image to the images array
                        setImages((prevImages) => [...prevImages, this.src]);
                    }
                };
            });
            reader.readAsDataURL(file);
        }
    };

    const [croppedBlobs, setCroppedBlobs] = useState([]);

    const handleSaveCroppedImage = () => {
        console.log("previewCanvasRef", previewCanvasRef);
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            setShowCrop(false);
            return;
        }

        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
            const croppedImageURL = URL.createObjectURL(blob);

            // Add the blob and the URL to their respective arrays
            setCroppedImages(croppedImageURL);
            setCroppedBlobs(blob);

            // setCroppedImages([])
            // Clear the current crop and image source
            setImgSrc("");
            setCrop({
                unit: "%",
                width: 90,
                aspect: ASPECT_RATIO,
            });
            setShowCrop(false);
            setCompletedCrop(null);
        });
    };

    const cat = [
        { value: 'leftsidewall', label: 'Left Side Wall' },
        { value: 'bigImage', label: 'Big Center Image' },
        { value: 'rightsidewall', label: 'Right Side Wall' },
        { value: 'rightsidewallBigImage', label: 'Right Side Wall Big Image' }

    ]

    document.title = "Art Piece Master | ArtTint";

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        // maintitle="Product Master"
                        title="Art Piece Master"
                    // pageTitle="Product Master"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row className="g-4 mb-1">
                                        <Col className="col-sm" lg={4} md={6} sm={6}>
                                            <h2 className="card-title mb-0 fs-4 mt-2">Art Piece Master</h2>
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
                                                    <Label className="form-check-label ms-2">Active</Label>
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
                                                                            setValues(initialState);
                                                                        }}
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
                                                                        setValues(initialState);
                                                                        setUpdateForm(false);
                                                                        setShowForm(false);
                                                                        setValues(initialState);
                                                                        setCheckImagePhoto(false);
                                                                        setPhotoAdd("");
                                                                        setIsSubmit(false);
                                                                        setFormErrors({});
                                                                        fetchProducts();
                                                                        setCheckImagePhoto(false);
                                                                        setCroppedImages([])
                                                                        setCroppedBlobs([])
                                                                        setShowCrop(false);
                                                                        setCompletedCrop(null);
                                                                        setCroppedImages([])
                                                                        setImgSrc("")
                                                                    }}
                                                                >
                                                                    <i class="ri-list-check align-bottom me-1"></i> List
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
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
                                                                    <Row>
                                                                        {/* Artist Name */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Artist Name <span className="text-danger">*</span></Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="artistName"
                                                                                placeholder="Enter artist name"
                                                                                required
                                                                                value={values.artistName}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.artistName}</p>}

                                                                        </Col>
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Artist Last Name </Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="artistLastName"
                                                                                placeholder="Enter artist last name"
                                                                                required
                                                                                value={values.artistLastName}
                                                                                onChange={handleChange}
                                                                            />
                                                                            
                                                                        </Col>

                                                                        {/* Art Name */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Art Name <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artName"
                                                                                placeholder="Enter art name"
                                                                                required
                                                                                value={values.artName}
                                                                                onChange={handleChange}
                                                                            />

                                                                            {isSubmit && <p className="text-danger">{formErrors.artName}</p>}

                                                                        </Col>
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>URL <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="URL_link"
                                                                                placeholder="Enter URL"
                                                                                value={values.URL_link}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.URL_link}</p>}


                                                                        </Col>
                                                                        {/* Category (Dropdown) */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Category <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="category"
                                                                                required
                                                                                value={values.category}
                                                                                onChange={handleCategoryChange}
                                                                            >
                                                                                <option value="">Select Category</option>
                                                                                {cat.map((items) => (
                                                                                    <option value={items.value} key={items.value} >{items.label}</option>)
                                                                                )}



                                                                            </Input>
                                                                            {isSubmit && <p className="text-danger">{formErrors.category}</p>}

                                                                        </Col>



                                                                        {/* Price */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Price </Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="price"
                                                                                placeholder="Enter price"
                                                                                required
                                                                                value={values.price}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Year */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Year</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="year"
                                                                                placeholder="Enter year"
                                                                                value={values.year}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Art Type */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Art Type</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artType"
                                                                                placeholder="Enter art type"
                                                                                value={values.artType}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Size */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Size</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="size"
                                                                                placeholder="Enter size"
                                                                                value={values.size}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Art Form */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Art Form</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artForm"
                                                                                placeholder="Enter art form"
                                                                                value={values.artForm}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Signature */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Signature</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="signature"
                                                                                placeholder="Enter signature"
                                                                                value={values.signature}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Certificate */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Certificate</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="certificate"
                                                                                placeholder="Enter certificate"
                                                                                value={values.certificate}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Frame */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Frame</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="frame"
                                                                                placeholder="Enter frame"
                                                                                value={values.frame}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Links */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Link 1</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="link1"
                                                                                placeholder="Enter link 1"
                                                                                value={values.link1}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>


                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Art Image <span className="text-danger">*</span></Label><br />
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary text-light mb-3 "
                                                                                onClick={() => {
                                                                                    // setValues(initialState);
                                                                                    setShowCrop(true)


                                                                                    // setFileId(Math.random() * 100000);
                                                                                }}
                                                                            >
                                                                                {/* <i class="ri-list-check align-bottom me-1"></i>{" "} */}
                                                                                Upload Images
                                                                            </button>
                                                                            {croppedImages.length != 0 ? (
                                                                                <div>
                                                                                    <div className="uploaded-images">
                                                                                        <img
                                                                                            src={croppedImages}
                                                                                            alt={`Uploaded `}
                                                                                            style={{ height: '300px', width: '300px' }}
                                                                                        />
                                                                                    </div>

                                                                                </div>
                                                                            ) : null}
                                                                            {isSubmit && (
                                                                                <p className="text-danger">
                                                                                    {formErrors.artImage}
                                                                                </p>
                                                                            )}

                                                                        </Col>
                                                                        {/* Is Active */}
                                                                        <Col lg={6}>

                                                                            <Input
                                                                                type="checkbox"
                                                                                name="isActive"
                                                                                checked={values.isActive}
                                                                                onChange={handlecheck}
                                                                            />
                                                                            <Label className="form-check-label">Is Active</Label>

                                                                        </Col>

                                                                        {/* Submit and Cancel */}

                                                                    </Row>
                                                                    {loading && 
                                                                            <div className="d-flex justify-content-center mx-2 mt-2">
                                                                            <Spinner color="primary"> Loading... </Spinner>
                                                                        </div>
                                                                        }
                                                                    <Row>
                                                                        <FormsFooter
                                                                            handleSubmit={handleClick}
                                                                            handleSubmitCancel={handleAddCancel}
                                                                        />
                                                                    </Row>
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
                                                                        {/* Artist Name */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Artist Name <span className="text-danger">*</span></Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="artistName"
                                                                                placeholder="Enter artist name"
                                                                                required
                                                                                value={values.artistName}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.artistName}</p>}

                                                                        </Col>
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Artist Last Name </Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="artistLastName"
                                                                                placeholder="Enter artist last name"
                                                                                required
                                                                                value={values.artistLastName}
                                                                                onChange={handleChange}
                                                                            />
                                                                            
                                                                        </Col>

                                                                        {/* Art Name */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Art Name <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artName"
                                                                                placeholder="Enter art name"
                                                                                required
                                                                                value={values.artName}
                                                                                onChange={handleChange}
                                                                            />

                                                                            {isSubmit && <p className="text-danger">{formErrors.artName}</p>}

                                                                        </Col>
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>URL <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="URL_link"
                                                                                placeholder="Enter URL"
                                                                                value={values.URL_link}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.URL_link}</p>}


                                                                        </Col>
                                                                        {/* Category (Dropdown) */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Category <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="category"
                                                                                required
                                                                                value={values.category}
                                                                                onChange={handleCategoryChange}
                                                                            >
                                                                                <option value="">Select Category</option>
                                                                                {cat.map((items) => (
                                                                                    <option value={items.value} key={items.value} >{items.label}</option>)
                                                                                )}
                                                                            </Input>
                                                                            {isSubmit && <p className="text-danger">{formErrors.category}</p>}

                                                                        </Col>



                                                                        {/* Price */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Price </Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="price"
                                                                                placeholder="Enter price"
                                                                                required
                                                                                value={values.price}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Year */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Year</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="year"
                                                                                placeholder="Enter year"
                                                                                value={values.year}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Art Type */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Art Type</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artType"
                                                                                placeholder="Enter art type"
                                                                                value={values.artType}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Size */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Size</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="size"
                                                                                placeholder="Enter size"
                                                                                value={values.size}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Art Form */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Art Form</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="artForm"
                                                                                placeholder="Enter art form"
                                                                                value={values.artForm}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Signature */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Signature</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="signature"
                                                                                placeholder="Enter signature"
                                                                                value={values.signature}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Certificate */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Certificate</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="certificate"
                                                                                placeholder="Enter certificate"
                                                                                value={values.certificate}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Frame */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Frame</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="frame"
                                                                                placeholder="Enter frame"
                                                                                value={values.frame}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        {/* Links */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Link 1</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="link1"
                                                                                placeholder="Enter link 1"
                                                                                value={values.link1}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>


                                                                        <Col lg={6} className="mb-3">

                                                                            <Label>Art Image <span className="text-danger">*</span></Label><br />
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary text-light mb-3 "
                                                                                onClick={() => {
                                                                                    // setValues(initialState);
                                                                                    setShowCrop(true)


                                                                                    // setFileId(Math.random() * 100000);
                                                                                }}
                                                                            >
                                                                                {/* <i class="ri-list-check align-bottom me-1"></i>{" "} */}
                                                                                Upload Images
                                                                            </button>
                                                                            {croppedImages.length > 0 ? (
                                                                                <div>
                                                                                    <div className="uploaded-images">
                                                                                        <img
                                                                                            src={croppedImages}
                                                                                            // alt={`Uploaded np`}
                                                                                            style={{ height: '300px', width: '300px' }}
                                                                                        />
                                                                                    </div>

                                                                                </div>
                                                                            ) : (
                                                                                artImage ? (
                                                                                    <div className="uploaded-images">
                                                                                        <img
                                                                                            src={`${process.env.REACT_APP_API_URL}/${artImage}`}
                                                                                            alt={`Uploaded `}
                                                                                            style={{ height: '300px', width: '300px' }}
                                                                                        />
                                                                                    </div>
                                                                                ) : null
                                                                            )}

                                                                        </Col>
                                                                        {/* Is Active */}
                                                                        <Col lg={6}>

                                                                            <Input
                                                                                type="checkbox"
                                                                                name="isActive"
                                                                                checked={values.isActive}
                                                                                onChange={handlecheck}
                                                                            />
                                                                            <Label className="form-check-label">Is Active</Label>

                                                                        </Col>

                                                                        {/* Submit and Cancel */}
                                                                        {loading && 
                                                                            <div className="d-flex justify-content-center mx-2 mt-2">
                                                                            <Spinner color="primary"> Loading... </Spinner>
                                                                        </div>
                                                                        }

                                                                    </Row>
                                                                    <Row>
                                                                        <FormsFooter
                                                                            handleSubmit={handleUpdate}
                                                                            handleSubmitCancel={handleUpdateCancel}
                                                                        />
                                                                    </Row>
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

            {/* Crop Modal for categoy image*/}
            <Modal
                isOpen={showCrop}
                toggle={() => {
                    tog_showCrop();
                }}
                centered
            >
                <ModalHeader
                    className="bg-light p-3"
                    toggle={() => {
                        setShowCrop(false);
                    }}
                >
                    Upload Image
                </ModalHeader>
                <form>
                    <ModalBody>
                        <Col >
                            <Label className="form-label">Gallery Image</Label>
                            <div className="mb-3">

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
                    </ModalBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button className="btn btn-primary text-light" type="button" onClick={handleSaveCroppedImage}>
                                Save Cropped Image
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    setShowCrop(false)
                                    setImgSrc("")
                                    setImages([])
                                    // setCroppedImages([])
                                    // setCompletedCrop([])
                                    // setCroppedBlobs([])
                                    setShowCrop(false)
                                    // setGalleryImages([])

                                }
                                }
                            >
                                Close
                            </button>
                        </div>
                    </ModalFooter>
                </form>

            </Modal>



        </React.Fragment>
    );
};

export default ArtPiece;
