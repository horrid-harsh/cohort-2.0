// -------- Export Helpers --------

function buildExportData() {
  return elements.map((item, index) => {
    const el = item.el;
    const rect = el.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const data = {
      id: item.id,
      type: item.type,
      x: parseInt(el.style.left),
      y: parseInt(el.style.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      rotation: el.dataset.rotation || 0,
      zIndex: index,
      styles: {
        backgroundColor: el.style.backgroundColor || "",
        opacity: el.style.opacity || "",
        borderRadius: el.style.borderRadius || "",
      },
    };

    if (item.type === "text") {
      const textNode = el.querySelector(".text-content");
      data.text = textNode ? textNode.innerText : "";
    }

    return data;
  });
}

//JSON export
function exportJSON() {
  const data = buildExportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "design.json";
  a.click();
}

//HTML export
function exportHTML() {
  const data = buildExportData();

  let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Exported Design</title>
<style>
  body {
    margin: 0;
    background: #1e1e1e;
  }
  .canvas {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
</style>
</head>
<body>
<div class="canvas">
`;

  data.forEach((item) => {
    if (item.type === "rectangle") {
      html += `
<div style="
  position:absolute;
  left:${item.x}px;
  top:${item.y}px;
  width:${item.width}px;
  height:${item.height}px;
  background:${item.styles.backgroundColor};
  opacity:${item.styles.opacity};
  border-radius:${item.styles.borderRadius};
  transform: rotate(${item.rotation}deg);
"></div>
`;
    }

    if (item.type === "text") {
      html += `
<div style="
  position:absolute;
  left:${item.x}px;
  top:${item.y}px;
  width:${item.width}px;
  min-height:${item.height}px;
  transform: rotate(${item.rotation}deg);
  white-space: pre-wrap;
">
  ${item.text.replace(/\n/g, "<br>")}
</div>
`;
    }
  });

  html += `
</div>
</body>
</html>
`;

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "design.html";
  a.click();
}

document.querySelector(".export-json").addEventListener("click", exportJSON);
document.querySelector(".export-html").addEventListener("click", exportHTML);
