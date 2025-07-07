let allCookies = [];

function renderCookieList() {
  const list = document.getElementById("cookie-list");
  list.innerHTML = "";
  allCookies.forEach((cookie, index) => {
    const id = `cookie-${index}`;
    list.innerHTML += `
      <label><input type="checkbox" id="${id}" checked />
      ${cookie.name} = ${cookie.value}</label>`;
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.runtime.sendMessage({ action: "get-cookies", url: tab.url }, response => {
    allCookies = response.cookies || [];
    renderCookieList();
  });
});

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", async () => {
    const selectedCookies = allCookies.filter((_, i) =>
      document.getElementById(`cookie-${i}`).checked
    );

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.runtime.sendMessage({
      action: btn.id,
      url: tab.url,
      selectedCookies: selectedCookies
    }, response => {
      if (response?.text) {
        navigator.clipboard.writeText(response.text).then(() => {
          document.getElementById("status").textContent = "✅ Copied!";
          setTimeout(() => document.getElementById("status").textContent = "", 1500);
        });
      } else {
        document.getElementById("status").textContent = "❌ Failed!";
      }
    });
  });
});
