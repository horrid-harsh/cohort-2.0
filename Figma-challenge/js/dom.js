// -------- DOM References --------

//cursor
const cursor = document.querySelector(".cursor");

// main layout
const canvas = document.querySelector(".canvas");
const main = document.querySelector("main");

// bottom panel
const bottomPanel = document.querySelector(".bottom");

// tool buttons
const rectangleBtn = document.querySelector(".rectangle");
const textBtn = document.querySelector(".text-box");
const deleteBtn = document.querySelector(".delete-btn");

//selection title
const selectionTitle = document.getElementById("selection-title")

// properties panel inputs
const posXInput = document.querySelector(".pos-x input");
const posYInput = document.querySelector(".pos-y input");
const rotationInput = document.querySelector(".rotation-input");

const widthInput = document.querySelector("#prop-width");
const heightInput = document.querySelector("#prop-height");

const opacityInput = document.querySelector(".opacity-cnt input");
const radiusInput = document.querySelector(".corner-rad-cnt input");

const fillInput = document.querySelector("#color-input");
const colorSquare = document.querySelector(".color-square");
const colorPicker = document.getElementById("colorPicker");


const textArea = document.querySelector("#prop-text");

// export buttons
const exportJSONBtn = document.querySelector(".export-json");
const exportHTMLBtn = document.querySelector(".export-html");

// layer panel
const layersContainer = document.querySelector(".layers");
const layerUpBtn = document.querySelector("#layer-up");
const layerDownBtn = document.querySelector("#layer-down");

// panel resizers
const leftResizer = document.querySelector(".left-resizer");
const rightResizer = document.querySelector(".right-resizer");
