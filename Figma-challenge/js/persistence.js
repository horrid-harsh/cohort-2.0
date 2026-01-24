// -------- Persistence --------

function serializeElements() {
  return elements.map((item, index) => {
    const el = item.el;

    return {
      id: item.id,
      type: item.type,
      x: parseInt(el.style.left) || 0,
      y: parseInt(el.style.top) || 0,
      width: parseInt(el.style.width) || 0,
      height: parseInt(el.style.height) || 0,
      rotation: el.dataset.rotation || 0,
      text: item.type === "text" ? el.innerText : null,
      styles: {
        backgroundColor: el.style.backgroundColor,
        opacity: el.style.opacity,
        borderRadius: el.style.borderRadius,
      },
      zIndex: index,
    };
  });
}

function saveLayout() {
  const data = serializeElements();
  localStorage.setItem("editor-layout", JSON.stringify(data));
}

function loadLayout() {
  const raw = localStorage.getItem("editor-layout");
  if (!raw) return;

  const data = JSON.parse(raw);

  // clear current state
  elements = [];
  canvas.innerHTML = "";
  selectedElementId = null;

  data.forEach((item) => {
    let el;

    /* ---------------- RECTANGLE ---------------- */
    if (item.type === "rectangle") {
      el = document.createElement("div");
      el.classList.add("canvas-element");

      el.style.width = `${item.width}px`;
      el.style.height = `${item.height}px`;
    } else if (item.type === "text") {

    /* ---------------- TEXT ---------------- */
      el = document.createElement("div");
      el.classList.add("canvas-element", "text-element");

      el.style.width = `${item.width}px`;
      el.style.minHeight = `${item.height}px`;
      el.style.height = "auto";

      // inner editable content
      const textContent = document.createElement("div");
      textContent.classList.add("text-content");
      textContent.contentEditable = "false";
      textContent.innerText = item.text || "";
      textContent.style.outline = "none";
      textContent.style.cursor = "text";

      el.appendChild(textContent);

      // auto-height on typing
      textContent.addEventListener("input", () => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
        saveLayout();
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

      // auto-height after load
      requestAnimationFrame(() => {
        // el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      });
    }

    /* ---------------- COMMON ---------------- */
    el.dataset.id = item.id;
    el.dataset.type = item.type;
    el.dataset.rotation = item.rotation;

    el.style.position = "absolute";
    el.style.left = `${item.x}px`;
    el.style.top = `${item.y}px`;
    el.style.transform = `rotate(${item.rotation}deg)`;

    // restore styles (bg, opacity, radius, etc.)
    Object.assign(el.style, item.styles || {});

    // z-index (layer order)
    el.style.zIndex = item.zIndex + 1;

    /* ---------------- SELECTION ---------------- */
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectElement(el);
    });

    /* ---------------- DRAG ---------------- */
    el.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("resize-handle")) return;

      e.stopPropagation();
      selectElement(el);

      // ❗ allow text editing
      if (item.type === "text" && e.target.classList.contains("text-content")) {
        return;
      }

      e.preventDefault();

      isDragging = true;
      dragElement = el;
      dragOffsetX = e.offsetX;
      dragOffsetY = e.offsetY;
    });

    canvas.appendChild(el);

    elements.push({
      id: item.id,
      type: item.type,
      el,
    });

    // sync id counter
    const num = Number(item.id.split("-")[1]);
    idCounter = Math.max(idCounter, num);
  });

  renderLayers();
}

loadLayout();