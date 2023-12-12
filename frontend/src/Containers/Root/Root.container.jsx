import { Outlet } from 'react-router-dom';

const Root = () => {

  return (
    <>
      <header>
        dashboard
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Root;