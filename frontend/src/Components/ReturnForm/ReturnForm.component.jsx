import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import formatRupiah from "../../Utils/formatRupiah";

const ReturnForm = ({
    onFormSubmit,
    initialData,
    title,
    onButtonCloseClick
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors
    } = useForm()

    const [selectedTransactionDetail, setSelectedTransactionDetail] = useState(null);

    const resetForm = () => {
        setValue("description", null);
        setValue("totalItem", null)
        clearErrors(["totalItem", "description"])
        setSelectedTransactionDetail(null)
    };

    const getSelectedTransactionDetail = async (id) => {
        try {
            const response = await axios.get(`/api/transaction-detail/${id}`);
            setSelectedTransactionDetail(response.data)
            if (initialData.type === 'Cancel') {
                setValue("totalItem", response.data.totalItem)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onSubmit = async (data) => {
        data.transactionDetailId = initialData.detailTransactionId
        await onFormSubmit(data)
        resetForm()
        onButtonCloseClick()
    }

    useEffect(() => {
        resetForm()
        if (initialData) {
            getSelectedTransactionDetail(initialData.detailTransactionId)
            if (initialData.totalItem) {
                setValue('totalItem', initialData.totalItem)
                setValue('description', initialData.description)
            }
        }
    }, [initialData])

    return (
        <form className="row gy-3 shadow p-4 rounded-3 align-items-end mx-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between">
                <h2>{title}</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => onButtonCloseClick()} />
            </div>
            <div className={'col-5'}>
                <label className="form-label">Item Name</label>
                <input
                    type={'text'}
                    value={selectedTransactionDetail?.itemDetail?.item?.name || 0}
                    disabled={true}
                    className='form-control'
                />
            </div>
            <div className={'col-2'}>
                <label className="form-label">Unit</label>

                <input
                    type={'text'}
                    value={selectedTransactionDetail?.itemDetail?.unit || 0}
                    disabled={true}
                    className='form-control'
                />
            </div>
            <div className="col-2">
                <label className="form-label">Total Item</label>
                <input
                    type={'number'}
                    value={selectedTransactionDetail?.totalItem}
                    disabled={true}
                    className={"form-control"}
                />
            </div>
            <div className="col-3">
                <label className="form-label">Price</label>
                <input
                    type={'text'}
                    value={formatRupiah(selectedTransactionDetail?.itemDetail?.price * selectedTransactionDetail?.totalItem || 0)}
                    disabled={true}
                    className={"form-control"}
                />
            </div>
            <div className="col-2">
                <label className="form-label">Total Return Item</label>
                <input
                    {...register('totalItem', {
                        required: 'Total Item is Require',
                        min: { value: 1, message: 'Min 1 item' },
                        max: { value: initialData?.type === 'Cancel' ? selectedTransactionDetail?.totalItem : selectedTransactionDetail?.totalItem - 1 || 0, message: `Max ${selectedTransactionDetail?.totalItem - 1 || 0} Item` }
                    })}
                    type={'number'}
                    max={selectedTransactionDetail?.totalItem - 1}
                    min={1}
                    disabled={initialData?.type === 'Cancel' ?? false}
                    className={"form-control " + (errors.totalItem && errors.totalItem.message ? 'is-invalid' : null)}
                />
            </div>
            <div className="col-8">
                <label className="form-label">Description</label>
                <input
                    {...register('description', { required: 'Description is Require' })}
                    type={'text'}
                    className={"form-control " + (errors.description && errors.description.message ? 'is-invalid' : null)}
                />
            </div>
            <div className="col-2 align-self-bottom">
                <button className="btn btn-primary" type="submit">{title}</button>
            </div>
            <div className="col-2">
                <div className="invalid-feedback d-block">
                    {errors.totalItem && errors.totalItem.message}
                </div>
            </div>
            <div className="col-8">
                <div className="invalid-feedback d-block">
                    {errors.description && errors.description.message}
                </div>
            </div>
        </form>
    )
}

export default ReturnForm