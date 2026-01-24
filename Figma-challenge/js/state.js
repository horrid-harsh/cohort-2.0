// -------- Global Editor State --------

// elements & selection
let elements = [];
let selectedElementId = null;
let idCounter = 0;

// tools
let currentTool = null; // "rectangle" | "text" | null

// dragging
let isDragging = false;
let dragElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// resizing (elements)
let isResizing = false;
let resizeHandle = null;
let resizeElement = null;

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

const MIN_SIZE = 20;

// text editing mode
let isEditingText = false;

// panel resizing
let isResizingPanel = false;
let activeResizer = null;