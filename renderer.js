const methodSelect = document.getElementById("methodSelect");
const endpointInput = document.getElementById("endpointInput");
const tokenTypeSelect = document.getElementById("tokenTypeSelect");
const tokenInput = document.getElementById("tokenInput");
const sendRequestBtn = document.getElementById("sendRequestBtn");
const responseContainer = document.getElementById("responseContainer");
const addKeyValuePairBtn = document.getElementById("addKeyValuePairBtn");
const keyValuePairsContainer = document.getElementById("keyValuePairs");

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

sendRequestBtn.addEventListener("click", async () => {
  const method = methodSelect.value;
  const endpoint = endpointInput.value;
  const tokenType = tokenTypeSelect.value;
  const token = tokenInput.value;

  const headers = {
    "Content-Type": "application/json",
  };

  if (tokenType === "x-api-key") {
    if (token.trim() !== "") {
      headers[tokenType] = token;
    }
  }

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
    const responseData = await response.json();
    displayResponse(responseData);
  } catch (error) {
    displayResponse({ error: "Error occurred while sending the request." });
  }
});

function displayResponse(responseData) {
  let responseHtml = "<h3>Response:</h3>";
  if (responseData.error) {
    responseHtml += `<p class="text-danger">${responseData.error}</p>`;
  } else {
    responseHtml += `<pre>${JSON.stringify(responseData, null, 2)}</pre>`;
  }
  responseContainer.innerHTML = responseHtml;
}

function addKeyValuePair() {
  const keyValuePair = document.createElement("div");
  keyValuePair.classList.add("mb-3");
  keyValuePair.innerHTML = `
    <div class="input-group">
      <input type="text" class="form-control key-input" placeholder="Key">
      <input type="text" class="form-control value-input" placeholder="Value">
      <button class="btn btn-outline-secondary" type="button" onclick="removeKeyValuePair(this)">Remove</button>
    </div>`;
  keyValuePairsContainer.appendChild(keyValuePair);
}

function removeKeyValuePair(button) {
  const keyValuePair = button.parentElement.parentElement;
  keyValuePair.remove();
}
