import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar.component';
import Sidebar from '../../Components/Sidebar/Sidebar.component';

import style from './Root.module.css'

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={style.wrapper}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} />
      </div>
      <main className={style.main}>
        <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
        <Outlet />
      </main>
    </div>
  );
};

export default Root;