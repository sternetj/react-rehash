import React from "react";
import ReactDOM from "react-dom";

const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null),
  React.createElement("b", null)
);
const container = document.getElementById("root");
ReactDOM.render(element, container);
