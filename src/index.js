import Rehash from "./rehash";

/** @jsx Rehash.createElement */
const element = Rehash.createElement(
  "div",
  { id: "foo" },
  Rehash.createElement("a", null, "bar"),
  Rehash.createElement("b")
);
const container = document.getElementById("root");
Rehash.render(element, container);
