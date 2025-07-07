import { cookiesToObject, cookiesToHeader, cookiesToPythonDict } from './utils.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const url = new URL(request.url);

  if (request.action === "get-cookies") {
    chrome.cookies.getAll({ domain: url.hostname }, cookies => {
      sendResponse({ cookies });
    });
    return true;
  }

  // Handle snippet generation
  const cookies = request.selectedCookies || [];

  const cookieObj = cookiesToObject(cookies);
  const cookieHeader = cookiesToHeader(cookies);
  let output = "";

  switch (request.action) {
    case "copy-json":
      output = JSON.stringify(cookieObj, null, 2);
      break;
    case "copy-header":
      output = `Cookie: ${cookieHeader}`;
      break;
    case "copy-curl":
      output = `curl '${request.url}' -H 'Cookie: ${cookieHeader}'`;
      break;
    case "copy-fetch":
      output = `fetch("${request.url}", {\n  headers: {\n    "Cookie": "${cookieHeader}"\n  }\n});`;
      break;
    case "copy-python":
      output = `import requests\n\ncookies = {\n${cookiesToPythonDict(cookies)}\n}\nresponse = requests.get("${request.url}", cookies=cookies)\nprint(response.text)`;
      break;
  }

  sendResponse({ text: output });
  return true;
});
