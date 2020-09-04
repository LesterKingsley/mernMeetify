import React, { useEffect } from "react";

function Error({ msg, clrMsg }) {
  useEffect(() => {
    const begone = setTimeout(() => {
      clrMsg();
    }, 3000);
    return () => {
      clearTimeout(begone);
    };
  }, [msg]);
  return <div style={{ color: "red" }}>{msg}</div>;
}

export default Error;
