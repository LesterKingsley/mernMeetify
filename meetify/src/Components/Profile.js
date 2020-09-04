import React, { useEffect, useState } from "react";
import Axios from "axios";
import useRedirector from "../Hooks/useRedirector";
import fetchUser from "../Reducers/actions";
import { useDispatch, useSelector } from "react-redux";
function Profile() {
  const user = useSelector((state) => state.user.data);
  const [newInfo, setNewInfo] = useState({
    number: "",
    address: "",
    bio: "",
    job: "",
  });

  const token = localStorage.getItem("auth-token");
  const dispatch = useDispatch();

  const onChanger = (e) => {
    const { name, value } = e.target;
    setNewInfo({ ...newInfo, [name]: value });
  };
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  //paghiwalayin para di magcause ng loop
  useEffect(() => {
    setNewInfo({
      number: user.number,
      address: user.address,
      bio: user.bio,
      job: user.job,
    });
  }, [user]);
  const changePic = (e) => {
    e.preventDefault();
    const files = document.getElementById("image").files;
    const formData = new FormData();
    formData.append("image", files[0]);
    Axios.post(
      "http://localhost:7000/meetify/user/profile/imageUpload",
      formData,
      {
        headers: { "x-auth-token": token },
      }
    );
  };
  const updateInfo = async (e) => {
    e.preventDefault();
    const updateData = await Axios.post(
      "http://localhost:7000/meetify/user/updateUser",
      {
        address: newInfo.address,
        number: newInfo.number,
        bio: newInfo.bio,
        job: newInfo.job,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    try {
      console.log(updateData);
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  return (
    <>
      <div className="container">
        <h1 style={{ color: "white" }}>Change Profile Picture</h1>
        <div className="custom-file">
          <input
            type="file"
            className="form-control custom-file-input"
            name="profile"
            id="image"
            accept="image/*"
          ></input>
          <label class="custom-file-label">Choose file...</label>
          <button className="btn btn-dark mt-2" onClick={changePic}>
            Upload
          </button>
        </div>
      </div>
      <div className="container mt-5">
        <h1 style={{ color: "white" }}>Update Info</h1>
        <form onSubmit={updateInfo}>
          <div className="form-group">
            <label style={{ color: "white" }} for="address">
              Address:
            </label>
            <input
              value={newInfo.address}
              onChange={onChanger}
              name="address"
              className="form-control"
            ></input>
          </div>
          <div className="form-group">
            <label style={{ color: "white" }} for="number">
              Number:
            </label>
            <input
              value={newInfo.number}
              onChange={onChanger}
              name="number"
              className="form-control"
            ></input>
          </div>
          <div className="form-group">
            <label style={{ color: "white" }} for="bio">
              Create a short bio:
            </label>
            <input
              value={newInfo.bio}
              onChange={onChanger}
              name="bio"
              className="form-control"
            ></input>
          </div>
          <div className="form-group">
            <label style={{ color: "white" }} for="job">
              job:
            </label>
            <input
              value={newInfo.job}
              onChange={onChanger}
              name="job"
              className="form-control"
            ></input>
          </div>
          <button
            type="submit"
            className="btn bg-primary btn-primary form-control mb-2"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
}

export default Profile;
