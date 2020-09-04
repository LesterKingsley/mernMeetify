import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import RadioRespond from "./RadioRespond";
function AppointmentCard({ a }) {
  const token = localStorage.getItem("auth-token");
  const [response, setResponse] = useState("");
  const user = useSelector((state) => state.user.data);
  const initialRender = useRef(true);
  const fetcher = async () => {
    try {
      const data = await Axios.post(
        `http://localhost:7000/meetify/user/attendAppointment/${a._id}/${response}`,
        {},
        { headers: { "x-auth-token": token } }
      );
    } catch (err) {
      console.log(err.response);
    }
  };
  const deleteApmt = async () => {
    try {
      const deleted = await Axios.delete(
        `http://localhost:7000/meetify/user/deleteApmt/${a._id}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false; //to not run response in first render
    } else {
      fetcher(); // initially called every time, the component renders
    }
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
        {user._id == a.createdBy._id ? (
          <svg
            onClick={deleteApmt}
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-file-x-fill ml-auto"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM6.854 6.146a.5.5 0 1 0-.708.708L7.293 8 6.146 9.146a.5.5 0 1 0 .708.708L8 8.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 8l1.147-1.146a.5.5 0 0 0-.708-.708L8 7.293 6.854 6.146z"
            />
          </svg>
        ) : null}

        <div className="card-header">
          <small>
            created by {a.createdBy.email} at {a.dateCreated}
          </small>
          <div></div>
        </div>
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
            <div style={{ maxHeight: "50px", overflowY: "auto" }}>
              {a.participants.map((p) => (
                <div>
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
