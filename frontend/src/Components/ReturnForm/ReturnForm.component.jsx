import axios from "axios";
import { useEffect, useState } from "react";

import formatRupiah from "../../Utils/formatRupiah";

const ReturnForm = (
    {
        onFormSubmit,
        initialData,
        register,
        handleSubmit,
        errors,
        setValue,
        clearErrors,
        title,
        onButtonCloseClick
    }
) => {
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onSubmit = async (data) => {
        data.transactionDetailId = initialData.detailTransactionId
        await onFormSubmit(data)
        resetForm()
    }

    useEffect(() => {
        resetForm()
        if (initialData) {
            getSelectedTransactionDetail(initialData.detailTransactionId)
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
                        max: { value: selectedTransactionDetail?.totalItem || 0, message: `Max ${selectedTransactionDetail?.totalItem || 0} Item` } })}
                    type={'number'}
                    max={selectedTransactionDetail?.totalItem}
                    min={1}
                    // disabled={true}
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