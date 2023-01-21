chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.scripting
      .insertCSS({
        target: { tabId: tabId },
        files: ["content-scripts/foreground.css"],
      })
      .then(() => console.log("injected css"))
      .catch((err) => console.log(err));

    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["content-scripts/foreground.js"],
      })
      .then(() => console.log("injected js"))
      .catch((err) => console.log(err));
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    console.log(tab.url);
    chrome.storage.local.get("link", function (result) {
      if (result.link.length < 10) {
        console.log(result.link);
        var new_links = [{ link: tab.url, title: tab.title }, ...result.link];
        console.log(new_links);
        chrome.storage.local.set({ link: new_links });
      } else {
        chrome.storage.local.remove("link");
        console.log('cleared "link"');
        var new_links = [{ link: tab.url, title: tab.title }];
        chrome.storage.local.set({ link: new_links });
        console.log("set new 'link' key");
      }
    });
  }
});

//listen for message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "get-links") {
    chrome.storage.local.get("link", function (result) {
      if (result.link) {
        sendResponse({ message: "success", links: result.link });
      }
    });
  }
  return true;
});
