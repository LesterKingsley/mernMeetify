import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import fetchUser from "../Reducers/actions";
import SearchConnections from "./subComponents/SearchConnections";
import useRedirector from "../Hooks/useRedirector";

function HeadNav() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  return (
    <nav
      className="navbar navbar-expand-md navbar-dark"
      style={{ backgroundColor: "rgba(0,0,0,0.87)", color: "white" }}
    >
      <a href="#" className="navbar-brand">
        Meetify
      </a>
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#mainNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div id="mainNav" className="navbar-collapse collapse">
        {Object.keys(user).length !== 0 ? <SearchConnections /> : null}
        <ul className="navbar-nav ml-auto text-center">
          {Object.keys(user).length === 0 ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  log in
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/createApmt">
                  Create Appointment
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  profile
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => {
                    localStorage.removeItem("auth-token");

                    history.push("/login");
                    window.location.reload();
                  }}
                >
                  logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default HeadNav;
