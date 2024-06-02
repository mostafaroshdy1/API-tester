const methodSelect = document.getElementById("methodSelect");
const endpointInput = document.getElementById("endpointInput");
const sendRequestBtn = document.getElementById("sendRequestBtn");
const responseContainer = document.getElementById("responseContainer");
const addKeyValuePairBtn = document.getElementById("addKeyValuePairBtn");
const keyValuePairsContainer = document.getElementById("keyValuePairs");
const addHeaderPairBtn = document.getElementById("addHeaderPairBtn");
const headerPairsContainer = document.getElementById("headerPairs");

let data = {};

methodSelect.addEventListener("change", () => {
  const method = methodSelect.value;
  if (method === "PUT" || method === "POST" || method === "PATCH") {
    data = {};
    document.getElementById("dataInput").style.display = "block";
  } else {
    document.getElementById("dataInput").style.display = "none";
  }
});

addKeyValuePairBtn.addEventListener("click", () => {
  addKeyValuePair();
});

addHeaderPairBtn.addEventListener("click", () => {
  addHeaderPair();
});

sendRequestBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission default behavior
  const method = methodSelect.value;
  const endpoint = endpointInput.value;

  const headers = {
    "Content-Type": "application/json", // Assuming JSON data
  };

  // Add user-defined headers
  const headerInputs = document.querySelectorAll(".header-key-input");
  const headerValues = document.querySelectorAll(".header-value-input");
  headerInputs.forEach((headerInput, index) => {
    const key = headerInput.value.trim();
    const value = headerValues[index].value.trim();
    if (key !== "" && value !== "") {
      headers[key] = value;
    }
  });

  let options = {
    method,
    headers,
  };

  if (method === "PUT" || method === "POST" || method === "PATCH") {
    data = {}; // Clear data object
    const keyInputs = document.querySelectorAll(".key-input");
    const valueInputs = document.querySelectorAll(".value-input");
    keyInputs.forEach((keyInput, index) => {
      const key = keyInput.value.trim();
      const value = valueInputs[index].value.trim();
      if (key !== "" && value !== "") {
        data[key] = value;
      }
    });
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(endpoint, options);
    const status = response.status; // Capture the status code
    const responseData = await response.json();
    displayResponse(status, responseData);
  } catch (error) {
    displayResponse(null, {
      error: "Error occurred while sending the request.",
    });
  }
});

function displayResponse(status, responseData) {
  let responseHtml = "<h3>Response:</h3>";
  if (status !== null) {
    responseHtml += `<p>Status Code: ${status}</p>`;
  }
  if (responseData.error) {
    responseHtml += `<p class="text-danger">${responseData.error}</p>`;
  } else {
    responseHtml += `<pre>${JSON.stringify(responseData, null, 2)}</pre>`;
  }
  responseContainer.innerHTML = responseHtml;
}

function addKeyValuePair() {
  const keyValuePair = document.createElement("div");
  keyValuePair.classList.add("input-group");
  keyValuePair.innerHTML = `
    <input type="text" class="form-control key-input" placeholder="Key">
    <input type="text" class="form-control value-input" placeholder="Value">
    <button class="btn btn-outline-danger" type="button">Remove</button>`;
  keyValuePair.querySelector("button").addEventListener("click", () => {
    keyValuePair.remove();
  });
  keyValuePairsContainer.appendChild(keyValuePair);
}

function addHeaderPair() {
  const headerPair = document.createElement("div");
  headerPair.classList.add("input-group");
  headerPair.innerHTML = `
    <input type="text" class="form-control header-key-input" placeholder="Header Key">
    <input type="text" class="form-control header-value-input" placeholder="Header Value">
    <button class="btn btn-outline-danger" type="button">Remove</button>`;
  headerPair.querySelector("button").addEventListener("click", () => {
    headerPair.remove();
  });
  headerPairsContainer.appendChild(headerPair);
}
