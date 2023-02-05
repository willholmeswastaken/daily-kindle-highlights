document
    .getElementById("go-to-button-kindle")
    .addEventListener("click", navigateToKindleLibrary);
document
    .getElementById("go-to-button-rekindle")
    .addEventListener("click", navigateToRekindled);
function navigateToKindleLibrary() {
    chrome.tabs.create({ url: "https://read.amazon.com/notebook" });
    alert(window.location.href);
}
function navigateToRekindled() {
    chrome.tabs.create({ url: "http://localhost:3000" });
}
