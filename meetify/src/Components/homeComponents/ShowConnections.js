import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
function ShowConnections() {
  const [myConnections, setMyConnections] = useState([]);
  const history = useHistory();
  const token = localStorage.getItem("auth-token");

  const fetchMyConnections = async () => {
    const connections = await Axios.get(
      "http://localhost:7000/meetify/user/myConnections",
      { headers: { "x-auth-token": token } }
    );
    setMyConnections(connections.data);
  };
  useEffect(() => {
    fetchMyConnections();
  }, []);
  useEffect(() => {
    console.log(myConnections);
  }, [myConnections]);
  return (
    <div className="container">
      <h1 className="text-light">Connections</h1>
      {myConnections.length !== 0
        ? myConnections.map((u) => (
            <div className="row bg-light mt=2">
              <div className="col-md-3">
                <img
                  src={`http://localhost:7000/meetify/user/profile/image/${u.profilePic}`}
                  style={{
                    objectFit: "cover",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                  }}
                ></img>
              </div>
              <div className="col-md-9">
                <div className="row">
                  <h1
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push(`/viewUser/${u.email}`);
                      window.location.reload();
                    }} //ttatangallin ung window.location.reload
                  >
                    {u.username}
                  </h1>
                </div>
                <div className="row">
                  <p>{u.email}</p>
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}

export default ShowConnections;
