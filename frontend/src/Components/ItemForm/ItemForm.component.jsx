import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ItemForm = ({ onFormSubmit, initialData }) => {
    const [preview, setPreview] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    const loadImage = (e) => {
        const image = e.target.files[0];
        setPreview(URL.createObjectURL(image));
    };

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name);
            setPreview(initialData.imageUrl)
        }
    }, [initialData])

    return (
        <form className="col-6 g-3" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-3">
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
            <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                    {...register('image')}
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
                <button className="btn btn-primary" type="submit">Edit Item</button>
            </div>
        </form>
    )
}

export default ItemForm