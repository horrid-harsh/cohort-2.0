// -------- Keyboard Controls --------

document.addEventListener("keydown", (e) => {
  if (isEditingText) return;

  const el = getSelectedElement();
  if (!el) return;

  const tag = document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) {
    return;
  }

  // DELETE
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    deleteSelectedElement();
    return;
  }

  // ARROW KEYS
  const step = 5;
  let left = parseInt(el.style.left) || 0;
  let top = parseInt(el.style.top) || 0;

  if (e.key === "ArrowLeft") left -= step;
  if (e.key === "ArrowRight") left += step;
  if (e.key === "ArrowUp") top -= step;
  if (e.key === "ArrowDown") top += step;

  // constrain inside canvas
  const canvasRect = canvas.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  const maxX = canvas.clientWidth - elRect.width;
  const maxY = canvas.clientHeight - elRect.height;

  left = Math.max(0, Math.min(left, maxX));
  top = Math.max(0, Math.min(top, maxY));

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;

  // update position inputs
  posXInput.value = left;
  posYInput.value = top;

  saveLayout();
});

// -------- Exit Text Edit Mode --------

function exitTextEditMode() {
  document.querySelectorAll(".text-content").forEach(tc => {
    tc.contentEditable = "false";
  });
  isEditingText = false;
}

// -------- Delete Selected Element --------

function deleteSelectedElement() {
  if (!selectedElementId) return;

  const index = elements.findIndex(e => e.id === selectedElementId);
  if (index === -1) return;

  elements[index].el.remove();
  elements.splice(index, 1);

  clearSelection();
  renderLayers();
  saveLayout();
}

// -------- Layers Panel Rendering --------

function renderLayers() {
  layersContainer.innerHTML = "";

   const typeCount = {
    rectangle: 0,
    text: 0
  };

  elements.forEach((item, index) => {

    typeCount[item.type]++;

    const label =
      item.type === "text"
        ? `Text ${typeCount.text}`
        : `Rectangle ${typeCount.rectangle}`;

    const layer = document.createElement("div");
    layer.textContent = label;
    layer.dataset.id = item.id;

    if (item.id === selectedElementId) {
      layer.classList.add("active-layer");
    }

    layer.addEventListener("click", (e) => {
      e.stopPropagation();
      selectElement(item.el);
    });

    layersContainer.appendChild(layer);

    // 🔑 z-index sync
    item.el.style.zIndex = index + 1;
  });
}

// -------- Rotation Control --------

rotationInput.addEventListener("input", () => {
  if (!selectedElementId) return;

  const el = elements.find((e) => e.id === selectedElementId)?.el;
  if (!el) return;

  const value = Number(rotationInput.value) || 0;

  el.dataset.rotation = value;
  el.style.transform = `rotate(${value}deg)`;
});

// -------- Layer Order: Move Up --------

document.getElementById("layer-up").addEventListener("click", () => {
  if (!selectedElementId) return;

  const index = elements.findIndex((e) => e.id === selectedElementId);
  if (index === -1 || index === elements.length - 1) return;

  // swap with next
  [elements[index], elements[index + 1]] = [
    elements[index + 1],
    elements[index],
  ];

  renderLayers();
});

// -------- Layer Order: Move Down --------

document.getElementById("layer-down").addEventListener("click", () => {
  if (!selectedElementId) return;

  const index = elements.findIndex((e) => e.id === selectedElementId);
  if (index <= 0) return;

  // swap with previous
  [elements[index], elements[index - 1]] = [
    elements[index - 1],
    elements[index],
  ];

  renderLayers();
});

// -------- Properties Panel --------

posXInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;
  el.style.left = `${Number(posXInput.value)}px`;

//   saveLayout();
});

posYInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;
  el.style.top = `${Number(posYInput.value)}px`;

//   saveLayout();
});

widthInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;
  el.style.width = `${Number(widthInput.value)}px`;

//   saveLayout();
});

heightInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;
  el.style.height = `${Number(heightInput.value)}px`;

//   saveLayout();  
});

opacityInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;

  let value = Number(opacityInput.value);
  value = Math.max(0, Math.min(value, 100)); // clamp 0–100

  el.style.opacity = value / 100;

//   saveLayout();
});

radiusInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;

  if(el.dataset.type === "text") return;

  el.style.borderRadius = `${Number(radiusInput.value)}px`;

//   saveLayout();
});

fillInput.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el) return;

  if (el.dataset.type == "rectangle") {
    el.style.backgroundColor = fillInput.value;
  }
  if (el.dataset.type === "text") {
    el.style.color = fillInput.value;
  }
  
  colorSquare.style.backgroundColor = fillInput.value;
  
//   saveLayout();
});

colorSquare.addEventListener("click", () => {
    colorPicker.click();
  });

  colorPicker.addEventListener("input", () => {
    const el = getSelectedElement();
    if (!el) return;

    const color = colorPicker.value;

    fillInput.value = color;
    colorSquare.style.backgroundColor = color;

    if (el.dataset.type === "rectangle") {
      el.style.backgroundColor = color;
    }

    if (el.dataset.type === "text") {
      const textNode = el.querySelector(".text-content") || el;
      textNode.style.color = color;
    }

    // saveLayout();
});


textArea.addEventListener("input", () => {
  const el = getSelectedElement();
  if (!el || el.dataset.type !== "text") return;

  el.innerText = textArea.value;

//   saveLayout();
});