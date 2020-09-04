import React, { useState, useEffect } from "react";
import Axios from "axios";
import AcceptRequest from "./AcceptRequest";
import RejectRequest from "./RejectRequest";

function ShowRequests() {
  const [requestData, setRequestData] = useState([]);
  const token = localStorage.getItem("auth-token");
  const getRequests = async () => {
    const requests = await Axios.get(
      "http://localhost:7000/meetify/user/showMyRequests",
      {
        headers: { "x-auth-token": token },
      }
    );
    setRequestData(requests.data);
  };
  useEffect(() => {
    getRequests();
    console.log(requestData);
  }, []);
  return (
    <div className="container">
      <h1 style={{ color: "white" }}>Requests</h1>
      <div className="row">
        {requestData.map((r) => (
          <div className="col-md-4">
            <div className="card p-2 mt-2">
              <div class="card-header">request</div>
              <img
                className="fixed-image-top"
                style={{ objectFit: "contain", height: " 25vh" }}
                src={`http://localhost:7000/meetify/user/profile/image/${r.profilePic}`}
              ></img>
              <div>
                <h1 className="card-title">{r.username}</h1>
                <p className="card-content">{r.email}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-12">
                  <AcceptRequest id={r._id} />
                </div>
                <div className="col-sm-12">
                  <RejectRequest id={r._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowRequests;
