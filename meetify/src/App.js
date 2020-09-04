import React, { useState } from "react";

import HeadNav from "./Components/HeadNav";
import LogIn from "./Components/LogIn";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Register from "./Components/Register";
import Home from "./Components/Home";
import { useSelector } from "react-redux";
import Profile from "./Components/Profile";
import ViewUser from "./Components/ViewUser";
import CreateAppointment from "./Components/CreateAppointment";

//NOTES
//usefilter to not see your own profile
function App() {
  const user = useSelector((state) => state.user.data);
  return (
    <div className="body" style={{ backgroundColor: "#333", height: "100vh" }}>
      <div
        style={
          Object.keys(user).length === 0
            ? {
                backgroundImage: `url(/bg.jpg)`,
                height: "100vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                backgroundColor: "#333",
                minHeight: "100vh",
                maxHeight: "auto",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }
      >
        <Router>
          <Switch>
            <HeadNav />;
          </Switch>
          <Route exact path="/"></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/login" component={LogIn} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
          <Route path="/viewUser/:email" component={ViewUser} />
          <Route path="/createApmt" component={CreateAppointment} />
        </Router>
      </div>
    </div>
  );
}

export default App;
