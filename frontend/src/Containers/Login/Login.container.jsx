const Login = () => {
  return (
    <section className="text-center d-flex align-items-center flex-column">

      <div className="p-5 bg-image" style={{ background: 'linear-gradient(130deg, var(--color-one) 0%, var(--color-four) 100%)', height: '100vh', width: '100%' }}></div>

      <div className="card mx-4 mx-md-5 shadow-5-strong col-5" style={{
        marginTop: '-80vh',
        background: 'hsla(0, 0%, 100%, 0.5)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="card-body py-5 px-md-5">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-10">
              <h2 className="fw-bold mb-5">Sign up</h2>
              <form>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInput" placeholder="name@example.com" />
                  <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                {/* <!-- Submit button --> */}
                <div className="d-grid">
                  <button type="submit" className="btn color-one color-one-hover btn-block mb-4">
                    Login
                  </button>
                </div>
                <p>
                <a href="#">Forgot password?</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login