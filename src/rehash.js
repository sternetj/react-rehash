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

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

/** @param {Fiber} fiber */
function commitWork(fiber) {
  if (!fiber) return;

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  };
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  while (nextUnitOfWork && !deadline.didTimeout) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
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
