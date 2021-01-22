let devicesList = document.getElementById("devices");
let loginForm = document.getElementById("login");
let logoutButton = document.getElementById("logout");

let token = localStorage.getItem("token");

let headers = {
  Authorization: token,
};

logoutButton.onclick = () => {
  logoutButton.style.display = "none";
  loginForm.style.display = "block";
  devicesList.innerHTML = "";
  localStorage.removeItem("token");
};

if (token) {
  logoutButton.style.display = "block";
  loadDevices();
} else {
  logoutButton.style.display = "none";
  devicesList.innerHTML = "";
  loginForm.style.display = "block";
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    token = document.getElementsByName("token")[0].value;
    localStorage.setItem("token", token);
    headers["Authorization"] = token;
    logoutButton.style.display = "block";
    loadDevices();
  };
}

function loadDevices() {
  loginForm.style.display = "none";
  fetch("/api/devices", {
    headers,
  })
    .then((r) => r.json())
    .then((devices) => {
      devicesList.innerHTML = "";
      for (let device of devices) {
        devicesList.innerHTML += createCard(device);
        getStatus(device);
        setInterval(() => {
          getStatus(device);
        }, 5000);
      }
    })
    .catch((error) => {
      localStorage.removeItem("token");
      loginForm.style.display = "block";
    });
}

async function getStatus(device) {
  let response = await fetch("/api/device/" + device.mac, {
    headers,
  });
  let status = await response.text();
  let element = document.getElementById(device.mac);

  document.getElementById(device.mac + "-update").innerHTML = "Latest update " + new Date().toLocaleTimeString();
  element.innerHTML = status;
  if (status == "Online") {
    element.classList.add("text-success");
  } else if (status == "Offline") {
    element.classList.add("text-danger");
    element.parentElement.parentElement.getElementsByTagName("button")[0].style.visibility = "visible";
  } else {
    element.classList.add("text-warning");
  }
}

function wakeUp(element, mac) {
  element.disabled = true;
  element.innerHTML = "Waking up...";
  fetch("/api/device/" + mac, { method: "POST", headers });
}

function createCard(device) {
  return `
<div class="col-md-6 col-lg-4 mt-2">
    <div class="card m-1">
        <div class="card-body text-center">
            <h5 class="card-title">${device.name}</h5>
            <p class="card-text">
            MAC: ${device.mac}<br />
            IP: ${device.ip}<br />
            Status: <span id="${device.mac}">Loading...</span>
            </p>
            <div class="d-grid gap-2 invisible">
                <button onclick="wakeUp(this, '${device.mac}')" class="btn btn-dark" type="button">Wake up</button>
            </div>
            <small class="text-muted"><span id="${device.mac}-update">Loading...</span></small>
            </div>
    </div>
</div>`;
}
