import React from "react";
import Axios from "axios";

function PracticeImg() {
  const submitMe = (e) => {
    e.preventDefault();
    const files = document.getElementById("image").files;
    const token = localStorage.getItem("auth-token");
    const formData = new FormData();
    formData.append("image", files[0]);
    Axios.post("http://localhost:7000/societies/indi/imageUpload", formData, {
      headers: { "x-auth-token": token },
    });
  };
  return (
    <div>
      <input type="file" name="profile" id="image" accept="image/"></input>
      <button onClick={submitMe}></button>
    </div>
  );
}

export default PracticeImg;
