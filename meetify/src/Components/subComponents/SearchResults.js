import React from "react";
import { useHistory } from "react-router-dom";

function SearchResults({ item }) {
  const history = useHistory();
  const visitUser = () => {
    console.log(item.email);
    history.push(`/viewUser/${item.email}`);
    window.location.reload();
  };
  return (
    <div className="searchItemResult p-3 mx-auto" onClick={visitUser}>
      <div>username: {item.username}</div>
      <div>email: {item.email}</div>
    </div>
  );
}

export default SearchResults;
