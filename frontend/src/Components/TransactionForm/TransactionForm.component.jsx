import { useEffect } from "react";
import { useForm } from "react-hook-form";

const TransactionForm = ({ onFormSubmit, initialData, title, secondParty }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        if (initialData) {
            setValue("secondParty", initialData.secondParty);
            setValue("totalPrice", initialData.totalPrice);
        }
    }, [initialData])

    return (
        <form className="row g-3 shadow p-4 rounded-3" onSubmit={handleSubmit(onFormSubmit)}>
            <div className={"mb-3 " + title === 'Add Sale' ? 'col-6' : 'col-12'}>
                <label className="form-label">{secondParty}</label>
                <input
                    {...register('secondParty', { required: `${secondParty} is Require` })}
                    type="text"
                    className={"form-control " + (errors.secondParty && errors.secondParty.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.secondParty && errors.secondParty.message}
                </div>
            </div>
            {
                title === 'Add Sale' ? null : (
                    <div className="mb-3 col-6">
                        <label className="form-label">Total Price</label>
                        <input
                            {...register('totalPrice', { required: 'Total Price is Require' })}
                            type="text"
                            className={"form-control " + (errors.totalPrice && errors.totalPrice.message ? 'is-invalid' : null)}
                        />
                        <div className="invalid-feedback">
                            {errors.totalPrice && errors.totalPrice.message}
                        </div>
                    </div>
                )
            }
            <div className="col-12">
                <button className="btn btn-primary" type="submit">{title}</button>
            </div>
        </form>
    )
}

export default TransactionForm