import Rehash from "./rehash";

/** @jsx Rehash.createElement */
function Counter() {
  const [currentCount, setCount] = Rehash.useState(1);
  return (
    <h1 onClick={() => setCount(current => current + 1)}>
      Count: {currentCount}
    </h1>
  );
}
const element = <Counter />;
const container = document.getElementById("root");
Rehash.render(element, container);
