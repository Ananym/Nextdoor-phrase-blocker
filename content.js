const processedPosts = new Set();

function blockPosts(blockedPhrases) {
  const feedItems = document.querySelectorAll('div[id^="feedItem_"]');
  feedItems.forEach((feedItem) => {
    const postContainer = feedItem.parentElement?.parentElement;
    if (!postContainer || processedPosts.has(postContainer)) return;

    const postContent = postContainer.textContent.toLowerCase();
    const matchedPhrases = blockedPhrases.filter((phrase) =>
      postContent.includes(phrase.toLowerCase())
    );
    if (matchedPhrases.length > 0) {
      postContainer.style.display = "none";
      const blockMessage = document.createElement("div");
      blockMessage.style.color = "#888888";
      blockMessage.style.padding = "4px";
      blockMessage.style.fontStyle = "italic";
      blockMessage.textContent = `Post blocked due to matched phrase${
        matchedPhrases.length > 1 ? "s" : ""
      }: ${matchedPhrases.join(", ")}`;
      postContainer.parentNode.insertBefore(blockMessage, postContainer);
      const truncatedContent = truncateString(postContent, 50);
      console.log(
        `Nextdoor Post Blocker: Blocking post with content: ${truncatedContent}`
      );
    }
    processedPosts.add(postContainer);
  });
}

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

function observePosts(blockedPhrases) {
  const observer = new MutationObserver(() => {
    blockPosts(blockedPhrases);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initializeBlocking() {
  chrome.storage.sync.get(["blockedPhrases"], function (result) {
    if (result.blockedPhrases) {
      console.log("Blocking with blocked phrases:", result.blockedPhrases);
      processedPosts.clear();
      blockPosts(result.blockedPhrases);
      observePosts(result.blockedPhrases);
    }
  });
}

initializeBlocking();

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.blockedPhrases) {
    console.log("Blocked phrases changed:", changes.blockedPhrases.newValue);
    blockPosts(changes.blockedPhrases.newValue);
  }
});
