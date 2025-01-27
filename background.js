chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "refreshNextdoorTabs") {
    chrome.tabs.query({url: "https://nextdoor.co.uk/*"}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.reload(tab.id);
      });
    });
  }
});
