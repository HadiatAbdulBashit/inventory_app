import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import moment from 'moment';

import formatRupiah from "../../Utils/formatRupiah";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getData = async (data) => {
    try {
      const responese = await axios.get(`/api/dashboard`, data);
      setData(responese.data)
      setIsLoading(false)
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction last 7 months',
      },
    },
  };

  const dataBar = {
    labels: data.barChartLabels,
    datasets: [
      {
        label: 'Sale',
        data: data.barChartDataSale,
        backgroundColor: '#d1e7dd',
      },
      {
        label: 'Purchase',
        data: data.barChartDataPurchase,
        backgroundColor: '#fff3cd',
      },
    ],
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Percentage Transaction this Month',
      },
    },
  };

  const dataPie = {
    labels: ['Sale', 'Purchase'],
    datasets: [
      {
        label: 'Transaction',
        data: [data.totalSaleThisMonth, data.totalPurchaseThisMonth],
        backgroundColor: [
          '#d1e7dd',
          '#fff3cd',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container p-4" style={{ minWidth: '1000px' }}>
      {
        isLoading ? (
          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className='d-flex gap-3 mb-4'>
              <div className='panel p-3 flex-fill'>
                Total Purchase This Month <br />
                <h2>{formatRupiah(data.totalPurchase || 0)}</h2>
              </div>
              <div className='panel p-3 flex-fill'>
                Total Sale This Month <br />
                <h2>{formatRupiah(data.totalSale || 0)}</h2>
              </div>
              <div className='panel p-3 flex-fill'>
                Total Transaction This Month <br />
                <h2>{data.totalTransaction}</h2>
              </div>
              <div className='panel p-3 flex-fill'>
                Item in Warehouse <br />
                <h2>{data.itemsInWarehouse}</h2>
              </div>
            </div>
            <div className="panel p-5 row mx-0 mb-4">
              <div className="col-8">
                <Bar options={optionsBar} data={dataBar} />
              </div>
              <div className="col-4">
                <Pie options={optionsPie} data={dataPie} />
              </div>
            </div>
            <div className='d-flex gap-3 mb-4'>
              <ul className="list-group list-group-flush panel border-0 flex-fill">
                <li className="list-group-item bg-primary-subtle fw-bold">Last Purchase</li>
                {
                  data.lastPurchase.map((purchase, i) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                      {purchase.secondParty}
                      <span className={"badge rounded-pill " + (purchase.status === 'Success' || purchase.status === 'Success with Return' ? 'bg-success-subtle text-success-emphasis' : purchase.status === 'Canceled' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-warning-subtle text-warning-emphasis')}>{moment(purchase.updatedAt).fromNow()}</span>
                    </li>
                  ))
                }
              </ul>
              <ul className="list-group list-group-flush panel border-0 flex-fill">
                <li className="list-group-item bg-primary-subtle fw-bold">Last Sale</li>
                {
                  data.lastSale.map((sale, i) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                      {sale.secondParty}
                      <span className={"badge rounded-pill " + (sale.status === 'Success' || sale.status === 'Success with Return' ? 'bg-success-subtle text-success-emphasis' : sale.status === 'Canceled' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-warning-subtle text-warning-emphasis')}>{moment(sale.updatedAt).fromNow()}</span>
                    </li>
                  ))
                }
              </ul>
              <ul className="list-group list-group-flush panel border-0 flex-fill">
                <li className="list-group-item bg-primary-subtle fw-bold">New Items</li>
                {
                  data.newItem.map((item, i) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                      {item.item.merk + ' ' + item.item.name}
                      <span>{item.stock + ' ' + item.unit}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </>
        )
      }
    </div>
  )
}

export default Dashboard