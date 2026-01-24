// Prevent clicks inside bottom toolbar from affecting canvas

bottomPanel.addEventListener("click", (e) => e.stopPropagation());

/* ---------------- Tool Selection ---------------- */

// Activate rectangle tool
rectangleBtn.addEventListener("click", () => {
  currentTool = "rectangle";
  canvas.style.cursor = "crosshair";
});

// Activate text tool
textBtn.addEventListener("click", () => {
  currentTool = "text";
  canvas.style.cursor = "crosshair";
});

/* ---------------- Canvas Interaction ---------------- */

canvas.addEventListener("click", (e) => {
  // CASE 1: Tool is active → create element
  if (currentTool) {
    if (e.target !== canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "rectangle") {
      createRectangle(x, y);
    } else if (currentTool === "text") {
      createText(x, y);
    }

    currentTool = null;
    canvas.style.cursor = "default";
    return;
  }

  // CASE 2: No tool → deselect
  if (e.target === canvas) {
    clearSelection();
  }
});

/* ---------------- Delete Control ---------------- */

deleteBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  deleteSelectedElement();
});



