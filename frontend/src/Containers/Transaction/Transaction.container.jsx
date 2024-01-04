import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'
import moment from "moment";

import formatRupiah from "../../Utils/formatRupiah";

import TransactionDetailForm from "../../Components/TransactionDetailForm/TransactionDetailForm.component";
import ReturnForm from "../../Components/ReturnForm/ReturnForm.component";

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [initialDataItem, setInitialDataItem] = useState(null)
  const [initialDataReturn, setInitialDataReturn] = useState(null)
  const [formItemStatus, setFormItemStatus] = useState('Add Item')
  const [formReturnStatus, setFormReturnStatus] = useState('Add Return Item')
  const [showFormItem, setShowFormItem] = useState(false)
  const [showFormReturn, setShowFormReturn] = useState(false)

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

  const getReturnItem = async () => {
    const response = await axios.get(`/api/return?transactionId=${id}`);
    setReturnItems(response.data);
    setIsLoading(false)
  };

  const getSelectedTransactionDetail = async (transactionDetailId) => {
    const response = await axios.get(`/api/transaction-detail/${transactionDetailId}`);
    setInitialDataItem({
      totalItem: response.data.totalItem,
      itemDetailId: response.data.itemDetailId,
      transactionDetailId: transactionDetailId
    });
  };

  const getSelectedReturn = async (returnId, type) => {
    const response = await axios.get(`/api/return/${returnId}`);
    setInitialDataReturn({
      returnId,
      totalItem: response.data.totalItem,
      description: response.data.description,
      detailTransactionId: response.data.transactionDetailId,
      type
    });
  };

  useEffect(() => {
    setIsLoading(true)
    getTransactionById();
    getTransactionDetail();
    getReturnItem();
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

  const deleteReturn = async (returnId) => {
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
        await toast.promise(axios.delete(`/api/return/${returnId}`), {
          pending: 'Delete transaction...',
          success: 'Transaction Deleted',
          error: 'Delete transaction failed'
        });
        getTransactionDetail();
        getReturnItem()
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
  
  const editReturn = async (returnItemId, type) => {
    getSelectedReturn(returnItemId, type)
    setFormReturnStatus('Edit Return Item')
    setShowFormReturn(true)
  };

  const saveDetailTransaction = async (data) => {
    try {
      await axios.post("/api/transaction-detail", data);
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const saveReturn = async (data) => {
    try {
      await axios.post("/api/return", data);
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const editDetailTransaction = async (id, data) => {
    try {
      await axios.put(`/api/transaction-detail/${id}`, data);
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }
  
  const saveEditedReturn = async (id, data) => {
    try {
      await axios.put(`/api/return/${id}`, data);
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const submitFormTransactionDetail = async (data) => {
    data.transactionId = id
    await toast.promise(
      initialDataItem ? editDetailTransaction(initialDataItem.transactionDetailId, data) : saveDetailTransaction(data),
      {
        pending: initialDataItem ? 'Editing' : 'Adding' + ' item...',
        success: 'Item ' + initialDataItem ? 'Edited' : 'Added',
        error: initialDataItem ? 'Editing' : 'Adding' + ' item failed'
      }
    )
    setShowFormItem(false)
    getTransactionDetail()
    getTransactionById()
  };

  const submitFormReturn = async (data) => {
    data.transactionId = id
    await toast.promise(
      initialDataReturn.totalItem ? saveEditedReturn(initialDataReturn.returnId, data) : saveReturn(data),
      {
        pending: initialDataReturn ? 'Editing' : 'Adding' + ' return item...',
        success: 'Return Item ' + initialDataReturn ? 'Edited' : 'Added',
        error: initialDataReturn ? 'Editing' : 'Adding' + ' return item failed'
      }
    )
    setShowFormItem(false)
    getTransactionDetail()
    getTransactionById()
    getReturnItem();
  };

  const onButtonAddItemClick = () => {
    setFormItemStatus('Add Item')
    setInitialDataItem(null)
    setShowFormItem(true)
  }

  const onButtonReturnClick = (detailTransactionId, type) => {
    setFormReturnStatus('Add Return Item')
    setInitialDataReturn({
      detailTransactionId,
      type
    })
    setShowFormReturn(true)
  }

  const onButtonCloseItemClick = () => {
    setShowFormItem(false)
    setInitialDataItem(null)
  }

  const onButtonCloseReturnClick = () => {
    setShowFormReturn(false)
    setInitialDataReturn(null)
  }

  const onButtonUpdateStatusItemClick = (transactionDetailId, statusTransactionDetail) => {
    editDetailTransaction(transactionDetailId, { status: statusTransactionDetail })
    getTransactionDetail()
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
                    Total Transaction Price: {formatRupiah(transaction.totalPrice || 0)}
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
                      <button className="btn btn-primary me-1" onClick={() => onButtonAddItemClick()}>
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
                  {
                    transaction.status === 'On Check' ? (
                      <button
                        onClick={() => checkTransaction(transaction.id)}
                        className="btn btn-success"
                      >
                        Done
                      </button>
                    ) : null
                  }
                </div>

                {/* Items / Detail Transaction */}
                <h2 className="mt-4">Items</h2>
                <div className="panel-body table-responsive shadow mt-4 rounded-4">
                  <div className={"collapse " + (showFormItem ? 'show' : null)}>
                    <TransactionDetailForm
                      onFormSubmit={submitFormTransactionDetail}
                      initialDataItem={initialDataItem}
                      title={formItemStatus}
                      onButtonCloseClick={onButtonCloseItemClick}
                    />
                  </div>
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Item Name</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Total Item</th>
                        <th scope="col">Total Price</th>
                        {
                          transaction.status === 'Inisialization' || transaction.status === 'On Check' ? (
                            <th scope="col">{transaction.status === 'On Check' ? 'Action/Status' : 'Action'}</th>
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
                                transaction.status === 'On Check' && transactionDetail.status !== "Ready to Check" ? (
                                  <td>
                                    {transactionDetail.status}
                                    {
                                      transactionDetail.status === 'Accept' && transaction.status === 'On Check'? (
                                        <button
                                          onClick={() => onButtonUpdateStatusItemClick(transactionDetail.id, 'Ready to Check')}
                                          className="btn btn-warning ms-3"
                                          disabled={showFormReturn ?? false}
                                        >
                                          Cancel
                                        </button>
                                      ) : null
                                    }
                                  </td>
                                ) : null
                              }
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
                                transaction.status === 'On Check' && transactionDetail.status === "Ready to Check" ? (
                                  <td>
                                    <button
                                      onClick={() => onButtonUpdateStatusItemClick(transactionDetail.id, 'Accept')}
                                      className="btn btn-primary me-1"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => onButtonReturnClick(transactionDetail.id, 'Return')}
                                      className="btn btn-warning me-1"
                                      disabled={showFormReturn ?? false}
                                    >
                                      Return
                                    </button>
                                    <button
                                      onClick={() => onButtonReturnClick(transactionDetail.id, 'Cancel')}
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
                  <div className={"collapse mt-3 " + (showFormReturn ? 'show' : null)}>
                    <ReturnForm
                      onFormSubmit={submitFormReturn}
                      initialData={initialDataReturn}
                      title={formReturnStatus}
                      onButtonCloseClick={onButtonCloseReturnClick}
                    />
                  </div>
                </div>

                {
                  // Return Item on Transaction
                  returnItems.length === 0 ? null : (
                    <>
                      <h2 className="mt-4">Return</h2>
                      <div className="panel-body table-responsive shadow mt-4 rounded-4">
                        <table className="table table-striped align-middle">
                          <thead>
                            <tr>
                              <th scope="col">Item Name</th>
                              <th scope="col">Unit</th>
                              <th scope="col">Total Item</th>
                              <th scope="col">Return Item</th>
                              <th scope="col">Description</th>
                              {
                                transaction.status === 'Inisialization' || transaction.status === 'On Check' ? (
                                  <th scope="col">Action</th>
                                ) : null
                              }
                            </tr>
                          </thead>
                          <tbody>
                            {
                              returnItems.map((returnItem) => (
                                <tr key={returnItem.id}>
                                  <td>{`${returnItem?.transactionDetail?.itemDetail?.item?.merk} ${returnItem?.transactionDetail?.itemDetail?.item?.name}`}</td>
                                  <td>{returnItem?.transactionDetail?.itemDetail?.unit}</td>
                                  <td>{returnItem?.transactionDetail?.totalItem}</td>
                                  <td>{returnItem.totalItem}</td>
                                  <td>{returnItem.description}</td>
                                  {
                                    transaction.status === 'On Check' ? (
                                      <td>
                                        <button
                                          onClick={() => editReturn(returnItem.id, returnItem?.transactionDetail?.totalItem === returnItem.totalItem ? 'Cancel' : 'Return')}
                                          className="btn btn-primary me-1"
                                          disabled={showFormReturn ?? false}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => deleteReturn(returnItem.id)}
                                          className="btn btn-danger"
                                          disabled={showFormReturn ?? false}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    ) : null
                                  }
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                }
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Transaction;
