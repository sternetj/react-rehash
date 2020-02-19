import React from "react";
import Rehash from "./rehash";

/** @jsx Rehash.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
const container = document.getElementById("root");
Rehash.render(element, container);
