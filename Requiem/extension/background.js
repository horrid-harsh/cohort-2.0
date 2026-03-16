// Background service worker
// Currently minimal — just handles extension install event

chrome.runtime.onInstalled.addListener(() => {
  console.log("Requiem extension installed");
});
