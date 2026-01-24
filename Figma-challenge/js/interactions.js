// -------- Mouse Move Handler --------
// Handles resizing (priority) and dragging of selected elements

document.addEventListener("mousemove", (e) => {
  // 🔵 RESIZE (highest priority)
  if (isResizing && resizeElement) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (resizeHandle.includes("r")) {
      newWidth = startWidth + dx;
    }
    if (resizeHandle.includes("l")) {
      newWidth = startWidth - dx;
      newLeft = startLeft + dx;
    }
    if (resizeHandle.includes("b")) {
      newHeight = startHeight + dy;
    }
    if (resizeHandle.includes("t")) {
      newHeight = startHeight - dy;
      newTop = startTop + dy;
    }

    // 🔒 minimum size
    newWidth = Math.max(MIN_SIZE, newWidth);
    newHeight = Math.max(MIN_SIZE, newHeight);

    resizeElement.style.width = `${newWidth}px`;
    resizeElement.style.height = `${newHeight}px`;
    resizeElement.style.left = `${newLeft}px`;
    resizeElement.style.top = `${newTop}px`;

    if (resizeElement.dataset.type === "text") {
      resizeElement.style.height = "auto";
      resizeElement.style.height = resizeElement.scrollHeight + "px";
    }

    return; // 🚨 STOP HERE, DO NOT DRAG
  }

  // 🟢 DRAG
  if (isDragging && dragElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const elRect = dragElement.getBoundingClientRect();

    let newX = e.clientX - canvasRect.left - dragOffsetX;
    let newY = e.clientY - canvasRect.top - dragOffsetY;

    const maxX = canvas.clientWidth - elRect.width;
    const maxY = canvas.clientHeight - elRect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    dragElement.style.left = `${newX}px`;
    dragElement.style.top = `${newY}px`;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  dragElement = null;

  isResizing = false;
  resizeElement = null;
  resizeHandle = null;
  isResizingPanel = false;
  activeResizer = null;

  document.body.style.cursor = "default";
  document.body.style.userSelect = "auto";
  saveLayout();

});

// -------- Panel Resizer Controls --------

document.querySelectorAll(".resizer").forEach(resizer => {
  resizer.addEventListener("mousedown", e => {
    isResizingPanel = true;
    activeResizer = resizer;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  });
});

// -------- Panel Resize Mouse Move --------
// Dynamically resizes left and right panels while dragging resizer bars

document.addEventListener("mousemove", (e) => {
  if (!isResizingPanel) return;

  const main = document.querySelector("main");
  const rect = main.getBoundingClientRect();

  let x = e.clientX - rect.left;

  const minLeft = 350;
  const maxLeft = 600;

  const minRight = 350;
  const maxRight = 600;

  const resizerWidth = 4;

  if (activeResizer.classList.contains("left-resizer")) {
    let leftWidth = x;

    // clamp
    leftWidth = Math.max(minLeft, Math.min(leftWidth, maxLeft));

    main.style.gridTemplateColumns = `
      ${leftWidth}px
      ${resizerWidth}px
      1fr
      ${resizerWidth}px
      ${getRightWidth()}px
    `;
  }

  if (activeResizer.classList.contains("right-resizer")) {
    let rightWidth = rect.width - x;

    // clamp
    rightWidth = Math.max(minRight, Math.min(rightWidth, maxRight));

    main.style.gridTemplateColumns = `
      ${getLeftWidth()}px
      ${resizerWidth}px
      1fr
      ${resizerWidth}px
      ${rightWidth}px
    `;
  }
});

// -------- Get Left Panel Width --------

function getLeftWidth() {
  return document.querySelector(".left").offsetWidth;
}

// -------- Get Right Panel Width -------

function getRightWidth() {
  return document.querySelector(".right").offsetWidth;
}