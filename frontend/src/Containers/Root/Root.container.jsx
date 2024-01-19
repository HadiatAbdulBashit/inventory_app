import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar.component';

import style from './Root.module.css'

const Root = () => {
  return (
    <div className={style.wrapper}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar/>
      </div>
      <main className={style.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;