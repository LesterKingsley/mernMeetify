import React, { useState } from "react";
import Axios from "axios";
import SearchResults from "./SearchResults";
function SearchConnections() {
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("auth-token");
  const searchConnections = async (e) => {
    try {
      if (e.target.value !== "") {
        const search = await Axios.get(
          `http://localhost:7000/meetify/user/searchUsers/${e.target.value}`,
          { headers: { "x-auth-token": token } }
        );
        setSearchData(search.data);
      }
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };
  return (
    <div className="container">
      <div className="col mx-auto text-align-center">
        <input
          className=" form-control mx-auto"
          style={{ width: "50%" }}
          placeholder="search connections"
          onKeyUp={searchConnections}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            position: "absolute",
            zIndex: 44,
          }}
          className="searchResultBox text-align-center"
        >
          {searchQuery !== "" && searchData.length !== 0
            ? searchData.map((i) => <SearchResults item={i} />)
            : null}
        </div>
      </div>
    </div>
  );
}

export default SearchConnections;
