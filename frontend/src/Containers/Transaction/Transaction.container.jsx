import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'
import moment from "moment";
import { useForm } from "react-hook-form";

import formatRupiah from "../../Utils/formatRupiah";

import TransactionDetailForm from "../../Components/TransactionDetailForm/TransactionDetailForm.component";

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [initialData, setInitialData] = useState(null)
  const [formItemStatus, setFormItemStatus] = useState('Add Item')
  const [showFormItem, setShowFormItem] = useState(false)
  const [showFormReturn, setShowFormReturn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors
  } = useForm()

  const getTransactionById = async () => {
    try {
      const response = await axios.get(`/api/transaction/${id}`);
      setTransaction(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const getTransactionDetail = async () => {
    const response = await axios.get(`/api/transaction-detail?transactionId=${id}`);
    setTransactionDetails(response.data);
    setIsLoading(false)
  };

  const getSelectedTransactionDetail = async (transactionDetailId) => {
    const response = await axios.get(`/api/transaction-detail/${transactionDetailId}`);
    setInitialData({
      totalItem: response.data.totalItem,
      itemDetailId: response.data.itemDetailId,
      transactionDetailId: transactionDetailId
    });
  };

  useEffect(() => {
    setIsLoading(true)
    getTransactionById();
    getTransactionDetail();
  }, []);

  const deleteTransaction = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await toast.promise(axios.delete(`/api/transaction/${transactionId}`), {
          pending: 'Delete transaction...',
          success: 'Transaction Deleted',
          error: 'Delete transaction failed'
        });
        navigate("/dashboard/transaction");
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the transaction.",
        icon: "error"
      });
    }
  };

  const deleteTransactionDetail = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await toast.promise(axios.delete(`/api/transaction-detail/${transactionId}`), {
          pending: 'Delete transaction...',
          success: 'Transaction Deleted',
          error: 'Delete transaction failed'
        });
        getTransactionDetail();
        getTransactionById()
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while update the transaction.",
        icon: "error"
      });
    }
  };

  const readyToCheckTransaction = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This transaction will continue to next step!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
      });

      if (result.isConfirmed) {
        await toast.promise(axios.put(`/api/transaction/${transactionId}`, { status: 'Ready to Check' }), {
          pending: 'Update transaction...',
          success: 'Transaction Updated',
          error: 'Update transaction failed'
        });
        getTransactionById(transaction.id)
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the transaction.",
        icon: "error"
      });
    }
  };

  const checkTransaction = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be POC from warehouse in this transaction!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
      });

      if (result.isConfirmed) {
        await toast.promise(axios.put(`/api/transaction/${transactionId}`, { status: 'On Check' }), {
          pending: 'Update transaction...',
          success: 'Transaction Updated',
          error: 'Update transaction failed'
        });
        getTransactionById(transaction.id)
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while update the transaction.",
        icon: "error"
      });
    }
  };

  const editTransactionDetail = async (transactionDetailId) => {
    getSelectedTransactionDetail(transactionDetailId)
    setFormItemStatus('Edit Item')
    setShowFormItem(true)
  };

  const saveDetailTransaction = async (data) => {
    try {
      await axios.post("/api/transaction-detail", data);
      reset();
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const editDetailTransaction = async (id, data) => {
    try {
      await axios.put(`/api/transaction-detail/${id}`, data);
      reset();
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const submitFormTransactionDetail = async (data) => {
    data.transactionId = id
    await toast.promise(
      initialData ? editDetailTransaction(initialData.transactionDetailId, data) : saveDetailTransaction(data),
      {
        pending: initialData ? 'Editing' : 'Adding' + ' item...',
        success: 'Item ' + initialData ? 'Edited' : 'Added',
        error: initialData ? 'Editing' : 'Adding' + ' item failed'
      }
    )
    setShowFormItem(false)
    getTransactionDetail()
    getTransactionById()
  };

  const onButtonAddClick = () => {
    setFormItemStatus('Add Item')
    reset();
    setInitialData(null)
    setShowFormItem(true)
  }

  const onButtonCloseClick = () => {
    setShowFormItem(false)
    reset();
    setInitialData(null)
  }

  return (
    <div className="container my-5">
      <div className="row shadow p-4 mx-3 rounded-3">
        {
          isLoading ? (
            <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="col-12">
                <div>
                  <h2>
                    {transaction.type === 'In' ? 'Purchase from' : 'Sale to'} {transaction.secondParty} <span className="badge bg-primary bg-light text-dark">{transaction.status}</span>
                  </h2>
                  <p>
                    Total Price: {formatRupiah(transaction.totalPrice || 0)}
                  </p>
                  <p>
                    Order Date: {moment(transaction.createdAt).format('LLLL')}
                  </p>
                  <p>
                    POC Office: {transaction.userOffice?.name || 0}
                  </p>
                  {
                    transaction.userWarehouse ? (
                      <p>
                        POC Warehouse: {transaction.userWarehouse?.name}
                      </p>
                    ) : null
                  }
                  <Link to={`edit`} className="btn btn-primary me-1">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="btn btn-danger me-1"
                  >
                    Delete
                  </button>
                  {
                    showFormItem === false && transaction.status === 'Inisialization' ? (
                      <button className="btn btn-primary me-1" onClick={() => onButtonAddClick()}>
                        Add Item
                      </button>
                    ) : null
                  }
                  {
                    transaction.status === 'Inisialization' && transactionDetails.length !== 0 ? (
                      <button
                        onClick={() => readyToCheckTransaction(transaction.id)}
                        className="btn btn-success"
                      >
                        Ready to Check
                      </button>
                    ) : null
                  }
                  {
                    transaction.status === 'Ready to Check' ? (
                      <button
                        onClick={() => checkTransaction(transaction.id)}
                        className="btn btn-success"
                      >
                        Check
                      </button>
                    ) : null
                  }
                </div>

                {/* Items / Detail Transaction */}
                <h2 className="mt-4">Items</h2>
                <div className="panel-body table-responsive shadow mt-4 rounded-4">
                  <div className={"collapse " + (showFormItem ? 'show' : null)} id="formDetailTransaction">
                    <TransactionDetailForm
                      onFormSubmit={submitFormTransactionDetail}
                      register={register}
                      handleSubmit={handleSubmit}
                      errors={errors}
                      setValue={setValue}
                      initialData={initialData}
                      clearErrors={clearErrors}
                      title={formItemStatus}
                      onButtonCloseClick={onButtonCloseClick}
                    />
                  </div>
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Item Name</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Total Item</th>
                        <th scope="col">Price</th>
                        {
                          transaction.status === 'Inisialization' || transaction.status === 'On Check' ? (
                            <th scope="col">Action</th>
                          ) : null
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactionDetails.length === 0 ? (
                          <tr>
                            <td colSpan="5" align="center" height='200px'>
                              <h1>
                                No Data
                              </h1>
                            </td>
                          </tr>
                        ) : (
                          transactionDetails.map((transactionDetail) => (
                            <tr key={transactionDetail.id}>
                              <td>{`${transactionDetail.itemDetail.item.merk} ${transactionDetail.itemDetail.item.name}`}</td>
                              <td>{transactionDetail.itemDetail.unit}</td>
                              <td>{transactionDetail.totalItem}</td>
                              <td>{formatRupiah((transactionDetail.itemDetail.price * transactionDetail.totalItem) || 0)}</td>
                              {
                                transaction.status === 'Inisialization' ? (
                                  <td>
                                    <button
                                      onClick={() => editTransactionDetail(transactionDetail.id)}
                                      className="btn btn-primary me-1"
                                      disabled={showFormItem ?? false}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-danger"
                                      disabled={showFormItem ?? false}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                ) : null
                              }
                              {
                                transaction.status === 'On Check' ? (
                                  <td>
                                    <button
                                      onClick={() => editTransactionDetail(transactionDetail.id)}
                                      className="btn btn-primary me-1"
                                      disabled={showFormItem ?? false}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-warning me-1"
                                      disabled={showFormItem ?? false}
                                    >
                                      Return
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-danger"
                                      disabled={showFormItem ?? false}
                                    >
                                      Cancel
                                    </button>
                                  </td>
                                ) : null
                              }
                            </tr>
                          ))
                        )
                      }
                    </tbody>
                  </table>
                </div>


                {/* Return Item on Transaction */}
                {/* <h2 className="mt-4">Return</h2>
                <div className="panel-body table-responsive shadow mt-4 rounded-4">
                  <div className={"collapse " + (showFormReturn ? 'show' : null)} id="formDetailTransaction">
                    <TransactionDetailForm
                      onFormSubmit={submitFormTransactionDetail}
                      register={register}
                      handleSubmit={handleSubmit}
                      errors={errors}
                      setValue={setValue}
                      initialData={initialData}
                      clearErrors={clearErrors}
                      title={formItemStatus}
                      onButtonCloseClick={onButtonCloseClick}
                    />
                  </div>
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Item Name</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Total Item</th>
                        <th scope="col">Price</th>
                        {
                          transaction.status === 'Inisialization' || transaction.status === 'On Check' ? (
                            <th scope="col">Action</th>
                          ) : null
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactionDetails.length === 0 ? (
                          <tr>
                            <td colSpan="5" align="center" height='200px'>
                              <h1>
                                No Data
                              </h1>
                            </td>
                          </tr>
                        ) : (
                          transactionDetails.map((transactionDetail) => (
                            <tr key={transactionDetail.id}>
                              <td>{`${transactionDetail.itemDetail.item.merk} ${transactionDetail.itemDetail.item.name}`}</td>
                              <td>{transactionDetail.itemDetail.unit}</td>
                              <td>{transactionDetail.totalItem}</td>
                              <td>{formatRupiah((transactionDetail.itemDetail.price * transactionDetail.totalItem) || 0)}</td>
                              {
                                transaction.status === 'Inisialization' ? (
                                  <td>
                                    <button
                                      onClick={() => editTransactionDetail(transactionDetail.id)}
                                      className="btn btn-primary me-1"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-danger"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                ) : null
                              }
                              {
                                transaction.status === 'On Check' ? (
                                  <td>
                                    <button
                                      onClick={() => editTransactionDetail(transactionDetail.id)}
                                      className="btn btn-primary me-1"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-warning me-1"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Return
                                    </button>
                                    <button
                                      onClick={() => deleteTransactionDetail(transactionDetail.id)}
                                      className="btn btn-danger"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Cancel
                                    </button>
                                  </td>
                                ) : null
                              }
                            </tr>
                          ))
                        )
                      }
                    </tbody>
                  </table>
                </div> */}
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Transaction;
