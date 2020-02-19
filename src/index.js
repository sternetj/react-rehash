import Rehash from "./rehash";

/** @jsx Rehash.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>;
}
const element = <App name="Teddy" />;
const container = document.getElementById("root");
Rehash.render(element, container);
