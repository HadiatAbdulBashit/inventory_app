import axios from "axios";
import { useEffect, useState } from "react";
import Select from 'react-select'

const TransactionForm = (
    {
        onFormSubmit,
        initialData,
        register,
        handleSubmit,
        errors,
        setValue,
        clearErrors
    }
) => {
    const [optionsItem, setOptionsItem] = useState([]);
    const [optionsItemDetail, setOptionsItemDetail] = useState([]);
    const [maxItem, setMaxItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemDetail, setSelectedItemDetail] = useState(null);
    const [selectedItemDetailId, setSelectedItemDetailId] = useState('');

    const selectItem = async(selectedOption) => {
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
        clearErrors(["itemDetailId", "totalItem "])
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
            const response = await axios.get(`/api/item-detail?itemId=${id}`);

            const optionsArray = response.data.map(item => ({
                value: item.id,
                label: item.unit,
                stock: item.stock
            }));

            setOptionsItemDetail(optionsArray);
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
        if (initialData) {
            setValue("item", initialData.item);
            setValue("totalItem", initialData.totalItem);
        }
        getItem()
    }, [initialData])

    return (
        <form className="row shadow p-4 rounded-3 align-items-end" onSubmit={handleSubmit(onSubmit)}>
            <div className={'col-4'}>
                <label className="form-label">Item</label>
                <Select
                    options={optionsItem}
                    onChange={(selectedOption) => selectItem(selectedOption)}
                    placeholder={`Select item`}
                    value={selectedItem}
                />
            </div>
            <div className={'col-3'}>
                <label className="form-label">Unit {maxItem === null ? null : <span className="badge bg-primary bg-light text-dark">Stock: {maxItem}</span>}</label>
                <Select
                    options={optionsItemDetail}
                    isDisabled={optionsItemDetail.length === 0 ? true : false}
                    onChange={(selectedOption) => selectItemDetail(selectedOption)}
                    placeholder={`Select Unit`}
                    value={selectedItemDetail}
                />
                <input
                    {...register('itemDetailId', { required: 'Unit is Require' })}
                    type={'hidden'}
                    value={selectedItemDetailId}
                    className='form-control'
                />
            </div>
            <div className="col-3">
                <label className="form-label">Total Item</label>
                <input
                    {...register('totalItem', { required: 'Total Item is Require', min: { value: 1, message: 'Min 1 item' }, max: { value: maxItem, message: `Max ${maxItem} Item` } })}
                    type={'number'}
                    min={0}
                    max={maxItem}
                    disabled={optionsItemDetail.length === 0 ? true : false}
                    className={"form-control " + (errors.totalItem && errors.totalItem.message ? 'is-invalid' : null)}
                />
            </div>
            <div className="col-2 align-self-bottom">
                <button className="btn btn-primary" type="submit">Add Item</button>
            </div>
            <div className={'col-4'}>
                <div className="invalid-feedback">
                    {errors.item && errors.item.message}
                </div>
            </div>
            <div className={'col-3'}>
                {
                    errors.itemDetailId && errors.itemDetailId.message && selectedItemDetailId === '' ? (
                        <div className="invalid-feedback d-block">
                            {errors.itemDetailId && errors.itemDetailId.message}
                        </div>
                    ) : null
                }
            </div>
            <div className="col-3">
                <div className="invalid-feedback d-block">
                    {errors.totalItem && errors.totalItem.message}
                </div>
            </div>
        </form>
    )
}

export default TransactionForm