/**
 * 
 * @param {HTMLElement} node1 
 * @param {HTMLElement} node2 
 * @returns 
 */
export const compareNodes = (node1, node2) => {
  // tagname 비교
  const is_tag_different = node1.tagName !== node2.tagName;
  
  if (is_tag_different) {
    return true;
  }

  const node1Attributes = node1.attributes;
  const node2Attributes = node2.attributes;

  // attributes 길이 비교
  const is_attributes_length_different = node1Attributes.length !== node2Attributes.length;

  if (is_attributes_length_different) {
    return true;
  }

  // attributes 값 비교
  const is_attributes_different = Array.from(node1Attributes).reduce((prev, attribute) => {
    const {name} = attribute;
    const attribute1 = node1.getAttribute(name);
    const attribute2 = node2.getAttribute(name);

    return attribute1 !== attribute2 || prev;
  }, false);

  if (is_attributes_different) {
    return true;
  }

  // text content 비교
  const is_childless = node1.children.length === 0 && node2.children.length === 0;
  const is_text_different = node1.textContent !== node2.textContent;

  if (is_childless && is_text_different) {
    return true;
  }

  return false;
};

/**
 * 
 * @param {HTMLElement} parent 
 * @param {HTMLElement} real 
 * @param {HTMLElement} virtual 
 * @returns 
 */
function applyDiff(parent, real, virtual) {
  // 삭제된 경우
  if (real && !virtual) {
    real.remove();
    return;
  }

  // 추가된 경우
  if (!real && virtual) {
    parent.appendChild(virtual);
    return;
  }

  // 뼌경된 경우
  const is_different = compareNodes(real, virtual);
  if (is_different) {
    real.replaceWith(virtual);
    return;
  }

  const real_children = Array.from(real.children);
  const virtual_children = Array.from(virtual.children);

  const max_length = Math.max(real_children.length, virtual_children.length);
  for (let i = 0; i < max_length; i++) {
    applyDiff(real, real_children[i], virtual_children[i]);
  }
};

/**
 * 재조정
 * 저장된 과거의 virtual DOM과 새로 바뀐 것을 비교해서 재조정
 * @param {HTMLElement} dom
 */
function reconciliate(dom, new_template) {
  const new_dom = dom.cloneNode(true);
  new_dom.innerHTML = new_template;

  applyDiff(dom.parentElement, dom, new_dom);
}

export default reconciliate;
