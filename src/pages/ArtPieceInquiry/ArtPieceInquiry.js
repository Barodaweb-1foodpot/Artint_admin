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

import {
    createInquiry,
    getInquiry,
    removeInquiry,
    updateInquiry,
} from "../../functions/ArtPieceInquiry/ArtPieceInquiry";
import { listCategory } from "../../functions/Category/CategoryMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { toast, ToastContainer } from "react-toastify";

import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";



let ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;


const ArtPieceInquiry = () => {
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);
    const [_id, set_Id] = useState("");

    const initialState = {
        artName: "",         
        name: "", 
        email:''   ,
        phone:'',
        countryCode:''  ,
        desc:""    ,
        isActive: true,        
               
    };


    const [remove_id, setRemove_id] = useState("");

    //search and pagination state
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [values, setValues] = useState(initialState);

    const {
        artName,         
        name, 
        email,
        phone,
        countryCode,
        desc,
        isActive,        
               
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
            maxWidth: "80px",
        },
        {
            name: "Art Name",
            selector: (row) => row.artNameDetails[0].artName,
            sortable: true,
            sortField: "name",
            minWidth: "150px",
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            sortField: "name",
            minWidth: "150px",
        },
        {
            name: "Email",
            cell: (row) => row.email,
            sortable: true,
            sortField: "Image",
            minWidth: "150px",
        },
        {
            name: "Contact Number",
            cell: (row) => `(${row.countryCode}) ${row.phone}`,
            sortable: true,
            sortField: "Image",
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
                `${process.env.REACT_APP_API_URL}/api/auth/listByparams/Inquiry`,
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

    const validate = (values) => {
        const errors = {};
        if (values.name === "") {
            errors.name = "Art Name is required";
            setErrCN(true);
        }
        if (values.name !== "") {
            setErrCN(false);
        }

        if (values.email === "") {
            errors.email = "Email is required";
            setErrPN(true);
        }




        if (values.artName === "") {
            errors.artName = "ArtName is required";
            setErrPI(true);
        }

        if (values.artName !== "") {
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
 


    const [modal_list, setModalList] = useState(false);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);


    const handleCategoryChange = (e) => {
        const { value } = e.target;

        if (value === "bigImage") {
            ASPECT_RATIO = 42 / 53; // Set aspect ratio for "Big Image"
        } else {
            console.log(value)
            ASPECT_RATIO = 1; // Reset or set a default aspect ratio for other categories
        }

        handleChange(e); // Call your existing handleChange function to update form state
    };
    const handleChange = (e) => {
        console.log(e.target.value)
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [drinkCategories, setDrinkCategories] = useState([]);



    const handleClick = (e) => {
        e.preventDefault();
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);
        console.log(croppedImages)
        console.log(values)
        if (Object.keys(errors).length === 0) {
            const formdata = new FormData();

           
      


            createInquiry(values)
                .then((res) => {
                    if (res.isOk) {
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

 
    const handleDelete = (e) => {
        e.preventDefault();
        removeInquiry(remove_id)
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

     
   
        updateInquiry(_id, values)
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
        getInquiry(_id)
            .then((res) => {
                setValues({
                    ...values,

                    artName: res.artName,                   
                    name: res.name,                 
                   
                    email: res.email,                       
                    isActive: res.isActive,                 
                    desc: res.desc,                        
                    phone: res.phone,                                 
                    countryCode: res.countryCode,                              
                     

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

    const [temp , settemp] = useState([])
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/list/ArtPiece`).then((res)=>{
            console.log(res)
            let temp = res
            .map((item) => ({
              label: item.artName,
              value: item._id,
            }))
            settemp(temp)
        })
    },[])
    
    const isdCodes = [
        { country: "Afghanistan", code: "+93" },
        { country: "Albania", code: "+355" },
        { country: "Algeria", code: "+213" },
        { country: "Andorra", code: "+376" },
        { country: "Angola", code: "+244" },
        { country: "Antigua and Barbuda", code: "+1" },
        { country: "Argentina", code: "+54" },
        { country: "Armenia", code: "+374" },
        { country: "Australia", code: "+61" },
        { country: "Austria", code: "+43" },
        { country: "Azerbaijan", code: "+994" },
        { country: "Bahamas", code: "+1" },
        { country: "Bahrain", code: "+973" },
        { country: "Bangladesh", code: "+880" },
        { country: "Barbados", code: "+1" },
        { country: "Belarus", code: "+375" },
        { country: "Belgium", code: "+32" },
        { country: "Belize", code: "+501" },
        { country: "Benin", code: "+229" },
        { country: "Bermuda", code: "+1" },
        { country: "Bhutan", code: "+975" },
        { country: "Bolivia", code: "+591" },
        { country: "Bosnia and Herzegovina", code: "+387" },
        { country: "Botswana", code: "+267" },
        { country: "Brazil", code: "+55" },
        { country: "Brunei", code: "+673" },
        { country: "Bulgaria", code: "+359" },
        { country: "Burkina Faso", code: "+226" },
        { country: "Burundi", code: "+257" },
        { country: "Cabo Verde", code: "+238" },
        { country: "Cambodia", code: "+855" },
        { country: "Cameroon", code: "+237" },
        { country: "Canada", code: "+1" },
        { country: "Cayman Islands", code: "+1" },
        { country: "Central African Republic", code: "+236" },
        { country: "Chad", code: "+235" },
        { country: "Chile", code: "+56" },
        { country: "China", code: "+86" },
        { country: "Colombia", code: "+57" },
        { country: "Comoros", code: "+269" },
        { country: "Congo", code: "+242" },
        { country: "Congo, Democratic Republic of the", code: "+243" },
        { country: "Cook Islands", code: "+682" },
        { country: "Costa Rica", code: "+506" },
        { country: "Croatia", code: "+385" },
        { country: "Cuba", code: "+53" },
        { country: "Curaçao", code: "+599" },
        { country: "Cyprus", code: "+357" },
        { country: "Czech Republic", code: "+420" },
        { country: "Denmark", code: "+45" },
        { country: "Djibouti", code: "+253" },
        { country: "Dominica", code: "+1" },
        { country: "Dominican Republic", code: "+1" },
        { country: "Ecuador", code: "+593" },
        { country: "Egypt", code: "+20" },
        { country: "El Salvador", code: "+503" },
        { country: "Equatorial Guinea", code: "+240" },
        { country: "Eritrea", code: "+291" },
        { country: "Estonia", code: "+372" },
        { country: "Eswatini", code: "+268" },
        { country: "Ethiopia", code: "+251" },
        { country: "Falkland Islands", code: "+500" },
        { country: "Faroe Islands", code: "+298" },
        { country: "Fiji", code: "+679" },
        { country: "Finland", code: "+358" },
        { country: "France", code: "+33" },
        { country: "French Guiana", code: "+594" },
        { country: "French Polynesia", code: "+689" },
        { country: "French Southern Territories", code: "+262" },
        { country: "Gabon", code: "+241" },
        { country: "Gambia", code: "+220" },
        { country: "Georgia", code: "+995" },
        { country: "Germany", code: "+49" },
        { country: "Ghana", code: "+233" },
        { country: "Gibraltar", code: "+350" },
        { country: "Greece", code: "+30" },
        { country: "Greenland", code: "+299" },
        { country: "Grenada", code: "+1" },
        { country: "Guadeloupe", code: "+590" },
        { country: "Guam", code: "+1" },
        { country: "Guatemala", code: "+502" },
        { country: "Guernsey", code: "+44" },
        { country: "Guinea", code: "+224" },
        { country: "Guinea-Bissau", code: "+245" },
        { country: "Guyana", code: "+592" },
        { country: "Haiti", code: "+509" },
        { country: "Honduras", code: "+504" },
        { country: "Hong Kong", code: "+852" },
        { country: "Hungary", code: "+36" },
        { country: "Iceland", code: "+354" },
        { country: "India", code: "+91" },
        { country: "Indonesia", code: "+62" },
        { country: "Iran", code: "+98" },
        { country: "Iraq", code: "+964" },
        { country: "Ireland", code: "+353" },
        { country: "Isle of Man", code: "+44" },
        { country: "Israel", code: "+972" },
        { country: "Italy", code: "+39" },
        { country: "Ivory Coast", code: "+225" },
        { country: "Jamaica", code: "+1" },
        { country: "Japan", code: "+81" },
        { country: "Jordan", code: "+962" },
        { country: "Kazakhstan", code: "+7" },
        { country: "Kenya", code: "+254" },
        { country: "Kiribati", code: "+686" },
        { country: "Kuwait", code: "+965" },
        { country: "Kyrgyzstan", code: "+996" },
        { country: "Laos", code: "+856" },
        { country: "Latvia", code: "+371" },
        { country: "Lebanon", code: "+961" },
        { country: "Lesotho", code: "+266" },
        { country: "Liberia", code: "+231" },
        { country: "Libya", code: "+218" },
        { country: "Liechtenstein", code: "+423" },
        { country: "Lithuania", code: "+370" },
        { country: "Luxembourg", code: "+352" },
        { country: "Macau", code: "+853" },
        { country: "Madagascar", code: "+261" },
        { country: "Malawi", code: "+265" },
        { country: "Malaysia", code: "+60" },
        { country: "Maldives", code: "+960" },
        { country: "Mali", code: "+223" },
        { country: "Malta", code: "+356" },
        { country: "Marshall Islands", code: "+692" },
        { country: "Martinique", code: "+596" },
        { country: "Mauritania", code: "+222" },
        { country: "Mauritius", code: "+230" },
        { country: "Mayotte", code: "+262" },
        { country: "Mexico", code: "+52" },
        { country: "Micronesia", code: "+691" },
        { country: "Moldova", code: "+373" },
        { country: "Monaco", code: "+377" },
        { country: "Mongolia", code: "+976" },
        { country: "Montenegro", code: "+382" },
        { country: "Montserrat", code: "+1" },
        { country: "Morocco", code: "+212" },
        { country: "Mozambique", code: "+258" },
        { country: "Myanmar", code: "+95" },
        { country: "Namibia", code: "+264" },
        { country: "Nauru", code: "+674" },
        { country: "Nepal", code: "+977" },
        { country: "Netherlands", code: "+31" },
        { country: "New Caledonia", code: "+687" },
        { country: "New Zealand", code: "+64" },
        { country: "Nicaragua", code: "+505" },
        { country: "Niger", code: "+227" },
        { country: "Nigeria", code: "+234" },
        { country: "Niue", code: "+683" },
        { country: "Norfolk Island", code: "+672" },
        { country: "North Korea", code: "+850" },
        { country: "North Macedonia", code: "+389" },
        { country: "Northern Mariana Islands", code: "+1" },
        { country: "Norway", code: "+47" },
        { country: "Oman", code: "+968" },
        { country: "Pakistan", code: "+92" },
        { country: "Palau", code: "+680" },
        { country: "Palestine", code: "+970" },
        { country: "Panama", code: "+507" },
        { country: "Papua New Guinea", code: "+675" },
        { country: "Paraguay", code: "+595" },
        { country: "Peru", code: "+51" },
        { country: "Philippines", code: "+63" },
        { country: "Poland", code: "+48" },
        { country: "Portugal", code: "+351" },
        { country: "Puerto Rico", code: "+1" },
        { country: "Qatar", code: "+974" },
        { country: "Romania", code: "+40" },
        { country: "Russia", code: "+7" },
        { country: "Rwanda", code: "+250" },
        { country: "Saint Kitts and Nevis", code: "+1" },
        { country: "Saint Lucia", code: "+1" },
        { country: "Saint Vincent and the Grenadines", code: "+1" },
        { country: "Samoa", code: "+685" },
        { country: "San Marino", code: "+378" },
        { country: "Sao Tome and Principe", code: "+239" },
        { country: "Saudi Arabia", code: "+966" },
        { country: "Senegal", code: "+221" },
        { country: "Serbia", code: "+381" },
        { country: "Seychelles", code: "+248" },
        { country: "Sierra Leone", code: "+232" },
        { country: "Singapore", code: "+65" },
        { country: "Sint Maarten", code: "+1" },
        { country: "Slovakia", code: "+421" },
        { country: "Slovenia", code: "+386" },
        { country: "Solomon Islands", code: "+677" },
        { country: "Somalia", code: "+252" },
        { country: "South Africa", code: "+27" },
        { country: "South Korea", code: "+82" },
        { country: "South Sudan", code: "+211" },
        { country: "Spain", code: "+34" },
        { country: "Sri Lanka", code: "+94" },
        { country: "Sudan", code: "+249" },
        { country: "Suriname", code: "+597" },
        { country: "Sweden", code: "+46" },
        { country: "Switzerland", code: "+41" },
        { country: "Syria", code: "+963" },
        { country: "Taiwan", code: "+886" },
        { country: "Tajikistan", code: "+992" },
        { country: "Tanzania", code: "+255" },
        { country: "Thailand", code: "+66" },
        { country: "Timor-Leste", code: "+670" },
        { country: "Togo", code: "+228" },
        { country: "Tokelau", code: "+690" },
        { country: "Tonga", code: "+676" },
        { country: "Trinidad and Tobago", code: "+1" },
        { country: "Tunisia", code: "+216" },
        { country: "Turkey", code: "+90" },
        { country: "Turkmenistan", code: "+993" },
        { country: "Turks and Caicos Islands", code: "+1" },
        { country: "Tuvalu", code: "+688" },
        { country: "Uganda", code: "+256" },
        { country: "Ukraine", code: "+380" },
        { country: "United Arab Emirates", code: "+971" },
        { country: "United Kingdom", code: "+44" },
        { country: "United States", code: "+1" },
        { country: "Uruguay", code: "+598" },
        { country: "Uzbekistan", code: "+998" },
        { country: "Vanuatu", code: "+678" },
        { country: "Vatican City", code: "+39" },
        { country: "Venezuela", code: "+58" },
        { country: "Vietnam", code: "+84" },
        { country: "Yemen", code: "+967" },
        { country: "Zambia", code: "+260" },
        { country: "Zimbabwe", code: "+263" },
      ];

    document.title = "Inquiry | ArtTint";

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        // maintitle="Product Master"
                        title="Inquiry Master"
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
                                                                {/* <div>
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
                                                                </div> */}
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
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Name <span className="text-danger">*</span></Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="name"
                                                                                placeholder="Enter  name"
                                                                                required
                                                                                value={values.name}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.name}</p>}

                                                                        </Col>

                                                                        {/* Art Name */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>email <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="email"
                                                                                name="email"
                                                                                placeholder="Enter Email"
                                                                                required
                                                                                value={values.email}
                                                                                onChange={handleChange}
                                                                            />

                                                                            {isSubmit && <p className="text-danger">{formErrors.email}</p>}

                                                                        </Col>
                                                                       
                                                                        {/* Category (Dropdown) */}
                                                                            <Col lg={4} className="mb-3">
                                                                                <Label>Country Code </Label>
                                                                                <Input
                                                                                    type="select"
                                                                                    name="countryCode"
                                                                                    required
                                                                                    value={values.countryCode}
                                                                                    onChange={handleChange}
                                                                                >
                                                                                    <option value="">Select County Code</option>
                                                                                    {isdCodes.map((items) => (
                                                                                        <option value={items.code} key={items.code} >({items.code}){items.country}</option>)
                                                                                    )}



                                                                                </Input>
                                                                            

                                                                            </Col>



                                                                        {/* Price */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Phone </Label>
                                                                            <Input
                                                                                type="number"
                                                                                name="phone"
                                                                                placeholder="Enter Phone"
                                                                                required
                                                                                value={values.phone}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Art Piece Name</Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="artName"
                                                                                required
                                                                                value={values.artName}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value="">Select Art Name</option>
                                                                                {temp.map((items) => (
                                                                                    <option value={items.value} key={items.value} >{items.label}</option>)
                                                                                )}



                                                                            </Input>
                                                                          

                                                                        </Col>

                                                                        <Col lg={12} className="mb-3">
                                                                            <Label>Description </Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="desc"
                                                                                placeholder="Enter Description"
                                                                                required
                                                                                value={values.desc}
                                                                                onChange={handleChange}
                                                                            /></Col>
                                                                      
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
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>Name <span className="text-danger">*</span></Label>

                                                                            <Input
                                                                                type="text"
                                                                                name="name"
                                                                                placeholder="Enter  name"
                                                                                disabled
                                                                                value={values.name}
                                                                                onChange={handleChange}
                                                                            />
                                                                            {isSubmit && <p className="text-danger">{formErrors.name}</p>}

                                                                        </Col>

                                                                        {/* Art Name */}
                                                                        <Col lg={6} className="mb-3">
                                                                            <Label>email <span className="text-danger">*</span></Label>
                                                                            <Input
                                                                                type="email"
                                                                                name="email"
                                                                                placeholder="Enter Email"
                                                                                disabled
                                                                                value={values.email}
                                                                                onChange={handleChange}
                                                                            />

                                                                            {isSubmit && <p className="text-danger">{formErrors.email}</p>}

                                                                        </Col>
                                                                       
                                                                        {/* Category (Dropdown) */}
                                                                            <Col lg={4} className="mb-3">
                                                                                <Label>Country Code </Label>
                                                                                <Input
                                                                                    type="select"
                                                                                    name="countryCode"
                                                                                    disabled
                                                                                    value={values.countryCode}
                                                                                    onChange={handleChange}
                                                                                >
                                                                                    <option value="">Select Country Code</option>
                                                                                    {isdCodes.map((items) => (
                                                                                        <option value={items.code} key={items.code} >({items.code}){items.country}</option>)
                                                                                    )}



                                                                                </Input>
                                                                            

                                                                            </Col>



                                                                        {/* Price */}
                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Phone </Label>
                                                                            <Input
                                                                                type="number"
                                                                                name="phone"
                                                                                placeholder="Enter Phone"
                                                                                disabled
                                                                                value={values.phone}
                                                                                onChange={handleChange}
                                                                            />


                                                                        </Col>

                                                                        <Col lg={4} className="mb-3">
                                                                            <Label>Art Piece Name</Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="artname"
                                                                                disabled
                                                                                value={values.artName}
                                                                                onChange={handleChange}
                                                                            >
                                                                                <option value="">Select Art Name</option>
                                                                                {temp.map((items) => (
                                                                                    <option value={items.value} key={items.value} >{items.label}</option>)
                                                                                )}



                                                                            </Input>
                                                                          

                                                                        </Col>

                                                                        <Col lg={12} className="mb-3">
                                                                            <Label>Description </Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="desc"
                                                                                placeholder="Enter Description"
                                                                                disabled
                                                                                value={values.desc}
                                                                                onChange={handleChange}
                                                                            /></Col>
                                                                      
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

export default ArtPieceInquiry;
