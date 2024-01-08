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
import { Bar, Pie } from 'react-chartjs-2';

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
  const options = {
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

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Sale',
        data: [1, 2, 3, 4, 5, 6, 7],
        backgroundColor: '#f8d7da',
      },
      {
        label: 'Purchase',
        data: [4, 5, 6, 7, 8, 9, 10],
        backgroundColor: '#cfe2ff',
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
        label: '# of Votes',
        data: [12, 19],
        backgroundColor: [
          '#f8d7da',
          '#cfe2ff',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container p-4">
      <div className='d-flex gap-3 mb-4'>
        <div className='panel p-3 flex-fill'>
          Total Purchase This Month <br />
          <h2>Rp. 100.800.000</h2>
        </div>
        <div className='panel p-3 flex-fill'>
          Total Sale This Month <br />
          <h2>Rp. 100.800.000</h2>
        </div>
        <div className='panel p-3 flex-fill'>
          Total Transaction This Month <br />
          <h2>Rp. 100.800.000</h2>
        </div>
        <div className='panel p-3 flex-fill'>
          Item in Warehouse <br />
          <h2>543</h2>
        </div>
      </div>
      <div className="panel p-5 row mx-0 mb-4">
        <div className="col-8">
          <Bar options={options} data={data} />
        </div>
        <div className="col-4">
          <Pie options={optionsPie} data={dataPie} />
        </div>
      </div>
      <div className='d-flex gap-3 mb-4'>
        <ul className="list-group list-group-flush panel border-0 flex-fill">
          <li className="list-group-item bg-primary-subtle fw-bold">Last Purchase</li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Mencari Cinta Sejati
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Bangun Jaya Lancar
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Mega 2 Abadi
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Patah Hati Oleh Nya
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
        </ul>
        <ul className="list-group list-group-flush panel border-0 flex-fill">
          <li className="list-group-item bg-primary-subtle fw-bold">Last Sale</li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Mencari Cinta Sejati
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Bangun Jaya Lancar
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Mega 2 Abadi
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            PT Patah Hati Oleh Nya
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Rp. 120.000.000</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard