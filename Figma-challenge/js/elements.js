// -------- Create Rectangle Element --------

function createRectangle(x, y) {
  const box = document.createElement("div");

  const id = `rect-${++idCounter}`;
  box.dataset.id = id;
  box.dataset.type = "rectangle";
  box.classList.add("canvas-element");

  const width = 100;
  const height = 100;

  box.style.position = "absolute";
  box.style.width = `${width}px`;
  box.style.height = `${height}px`;
  box.style.left = `${x - width / 2}px`;
  box.style.top = `${y - height / 2}px`;
  box.style.backgroundColor = "#D9D9D9";

  box.dataset.rotation = "0";
  box.style.transform = "rotate(0deg)";

  canvas.appendChild(box);

  box.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(box);
  });

  box.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return;

    e.preventDefault();
    e.stopPropagation();

    selectElement(box);

    isDragging = true;
    dragElement = box;
    dragOffsetX = e.offsetX;
    dragOffsetY = e.offsetY;

    document.body.style.userSelect = "none";
  });

  elements.push({ id, type: "rectangle", el: box });
  selectedElementId = id;

  renderLayers();
  saveLayout();
}

// -------- Create Text Element --------

function createText(x, y) {
  // wrapper element (this is the actual canvas element)
  const textBox = document.createElement("div");

  const id = `text-${++idCounter}`;
  textBox.dataset.id = id;
  textBox.dataset.type = "text";
  textBox.classList.add("canvas-element", "text-element");

  const width = 150;
  const minHeight = 40;

  // positioning
  textBox.style.position = "absolute";
  textBox.style.left = `${x - width / 2}px`;
  textBox.style.top = `${y - minHeight / 2}px`;
  textBox.style.width = `${width}px`;
  textBox.style.minHeight = `${minHeight}px`;

  // text behavior (CRITICAL)
  textBox.style.whiteSpace = "pre-wrap";
  textBox.style.wordBreak = "keep-all";
  textBox.style.overflowWrap = "normal";

  // rotation
  textBox.dataset.rotation = "0";
  textBox.style.transform = "rotate(0deg)";

  // editable content INSIDE wrapper
  const textContent = document.createElement("div");
  textContent.classList.add("text-content");
  textContent.contentEditable = "false";
  textContent.innerText = "Text";
  textContent.style.outline = "none";
  textContent.style.cursor = "text";
  textContent.addEventListener("input", () => {
  textBox.style.height = "auto";
  textBox.style.height = textBox.scrollHeight + "px";
  saveLayout();
});


  textBox.appendChild(textContent);
  canvas.appendChild(textBox);

  // 🔧 auto-size height to content
  textBox.style.height = "auto";
  textBox.style.height = textBox.scrollHeight + "px";

  // selection
  textBox.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(textBox);
  });
  textContent.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    textContent.contentEditable = "true";
    textContent.focus();
    isEditingText = true;

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(textContent);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  });


  // drag (DO NOT block caret)
  textBox.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return;

    e.stopPropagation();
    selectElement(textBox);

    // ❗ text itself should not prevent typing
    if (e.target === textContent) return;

    isDragging = true;
    dragElement = textBox;
    dragOffsetX = e.offsetX;
    dragOffsetY = e.offsetY;

    document.body.style.userSelect = "none";
  });

  // focus caret at end
  textContent.focus();
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(textContent);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  elements.push({ id, type: "text", el: textBox });
  selectedElementId = id;

  renderLayers();
  saveLayout();
}