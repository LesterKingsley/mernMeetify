import React, { useState } from "react";
import Error from "../Miscs/Error";
import Axios from "axios";
import { useEffect } from "react";
import useRedirector from "../Hooks/useRedirector";
import { useLocation, useHistory } from "react-router-dom";

function LogIn() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const history = useHistory();
  useRedirector();
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:7000/meetify/login", {
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("auth-token", response.data.getToken);
      history.push("/home");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };
  const onChanger = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  return (
    <div className="container">
      <div className="row" style={{ height: "70vh" }}>
        <div
          className="card text-center p-4 rounded"
          style={{
            width: "500px",
            margin: "auto",
            backgroundColor: "rgba(0,0,0,0.89)",
          }}
        >
          <h1 className="card-title mb-5" style={{ color: "white" }}>
            Log in to Meetify
          </h1>
          <form className="text-center" onSubmit={login}>
            <div className="form-group">
              <input
                name="email"
                value={user.email}
                onChange={onChanger}
                className="form-control"
                placeholder="email"
              ></input>
            </div>
            <div className="form-group">
              <input
                name="password"
                value={user.password}
                onChange={onChanger}
                className="form-control"
                placeholder="password"
              ></input>
            </div>
            <input
              type="submit"
              className="btn btn-dark mt-4"
              value="Log In"
            ></input>
            <Error msg={error} clrMsg={() => setError("")} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
