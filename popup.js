document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("blockedPhrases");
  const saveButton = document.getElementById("saveButton");

  chrome.storage.sync.get(["blockedPhrases"], function (result) {
    if (result.blockedPhrases) {
      textarea.value = result.blockedPhrases.join("\n");
    }
  });

  saveButton.addEventListener("click", function () {
    const phrases = textarea.value
      .split("\n")
      .filter((phrase) => phrase.trim() !== "");
    chrome.storage.sync.set({ blockedPhrases: phrases }, function () {
      alert("Phrases saved!");
    });
  });
});
