// utils.js

/**
 * Converts cookies array to an object { key: value }
 */
function cookiesToObject(cookies) {
  const obj = {};
  cookies.forEach(c => {
    obj[c.name] = c.value;
  });
  return obj;
}

/**
 * Converts cookies array to a single string for header
 */
function cookiesToHeader(cookies) {
  return cookies.map(c => `${c.name}=${c.value}`).join("; ");
}

/**
 * Creates Python dict snippet
 */
function cookiesToPythonDict(cookies) {
  return cookies.map(c => `    "${c.name}": "${c.value}"`).join(",\n");
}

// Export for background.js
export { cookiesToObject, cookiesToHeader, cookiesToPythonDict };
