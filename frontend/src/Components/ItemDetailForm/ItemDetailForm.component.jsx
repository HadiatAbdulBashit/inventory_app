import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ItemForm = ({ onFormSubmit, initialData, title }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        if (initialData) {
            setValue("unit", initialData.unit);
            setValue("stock", initialData.stock);
            setValue("price", initialData.price);
        }
    }, [initialData])

    return (
        <form className="col-6 g-3" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-3">
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
                <label className="form-label">Price</label>
                <input
                    {...register('price', { required: 'Price is Require' })}
                    type="text"
                    className={"form-control " + (errors.price && errors.price.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.price && errors.price.message}
                </div>
            </div>
            <div className="col-12">
                <button className="btn btn-primary" type="submit">{title}</button>
            </div>
        </form>
    )
}

export default ItemForm