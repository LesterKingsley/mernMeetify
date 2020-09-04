import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchUser from "../Reducers/actions";
import { useEffect } from "react";
import useRedirector from "../Hooks/useRedirector";
import { useLocation, Switch, Link } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShowRequests from "./homeComponents/ShowRequests";
import ShowAppointments from "./homeComponents/ShowAppointments";
import Axios from "axios";
import ShowConnections from "./homeComponents/ShowConnections";
function Home() {
  const user = useSelector((state) => state.user.data);
  const [numOfApmt, setNumber] = useState(0);
  const token = localStorage.getItem("auth-token");
  const apmtTotal = async () => {
    const totaldata = await Axios.get(
      "http://localhost:7000/meetify/user/myTotalApmt",
      {
        headers: { "x-auth-token": token },
      }
    );
    setNumber(totaldata.data);
    console.log(totaldata.data + "hello");
  };
  useEffect(() => {
    apmtTotal();
  }, []);
  useRedirector();
  return (
    <Router>
      <div className="container mt-3 mb-3">
        <div
          className="card rounded text-center"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <div className="row text-center">
            <div className=" col-sm-12 col-md-3" style={{ width: "100%" }}>
              <img
                src={
                  Object.keys(user).length !== 0
                    ? !user.profilePic
                      ? `https://ui-avatars.com/api/?name=${user.username}`
                      : `http://localhost:7000/meetify/user/profile/image/${user.profilePic}`
                    : null
                }
                style={{
                  objectFit: "cover",
                  height: "200px",
                  width: "200px",
                  borderRadius: "50%",
                }}
              />
            </div>

            <div className="col-sm-12 col-md-9 align-self-center">
              <div className="row  m-1 ">
                {Object.keys(user).length ? (
                  <h1>Welcome {user.username}</h1>
                ) : null}
              </div>
              <div className="row m-3">
                {Object.keys(user).length ? <h4>{user.email}</h4> : null}
              </div>
              <Switch>
                <div className="row m-3 ">
                  <div className="col-sm-4">
                    {Object.keys(user).length !== 0 ? (
                      <Link to="/home/showConnections">
                        <h5> connections:{user.connections.length}</h5>
                      </Link>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    {Object.keys(user).length !== 0 ? (
                      <Link to="/home/showAppointments">
                        <h5> my appointments:{numOfApmt}</h5>
                      </Link>
                    ) : null}
                  </div>
                  <div className="col-sm-4">
                    {Object.keys(user).length !== 0 ? (
                      <Link to="/home/showRequests">
                        <h5 style={{ cursor: "pointer" }}>
                          {" "}
                          requests:{user.requests.length}
                        </h5>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Switch>
            </div>
          </div>
        </div>
      </div>
      <Route path="/home/showRequests" component={ShowRequests}></Route>
      <Route
        path="/home/showAppointments"
        exact
        component={ShowAppointments}
      ></Route>
      <Route
        path="/home/showConnections"
        exact
        component={ShowConnections}
      ></Route>
    </Router>
  );
}

export default Home;
