import Rehash from "./rehash";

/** @jsx Rehash.createElement */
const element = (
  <div id="foo">
    <span onClick={() => alert("hello")}>bar</span>
    <b></b>
  </div>
);
const container = document.getElementById("root");
Rehash.render(element, container);
