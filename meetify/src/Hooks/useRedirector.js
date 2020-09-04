import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import fetchUser from "../Reducers/actions";

function useRedirector(loc) {
  const history = useHistory();
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  // let location = useLocation();
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      history.push("/login");
    } else {
      history.push("home");
    }
  }, [user]);
}

export default useRedirector;
