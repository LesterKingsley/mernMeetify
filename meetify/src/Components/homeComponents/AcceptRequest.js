import React, { useEffect } from "react";
import Axios from "axios";

function AcceptRequest({ id }) {
  const token = localStorage.getItem("auth-token");
  const acceptReq = async () => {
    const accept = await Axios.post(
      `http://localhost:7000/meetify/user/acceptRequest/${id}`,
      {},
      { headers: { "x-auth-token": token } }
    );
    window.location.reload();
  };

  return (
    <button
      className="btn bg-dark text-light  form-control"
      onClick={acceptReq}
    >
      accept
    </button>
  );
}

export default AcceptRequest;
