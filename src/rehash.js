function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return createElement("TEXT_ELEMENT", { nodeValue: text });
}

function render(element, container) {
  const { type, props } = element;
  const { children, ...props } = props;

  const dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  Object.entries(props).forEach(([attr, value]) => (dom[attr] = value));
  children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

module.exports = {
  createElement,
  render
};
