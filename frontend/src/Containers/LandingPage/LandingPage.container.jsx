import { Link } from 'react-router-dom';
import logistic from'./logistics.png';

const LandingPage = () => {
  return (
    <header className="d-flex align-items-center" style={{minHeight: '100vh'}}>
      <div className="container px-5 pb-5">
        <div className="row gx-5 align-items-center">
          <div className="col-xxl-5">
            <div className="text-center text-xxl-start">
              <div className="badge bg-primary text-white mb-4 text-uppercase">Logistic · Management · Marketing</div>
              <div className="fs-3 fw-light text-muted">Lest make this shipment</div>
              <h1 className="display-3 fw-bolder mb-5"><span className="text-gradient d-inline">Get faster and stay easy</span></h1>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xxl-start mb-3">
                <Link className="btn btn-primary btn-lg px-5 py-3 me-sm-3 fs-6 fw-bolder" to="/login">Login</Link>
                <Link className="btn btn-outline-dark btn-lg px-5 py-3 fs-6 fw-bolder" to="/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="col-xxl-7">
            <div className="d-flex justify-content-center mt-5 mt-xxl-0">
              <div className="profile text-center d-flex flex-column">
                <img className="profile-img" src={logistic} style={{ width: '100%', maxWidth: '620px'}} />
                <a href="https://storyset.com/work" className=''>Work illustrations by Storyset</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingPage