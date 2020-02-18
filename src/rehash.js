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

function createDom(fiber) {
  const { type, props } = fiber;
  const { children, ...props } = props;

  const dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  Object.entries(props).forEach(([attr, value]) => (dom[attr] = value));

  return dom;
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  while (nextUnitOfWork && !deadline.didTimeout) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

/**
 * @param {Fiber} fiber
 * @typedef {{
 *   type?: string
 *   dom?: HTMLElement,
 *   parent?: Fiber,
 *   child?: Fiber,
 *   sibling?: Fiber,
 *   props: {
 *     children: Fiber[]
 *   }
 * }} Fiber
 */
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let prevSibling = null;
  elements.forEach((element, index) => {
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
  });

  if (fiber.child) return fiber.child;

  const nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

module.exports = {
  createElement,
  render
};
