import { useState, useEffect } from "react";
import axios from "axios";

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

const Stock = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getItem();
  }, [page, search, sort, filter, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filter]);

  const getItem = async () => {
    const response = await axios.get(`/api/item-detail?page=${page}&search=${search}&sort=${sort.sort},${sort.order}&category=${filter}&limit=${limit}`);
    setData(response.data);
    setIsLoading(false)
  };

  const sortBy = [
    {
      value: 'unit',
      name: 'Unit'
    },
    {
      value: 'price',
      name: 'Price'
    },
    {
      value: 'stock',
      name: 'Stock'
    }
  ];

  return (
    <div className="container p-4" style={{minWidth: '720px'}}>
      <h1>List Stock</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Search setSearch={(search) => setSearch(search)} />
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
            data.items.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>No Item</h1>
              </div>
            ) : (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Merk</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Unit</th>
                      <th>Price</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.item.merk}</td>
                        <td>{item.item.name}</td>
                        <td>{item.item.category}</td>
                        <td>{item.unit}</td>
                        <td>{item.price}</td>
                        <td>{item.stock}</td>
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
                listFilter={data.category ? data.category : []}
                setFilter={(filtered) => setFilter(filtered)}
                title='Category'
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

export default Stock;
