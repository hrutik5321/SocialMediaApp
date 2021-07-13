import { useState } from "react";
import {} from "react-router-dom";
import { authenticate, isAutheticated, signin } from "../../backend/auth";
import "./login.css";

export default function Login() {
  const [values, setValues] = useState({
    email: "hrutik@gmail.com",
    password: "hrutik123",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAutheticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true,
            });
          });
        }
      })
      .catch(console.log("signin request failed"));
  };

  // const performRedirect = () => {
  //   if (didRedirect) {
  //     if (user && user.role === 1) {
  //       return <Redirect to="/admin/dashboard" />;
  //     } else {
  //       return <Redirect to="/user/dashboard" />;
  //     }
  //   }
  //   if (isAutheticated()) {
  //     return <Redirect to="/" />;
  //   }
  // };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          {errorMessage()}
          {loadingMessage()}
          <div className="loginBox">
            <input
              placeholder="Email"
              className="loginInput"
              onChange={handleChange("email")}
              value={email}
              type="email"
            />
            <input
              placeholder="Password"
              className="loginInput"
              onChange={handleChange("password")}
              value={password}
              type="password"
            />
            <button onClick={onSubmit} className="loginButton">
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
