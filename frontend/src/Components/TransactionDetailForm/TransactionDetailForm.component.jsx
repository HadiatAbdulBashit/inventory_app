import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from 'react-select'

const TransactionDetailForm = ({
    onFormSubmit,
    initialData,
    title,
    onButtonCloseClick,
    type
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors
    } = useForm()

    const [optionsItem, setOptionsItem] = useState([]);
    const [optionsItemDetail, setOptionsItemDetail] = useState([]);
    const [maxItem, setMaxItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemDetail, setSelectedItemDetail] = useState(null);
    const [selectedItemDetailId, setSelectedItemDetailId] = useState('');

    const selectItem = async (selectedOption) => {
        setSelectedItem(selectedOption);
        await getItemDetail(selectedOption.value)
        setSelectedItemDetail(null);
        setMaxItem(null)
    };

    const selectItemDetail = async (data) => {
        setSelectedItemDetailId(data.value)
        setValue("itemDetailId", selectedItemDetailId);
        setValue("totalItem", null)
        setMaxItem(data.stock)
        setSelectedItemDetail(data)
    }

    const resetForm = () => {
        setSelectedItem(null);
        setSelectedItemDetail(null);
        setMaxItem(null)
        setValue("itemDetailId", null);
        setValue("totalItem", null)
        setOptionsItemDetail([])
        setSelectedItemDetailId('')
        clearErrors("totalItem")
    };

    const getItem = async () => {
        try {
            const response = await axios.get(`/api/item/list`);

            const optionsArray = response.data.map(item => ({
                value: item.id,
                label: item.merk + ' ' + item.name,
            }));

            setOptionsItem(optionsArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const getItemDetail = async (id) => {
        try {
            const response = await axios.get(`/api/item-detail/list?itemId=${id}`);

            const optionsArray = response.data.map(item => ({
                value: item.id,
                label: item.unit,
                stock: item.stock
            }));

            setOptionsItemDetail(optionsArray);
            if (initialData) {
                const selectedOptionsArray = optionsArray.find((data) => initialData.itemDetailId === data.value)
                setSelectedItemDetail(selectedOptionsArray);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getOneItemDetail = async (id) => {
        try {
            const response = await axios.get(`/api/item-detail/${id}`);
            await getItemDetail(response.data.itemId)
            setMaxItem(initialData ? response.data.stock + initialData.totalItem : response.data.stock)
            if (initialData) {
                const selectedOptionsArray = optionsItem.find((data) => response.data.itemId === data.value)
                setSelectedItem(selectedOptionsArray);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onSubmit = async (data) => {
        data.itemDetailId = selectedItemDetailId
        await onFormSubmit(data)
        resetForm()
    }

    useEffect(() => {
        resetForm()
        if (initialData) {
            setSelectedItemDetailId(initialData.itemDetailId);
            setValue("totalItem", initialData.totalItem);
            getOneItemDetail(initialData.itemDetailId)
        }
        getItem()
    }, [initialData])

    const onCloseClick = () => {
        resetForm()
        onButtonCloseClick()
    }

    const validationStock = type === 'Out' ? { value: maxItem, message: `Max ${maxItem} Item` } : null

    return (
        <form className="row shadow p-4 rounded-3 align-items-end mx-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between">
                <h2>{title}</h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => onCloseClick()} />
            </div>
            <div className={'col-4'}>
                <label className="form-label">Item</label>
                <Select
                    options={optionsItem}
                    onChange={(selectedOption) => selectItem(selectedOption)}
                    isDisabled={initialData ? true : false}
                    placeholder={`Select item`}
                    value={selectedItem}
                />
            </div>
            <div className={'col-3'}>
                <label className="form-label">Unit {maxItem === null || type === 'In' ? null : <span className="badge bg-light text-dark">Stock: {maxItem}</span>}</label>
                <Select
                    options={optionsItemDetail}
                    isDisabled={optionsItemDetail.length === 0 || initialData ? true : false}
                    onChange={(selectedOption) => selectItemDetail(selectedOption)}
                    placeholder={`Select Unit`}
                    value={selectedItemDetail}
                />
                <input
                    // {...register('itemDetailId', { required: 'Unit is Require' })}
                    type={'hidden'}
                    value={selectedItemDetailId}
                    className='form-control'
                />
            </div>
            <div className="col-3">
                <label className="form-label">Total Item</label>
                <input
                    {...register('totalItem', { required: 'Total Item is Require', min: { value: 1, message: 'Min 1 item' }, max: validationStock })}
                    type={'number'}
                    min={0}
                    max={type === 'Out' ? maxItem : null}
                    disabled={selectedItemDetail === null ? true : false}
                    className={"form-control" + (errors.totalItem && errors.totalItem.message ? ' is-invalid' : '')}
                />
            </div>
            <div className="col-2 align-self-bottom">
                <button className="btn btn-primary" type="submit">{title}</button>
            </div>
            <div className={'col-7'}>
                {/* {
                    selectedItemDetailId === null ? (
                        <div className="invalid-feedback d-block">
                            Item is Require
                        </div>
                    ) : null
                } */}
            </div>
            <div className="col-3">
                <div className="invalid-feedback d-block">
                    {errors.totalItem && errors.totalItem.message}
                </div>
            </div>
        </form>
    )
}

export default TransactionDetailForm