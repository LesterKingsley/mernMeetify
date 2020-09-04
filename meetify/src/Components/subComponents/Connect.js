import React from "react";
import Axios from "axios";

function Connect({ email, status }) {
  console.log(status);
  const token = localStorage.getItem("auth-token");
  const connectUser = async () => {
    try {
      const connect = await Axios.post(
        `http://localhost:7000/meetify/user/requestConnection/${email}`,
        {},
        { headers: { "x-auth-token": token } }
      );
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  return (
    <>
      {status === "connect" ? (
        <button className="btn btn-dark" onClick={connectUser}>
          connect
        </button>
      ) : status === "connected" ? (
        <h3>connected</h3>
      ) : status === "self" ? (
        ""
      ) : (
        <h3>pending request</h3>
      )}
    </>
  );
}

export default Connect;
