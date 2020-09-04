import React from "react";
import Axios from "axios";

function RejectRequest({ id }) {
  const token = localStorage.getItem("auth-token");
  const rejectReq = async () => {
    const reject = await Axios.post(
      `http://localhost:7000/meetify/user/rejectConnection/${id}`,
      {},
      { headers: { "x-auth-token": token } }
    );
    window.location.reload();
  };

  return (
    <button className="btn text-light bg-dark form-control" onClick={rejectReq}>
      ignore
    </button>
  );
}

export default RejectRequest;
