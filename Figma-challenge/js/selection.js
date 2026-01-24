// -------- Selection Logic --------

// Returns the currently selected canvas element from internal state
function getSelectedElement() {
  return elements.find((e) => e.id === selectedElementId)?.el || null;
}

// Deselects any active element and removes selection visuals and handles
function clearSelection() {
  const prev = document.querySelector(".selected");
  if (prev) {
    prev.classList.remove("selected");
    removeResizeHandles(prev);
  }

  selectedElementId = null;

  selectionTitle.textContent = "Properties"

  renderLayers();
  posXInput.value = "";
  posYInput.value = "";

  widthInput.value = "";
  heightInput.value = "";

  opacityInput.value = "";
  radiusInput.value = "";

  fillInput.value = "";
  textArea.value = "";
  textArea.classList.add("hidden");

  // rotationInput.value = "";
}

// Sets the given element as selected, syncs UI panels, and shows resize handles
function selectElement(el) {
  clearSelection();

  el.classList.add("selected");
  selectedElementId = el.dataset.id;

  if(el.dataset.type === "rectangle") {
    selectionTitle.textContent = "Rectangle";
    fillInput.value = el.style.backgroundColor || "";
    colorSquare.style.backgroundColor = el.style.backgroundColor || "white";

  } else if (el.dataset.type === "text") {
  selectionTitle.textContent = "Text";

  const textNode = el.querySelector(".text-content") || el;
  const color = getComputedStyle(textNode).color;

  fillInput.value = color;
  colorSquare.style.backgroundColor = color;
}

  // position
  posXInput.value = parseInt(el.style.left) || 0;
  posYInput.value = parseInt(el.style.top) || 0;

  // rotation
  rotationInput.value = el.dataset.rotation || 0;

  // size
  const rect = el.getBoundingClientRect();
  widthInput.value = parseInt(el.style.width) || Math.round(rect.width);
  heightInput.value = parseInt(el.style.height) || Math.round(rect.width);

  // appearance
  opacityInput.value = el.style.opacity
    ? Math.round(el.style.opacity * 100)
    : 100;

  radiusInput.value = parseInt(el.style.borderRadius) || 0;

  // text
  if (el.dataset.type === "text") {
    textArea.classList.remove("hidden");
    textArea.value = el.innerText;
  } else {
    textArea.classList.add("hidden");
    textArea.value = "";
  }

  addResizeHandles(el);
  renderLayers();
}

// Adds corner resize handles to the selected element
function addResizeHandles(el) {
  const handles = ["tl", "tr", "bl", "br"];

  handles.forEach((pos) => {
    const handle = document.createElement("div");
    handle.className = `resize-handle ${pos}`;

    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();

      isResizing = true;
      resizeHandle = pos;
      resizeElement = el;

      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = rect.left - canvasRect.left;
      startTop = rect.top - canvasRect.top;
    });

    el.appendChild(handle);
  });
}

// Removes all resize handles from the previously selected element
function removeResizeHandles(el) {
  el.querySelectorAll(".resize-handle").forEach((h) => h.remove());
}