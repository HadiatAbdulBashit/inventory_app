import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

const AppLog = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [monthFilter, setMonthFilter] = useState(moment().format("YYYY-MM"))
  const [filterDate, setFilterDate] = useState('month');

  useEffect(() => {
    setIsLoading(true)
    getItem();
  }, [page, search, sort, filter, limit, monthFilter, startDate, endDate, filterDate]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filter, monthFilter, startDate, endDate, filterDate]);

  const getItem = async () => {
    const response = await axios.get(`/api/app-log?page=${page}&search=${search}&sort=${sort.sort},${sort.order}&method=${filter}&limit=${limit}` + (filterDate === 'month' ? `&month=${monthFilter.split('-')[1]}&year=${monthFilter.split('-')[0]}` : filterDate === 'range' ? `&startDate=${startDate}&endDate=${endDate}` : ''));
    setData(response.data);
    setIsLoading(false)
  };

  const sortBy = [
    {
      value: 'message',
      name: 'Message'
    },
    {
      value: 'ipAddress',
      name: 'IP Address'
    },
    {
      value: 'method',
      name: 'Method'
    },
    {
      value: 'url',
      name: 'URL'
    }
  ];
  
  const onStartDateRangeChange = (e) => {
    const newStartDate = new Date(e.target.value);
    newStartDate.toISOString().split('T')[0]
    setStartDate(newStartDate);
  };

  const onEndDateRangeChange = (e) => {
    const newEndDate = new Date(e.target.value);
    newEndDate.toISOString().split('T')[0]
    setEndDate(newEndDate);
  };

  return (
    <div className="container p-4">
      <h1>App Log</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Search setSearch={(search) => setSearch(search)} />
              <div className="dropdown me-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownFilterDate" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter Date
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownFilterDate">
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate(false)}>None</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate('month')}>Month</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate('range')}>Range Date</button></li>
                </ul>
              </div>
              {
                filterDate === 'month' ? (
                  <input type="month" className='form-control me-2' onChange={e => setMonthFilter(e.target.value)} style={{ width: '150px' }} value={monthFilter} />
                ) : filterDate === 'range' ? (
                  <>
                    <input type="date" onChange={onStartDateRangeChange} className='form-control me-2' style={{ width: '130px' }} value={startDate.toISOString().split('T')[0]} />
                    <input type="date" onChange={onEndDateRangeChange} className='form-control me-2' style={{ width: '130px' }} value={endDate.toISOString().split('T')[0]} />
                  </>
                ) : null
              }
            </div>
            <Sort sort={sort} setSort={(sort) => setSort(sort)} listSort={sortBy} />
          </div>
        </div>
        {
          isLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            data.logs.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>No Item</h1>
              </div>
            ) : (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>IP Address</th>
                      <th>Method</th>
                      <th>URL</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.logs?.map((log) => (
                      <tr key={log.id}>
                        <td>{log.ipAddress}</td>
                        <td>{log.method}</td>
                        <td>{log.url}</td>
                        <td width={'40%'}>{log.message}</td>
                        <td>{moment(log.createdAt).format('llll')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )
        }
        <div className="panel-footer">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="total-show">Show :</label>
              <div>
                <select className="form-select" id="total-show" value={limit} onChange={(e) => setLimit(e.target.value)}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
              <div>
                out of <b>{data.total}</b> entries
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Filter
                listFilter={data.method ? data.method : []}
                setFilter={(filtered) => setFilter(filtered)}
                title='Method'
              />
              <Pagination
                page={page}
                limit={data.limit ? data.limit : 0}
                total={data.total ? data.total : 0}
                setPage={(page) => setPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLog;