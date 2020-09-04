import React, { useState } from "react";
import Axios from "axios";
import Error from "../Miscs/Error";
import { useEffect } from "react";
function Register() {
  const [guest, setGuest] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const onChanger = (e) => {
    const { name, value } = e.target;
    setGuest({ ...guest, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(
        "http://localhost:7000/meetify/register",
        {
          username: guest.username,
          email: guest.email,
          password: guest.password,
        }
      );
      console.log(response.data);
    } catch (err) {
      setError(err.response.data.msg);
    }
  };
  return (
    <div className="container">
      <div className="row " style={{ height: "70vh" }}>
        <div
          className="card text-center p-4 rounded"
          style={{
            width: "500px",
            margin: "auto",
            backgroundColor: "rgba(0,0,0,0.89)",
          }}
        >
          <h1 className="card-title mb-5 " style={{ color: "white" }}>
            Sign Up to Meetify
          </h1>
          <form className="text-center" onSubmit={register}>
            <div className="form-group">
              <input
                name="username"
                value={guest.username}
                onChange={onChanger}
                className="form-control"
                placeholder="username"
              ></input>
            </div>
            <div className="form-group">
              <input
                name="email"
                value={guest.email}
                onChange={onChanger}
                className="form-control"
                placeholder="email"
              ></input>
            </div>
            <div className="form-group">
              <input
                name="password"
                value={guest.password}
                onChange={onChanger}
                className="form-control"
                placeholder="password"
              ></input>
            </div>
            <input
              type="submit"
              className="btn btn-dark mt-4"
              value="Register"
            ></input>
            <Error msg={error} clrMsg={() => setError("")} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
