import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [preview, setPreview] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const loadImage = (e) => {
        const image = e.target.files[0];
        setPreview(URL.createObjectURL(image));
    };

    const saveProduct = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("unit", data.unit);
        formData.append("image", data.image[0]);
        try {
            await axios.post("/api/item", formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            navigate("/dashboard/item");
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container my-5">
            <form className="row g-3" onSubmit={handleSubmit(saveProduct)}>
                <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                        {...register('name', { required: 'Name is Require' })}
                        type="text"
                        className={"form-control " + (errors.name && errors.name.message ? 'is-invalid' : null)}
                    />
                    <div className="invalid-feedback">
                        {errors.name && errors.name.message}
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Unit</label>
                    <input
                        {...register('unit', { required: 'Unit is Require' })}
                        type="text"
                        className={"form-control " + (errors.unit && errors.unit.message ? 'is-invalid' : null)}
                    />
                    <div className="invalid-feedback">
                        {errors.unit && errors.unit.message}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                        {...register('image', { required: 'Image is Require' })}
                        type="file"
                        className={"form-control " + (errors.image && errors.image.message ? 'is-invalid' : null)}
                        onChange={loadImage}
                    />
                    <div className="invalid-feedback">
                        {errors.image && errors.image.message}
                    </div>

                    {preview ? (
                        <figure className="pt-5">
                            <img src={preview} alt="Preview Image" className="img-fluid" style={{ maxWidth: '300px' }} />
                        </figure>
                    ) : (
                        null
                    )}

                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Add Item</button>
                </div>
            </form>
        </div >
    );
};

export default AddProduct;
