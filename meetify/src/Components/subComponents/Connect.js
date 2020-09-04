import React, { useEffect } from "react";
import Axios from "axios";

function Connect({ email, status, id }) {
  const token = localStorage.getItem("auth-token");
  const connectUser = async () => {
    try {
      const connect = await Axios.post(
        `http://localhost:7000/meetify/user/requestConnection/${email}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  const disconnect = async () => {
    const reject = await Axios.post(
      `http://localhost:7000/meetify/user/rejectConnection/${id}`,
      {},
      { headers: { "x-auth-token": token } }
    );
    window.location.reload();
    console.log("hey");
  };
  return (
    <>
      {status === "connect" ? (
        <button className="btn btn-dark" onClick={connectUser}>
          connect
        </button>
      ) : status === "connected" ? (
        <>
          <h3>connected</h3>
          <button className="btn btn-primary" onClick={disconnect}>
            disconnect
          </button>
        </>
      ) : status === "self" ? (
        ""
      ) : (
        <>
          <h3>pending request</h3>
          <button className="btn btn-primary" onClick={disconnect}>
            cancel
          </button>
        </>
      )}
    </>
  );
}

export default Connect;
