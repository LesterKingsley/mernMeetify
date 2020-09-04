import React, { useState, useEffect } from "react";
import Axios from "axios";
import Error from "../Miscs/Error";

function CreateAppointment() {
  const token = localStorage.getItem("auth-token");
  const [connectionsData, setConnectionsData] = useState([]);
  const [apmtData, setApmtData] = useState({
    meetingName: "",
    descript: "",
    dateOfMeeting: null,
    participants: {},
  });
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(2);

  const onChanger = (e) => {
    const { name, value } = e.target;
    if (name !== "participants[]") {
      setApmtData({ ...apmtData, [name]: value });
    }
  };

  useEffect(() => {
    console.log(apmtData.participants);
  });
  const createApmt = async (e) => {
    try {
      e.preventDefault();
      const connections = await Axios.post(
        `http://localhost:7000/meetify/user/createApmt`,
        {
          name: apmtData.meetingName,
          descript: apmtData.descript,
          participants: Object.values(apmtData.participants),
          dateOfMeeting: apmtData.dateOfMeeting,
        },
        { headers: { "x-auth-token": token } }
      );
      console.log(connections);
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  const fetchConnections = async () => {
    const connections = await Axios.get(
      `http://localhost:7000/meetify/user/myConnections`,
      { headers: { "x-auth-token": token } }
    );
    setConnectionsData(connections.data);
    console.log(connections.data);
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  const runner = (e) => {
    setApmtData({
      ...apmtData,
      participants: {
        ...apmtData.participants,
        [e.target.name]: e.target.value,
      },
    });
  };
  const createAnotherParti = (e) => {
    e.preventDefault();
    var input = document.createElement("input");
    input.setAttribute("type", "email");
    input.setAttribute("class", "form-control participantInput");
    input.setAttribute("name", `participant${counter}`);
    input.setAttribute("list", "connections");
    input.onchange = runner;
    document.querySelector("#participantsBox").appendChild(input);
    setCounter(counter + 1);
  };
  return (
    <div className="container mt-3">
      <form onSubmit={createApmt}>
        <div className="form-group">
          <label style={{ color: "white" }} HTMLfor="name">
            Name of the appointment:
          </label>
          <input
            autocomplete="off"
            className="form-control"
            value={apmtData.name}
            onChange={onChanger}
            name="meetingName"
          ></input>
        </div>
        <div className="form-group">
          <label style={{ color: "white" }} for="participants">
            participants of the meeting:{" "}
            <small>
              (note:put the email of the user, connect with the participant so
              it will be auto-completed)
            </small>
          </label>
          <div id="participantsBox">
            <input
              type="email"
              className="form-control participantInput"
              list="connections"
              name="participant1"
              onChange={runner}
            />
            <datalist id="connections">
              {connectionsData.map((c) => (
                <option value={c.email}>{c.email}</option>
              ))}
            </datalist>
          </div>
          <button onClick={createAnotherParti} className="btn btn-primary">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-person-plus-fill"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </button>
        </div>
        <div className="form-group">
          <label style={{ color: "white" }} for="descript">
            short description:
          </label>
          <input
            className="form-control"
            onChange={onChanger}
            value={apmtData.descript}
            name="descript"
          ></input>
        </div>
        <div className="form-group">
          <label style={{ color: "white" }} for="descript">
            date and time of the meeting:
          </label>
          <input
            className="form-control"
            onChange={onChanger}
            type="datetime-local"
            name="dateOfMeeting"
            value={apmtData.dateOfMeeting}
          ></input>
        </div>

        <input
          type="submit"
          value="Create Appointment"
          className="btn btn-primary"
        ></input>
        <Error msg={error} clrMsg={() => setError("")} />
      </form>
    </div>
  );
}

export default CreateAppointment;
