import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import AppointmentCard from "./AppointmentCard";

function ShowAppointments() {
  const token = localStorage.getItem("auth-token");
  const [myApmt, setMyApmt] = useState([]);
  const fetchAppointments = async () => {
    const myApmtData = await Axios.get(
      "http://localhost:7000/meetify/user/myApmt",
      { headers: { "x-auth-token": token } }
    );
    setMyApmt(myApmtData.data);
    console.log(myApmtData.data);
  };
  useEffect(() => {
    console.log(myApmt);
  }, [myApmt]);
  useEffect(() => {
    fetchAppointments();
  }, []);
  return (
    <div className="container">
      <h1 className="text-light">Current Appointments:</h1>
      <div className="row">
        {myApmt.length !== 0
          ? myApmt.map((a) => <AppointmentCard a={a} key={a._id} />)
          : null}
      </div>
    </div>
  );
}

export default ShowAppointments;
