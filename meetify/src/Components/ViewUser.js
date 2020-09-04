import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import Connect from "./subComponents/Connect";

function ViewUser() {
  const token = localStorage.getItem("auth-token");
  const [profile, setProfile] = useState({});
  const [status, setStatus] = useState("connect");
  const { email } = useParams();
  const [numOfApmt, setNumber] = useState(0);

  const apmtTotal = async () => {
    const totaldata = await Axios.get(
      `http://localhost:7000/meetify/user/userTotalApmt/${profile._id}`,
      {
        headers: { "x-auth-token": token },
      }
    );

    console.log(totaldata.data);
    setNumber(totaldata.data);
    console.log(totaldata.data + "hello");
  };
  useEffect(() => {
    apmtTotal();
  }, [profile]);

  const viewUser = async () => {
    try {
      const profileData = await Axios.get(
        `http://localhost:7000/meetify/user/viewUser/${email}`,
        { headers: { "x-auth-token": token } }
      );
      setProfile(profileData.data.fetchData);
      setStatus(profileData.data.connectionStatus);
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  useEffect(() => {
    viewUser();
  }, []);
  return (
    <div className="container mt-3">
      <div className="card rounded text-center">
        <div className="row">
          <div className="col-sm-12 col-md-3" style={{ width: "100%" }}>
            <img
              style={{
                objectFit: "cover",
                height: "200px",
                width: "200px",
                borderRadius: "50%",
              }}
              src={
                Object.keys(profile).length !== 0
                  ? !profile.profilePic
                    ? `https://ui-avatars.com/api/?name=${profile.username}`
                    : `http://localhost:7000/meetify/user/profile/image/${profile.profilePic}`
                  : null
              }
            ></img>

            <div className="form-group mt-3">
              <Connect email={profile.email} status={status} id={profile._id} />
            </div>
          </div>
          <div className="col-sm-12 col-md-9 align-self-center text-center">
            <div className="row m-3 text-center justify-content-center">
              <h1 className="t">{profile.username}</h1>
            </div>
            <div className="row m-3 justify-content-center">
              <h4>{profile.email}</h4>
            </div>
            <div className="row m-2 justify-content-center">
              <p>{profile.bio}</p>
            </div>
            <div className="row m-2 justify-content-center">
              <p>{profile.address}</p>
            </div>
            <div className="row m-1 justify-content-center">
              <p>{profile.number}</p>
            </div>
            <div className="row m-3 justify-content-center">
              <div className="col-sm-4">
                {Object.keys(profile).length !== 0 ? (
                  <h5> connections:{profile.connections.length}</h5>
                ) : null}
              </div>
              <div className="col-sm-4">
                {Object.keys(profile).length !== 0 ? (
                  <h5> appointments:{numOfApmt}</h5>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
