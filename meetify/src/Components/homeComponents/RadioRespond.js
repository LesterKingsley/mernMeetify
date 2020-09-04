import React from "react";

function RadioRespond({ response, setResponse, id }) {
  return (
    <>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name={"response" + id}
          value={response}
          onChange={(e) => setResponse("true")}
          checked={response === "true"}
        />
        <label className="form-check-label" for="response">
          attending
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name={"response" + id}
          value={response}
          onChange={(e) => setResponse("false")}
          checked={response === "false"}
        />
        <label className="form-check-label" for="response">
          not attending
        </label>
      </div>
    </>
  );
}

export default RadioRespond;
