import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import RadioRespond from "./RadioRespond";
function AppointmentCard({ a }) {
  const token = localStorage.getItem("auth-token");
  const [response, setResponse] = useState("");
  const user = useSelector((state) => state.user.data);

  const fetcher = async () => {
    const data = await Axios.post(
      `http://localhost:7000/meetify/user/attendAppointment/${a._id}/${response}`,
      {},
      { headers: { "x-auth-token": token } }
    );
    console.log(data.data);
  };
  useEffect(() => {
    fetcher();
  }, [response]);

  useEffect(() => {
    if (Object.keys(a).length !== 0) {
      if (a.approved.some((u) => u == user._id) == true) {
        setResponse("true");
        console.log("true");
      } else if (a.rejected.some((u) => u == user._id) == true) {
        setResponse("false");
      } else {
        setResponse("");
      }
    }
  }, []);

  return (
    <div className="col-md-4 mt-2 mb-2">
      <div className="card text-center p-2">
        <small className="card-header">
          created by {a.createdBy.email} at {a.dateCreated}
        </small>
        <h1 className="card-title">{a.name}</h1>
        <div className="card-content">
          <p>{a.descript}</p>
          <p>{a.dateOfMeeting}</p>
          <RadioRespond
            response={response}
            id={a._id}
            setResponse={setResponse}
          />
          <div className="card-footer">
            <h4>attendees:</h4>
            <div style={{ maxHeight: "100px", overflowY: "auto" }}>
              {a.participants.map((p) => (
                <div
                  style={
                    Object.keys(a).length !== 0
                      ? a.approved.some((u) => u === p._id) == true
                        ? { color: "green" }
                        : a.rejected.some((u) => u === p._id) == true
                        ? { color: "red" }
                        : null
                      : null
                  }
                >
                  {p.email !== user.email ? (
                    p.email
                  ) : (
                    <>
                      {response == "true" ? (
                        <span style={{ color: "green" }}>{p.email}</span>
                      ) : response == "false" ? (
                        <span style={{ color: "red" }}>{p.email}</span>
                      ) : (
                        <span style={{ color: "inherit" }}>{p.email}</span>
                      )}
                    </>
                  )}{" "}
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
