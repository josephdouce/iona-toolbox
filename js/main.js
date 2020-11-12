var passphrase = null;
var dataStore = {};
let deferredPrompt = null;

// Log in button action
function login() {
  passphrase = document.getElementById("login-password").value;
  // File path, display tab, data storage variable
  processFile("encrypted_csv_files/electrical_isolation_encrypted.csv", "Isolations");
  processFile("encrypted_csv_files/emergency_stations_encrypted.csv", "Emergency Stations");
  processFile("encrypted_csv_files/hydraulic_valves_encrypted.csv", "Valves");
  processFile("encrypted_csv_files/engine_sensors_encrypted.csv", "Sensors");
  processFile("encrypted_csv_files/hvac_hood_dampers_encrypted.csv", "Hood Dampers");
  processFile("encrypted_csv_files/hvac_fm_fp_encrypted.csv", "FM FP");
  processFile("encrypted_csv_files/hvac_acr_locations_encrypted.csv", "ACR Locations");
  processFile("encrypted_csv_files/hvac_ms_fans_encrypted.csv", "Machinery Fans");
  processFile("encrypted_csv_files/plumbers_potable_strp_encrypted.csv", "Potable Water SRTP");
}

// Menu structure to use to build the UI higherachy
var menuStructure = {
  label: "Home",
  sub: [
    {
      label: "Mechanical",
      icon: "mdi-wrench",
      sub: [
        {
          label: "Valves",
          icon: "mdi-reflect-vertical mdi-rotate-90",
          sub: null,
        },
        {
          label: "Engine",
          icon: "mdi-engine",
          sub: [
            {
              label: "Sensors",
              icon: "mdi-coolant-temperature",
              sub: null,
            },
          ],
        },
      ],
    },
    {
      label: "Electrical",
      icon: "mdi-flash",
      sub: [
        {
          label: "Isolations",
          icon: "mdi-electric-switch",
          sub: null,
        },
      ],
    },
    {
      label: "Emergency",
      icon: "mdi-alarm-light",
      sub: [
        {
          label: "Emergency Stations",
          icon: "mdi-bullhorn",
          sub: null,
        },
      ],
    },
    {
      label: "Plumbers",
      icon: "mdi-water-pump",
      sub: [
        // {
        //   label: "Mini-Fog",
        //   icon: "mdi-sprinkler-variant mdi-rotate-180",
        //   sub: null,
        // },
        // {
        //   label: "Fire Main",
        //   icon: "mdi-fire-hydrant",
        //   sub: null,
        // },
        {
          label: "Potable Water SRTP",
          icon: "mdi-water",
          sub: null,
        },
        // {
        //   label: "Back Flow Preventers",
        //   icon: "mdi-pipe-disconnected",
        //   sub: null,
        // },
        // {
        //   label: "Bulkhead Valves",
        //   icon: "mdi-reflect-vertical mdi-rotate-90",
        //   sub: null,
        // },
        // {
        //   label: "Black Water",
        //   icon: "mdi-toilet",
        //   sub: null,
        // },
      ],
    },
    {
      label: "HVAC",
      icon: "mdi-hvac",
      sub: [
        {
          label: "ACR Locations",
          icon: "mdi-thermometer",
          sub: null,
        },
        {
          label: "FM FP",
          icon: "mdi-fan mdi-spin",
          sub: null,
        },
        {
          label: "Machinery Fans",
          icon: "mdi-fan mdi-spin",
          sub: null,
        },
        {
          label: "Hood Dampers",
          icon: "mdi-valve",
          sub: null,
        },
      ],
    },
  ],
};

// Build the menu from the menuStructure object
function menuBuilder(parent) {
  for (var y in parent.sub) {
    var p, newElement, newElement3, newElement3, newElement4;
    var sub = parent.sub[y];

    p = document.getElementById(parent["label"]);
    newElement = document.createElement("div");
    newElement2 = document.createElement("div");
    newElement3 = document.createElement("i");
    newElement4 = document.createElement("p");

    newElement.setAttribute("class", "w3-col l3 m4 s6 w3-margin-bottom");

    newElement2.setAttribute("class", "w3-card w3-container w3-display-container w3-theme-l5");
    newElement2.setAttribute("style", "padding-top: 100%");
    newElement2.setAttribute("onclick", "openTab('" + sub["label"] + "')");

    newElement3.setAttribute("class", "mdi " + sub["icon"] + " w3-margin-bottom w3-text-theme w3-hover-opacity w3-display-middle w3-jumbo");

    newElement4.setAttribute("class", "w3-text-theme w3-display-topmiddle");
    newElement4.innerHTML = sub["label"];

    newElement2.appendChild(newElement3);
    newElement2.appendChild(newElement4);
    newElement.appendChild(newElement2);
    p.appendChild(newElement);

    p = document.getElementById("main-content");
    newElement = document.createElement("div");

    newElement.setAttribute("class", "w3-row-padding w3-center w3-margin-top tabPage");
    newElement.setAttribute("style", "display:none");
    newElement.setAttribute("id", sub["label"]);
    p.appendChild(newElement);

    if (sub != null) {
      menuBuilder(sub);
    }
  }
}

function w3_open() {
  document.getElementById("sideBar").style.display = "block";
}

function w3_close() {
  document.getElementById("sideBar").style.display = "none";
}

function sendMail() {
  var recipient = "josephdouce";
  var at = String.fromCharCode(64);
  var host = "gmail.com";
  document.location.href =
    "mailto:" +
    recipient +
    at +
    host +
    "?subject=" +
    encodeURIComponent("Iona Toolbox Support: " + document.getElementById("senderName").value) +
    "&body=" +
    encodeURIComponent(document.getElementById("mailBody").value);
}

// Encrypt the selected file and display the data
function encryptFile() {
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var ciphertext = CryptoJS.AES.encrypt(event.target.result, passphrase).toString();
    document.getElementById("encrypt-display").innerHTML = ciphertext;
  };

  if (file) {
    reader.readAsText(file);
  } else {
    document.getElementById("encrypt-display").innerHTML = "No file selected";
  }
}

// Decrypt the selected file and display the data
function decryptFile() {
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var bytes = CryptoJS.AES.decrypt(event.target.result, passphrase);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    document.getElementById("encrypt-display").innerHTML = originalText;
  };

  if (file) {
    reader.readAsText(file);
  } else {
    document.getElementById("encrypt-display").innerHTML = "No file selected";
  }
}

function downloadFile() {
  //inputTextToSave--> the text area from which the text to save is
  //taken from
  var textToSave = document.getElementById("encrypt-display").innerHTML;
  var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  //inputFileNameToSaveAs-->The text field in which the user input for
  //the desired file name is input into.
  var fileNameToSaveAs = document.getElementById("inputFile").value.slice(12);

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

// Process csv file and display the data in the relevent tab
function processFile(filePath, tab) {
  var selectId = tab.replace(/ /g, "").toLowerCase() + "Select";
  var displayId = tab.replace(/ /g, "").toLowerCase() + "Display";
  var searchInputId = tab.replace(/ /g, "").toLowerCase() + "SearchInput";
  // Fetch encrypted .csv file and process is with papa
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      // Decrypt
      var bytes = CryptoJS.AES.decrypt(data, passphrase);
      try {
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
      } catch (err) {
        document.getElementById("passwordPanel").style.display = "block";
        return;
      }

      // Parse decrypted data
      Papa.parse(originalText, {
        header: true,
        complete: function (results) {
          dataStore[filePath.slice(20, -14)] = results;
          pageBuilder(tab, selectId, displayId, searchInputId);
          for (i = 0; i < dataStore[filePath.slice(20, -14)].data.length; i++) {
            var option = document.createElement("option");
            option.text = dataStore[filePath.slice(20, -14)].data[i]["Display Name"];
            option.value = dataStore[filePath.slice(20, -14)].data[i]["Id"];
            document.getElementById(selectId).add(option);
          }
          // Enter key and change event handlers
          $("#" + searchInputId).keypress(function (event) {
            if (event.keyCode === 13) {
              searchData(document.getElementById(searchInputId).value, dataStore[filePath.slice(20, -14)], selectId);
              dropdownSelected(selectId, displayId, dataStore[filePath.slice(20, -14)]);
            }
          });
          $("#" + selectId).change(function (event) {
            if (event) {
              dropdownSelected(selectId, displayId, dataStore[filePath.slice(20, -14)]);
            }
          });
          dropdownSelected(selectId, displayId, dataStore[filePath.slice(20, -14)]);

          // Hide password panel
          document.getElementById("login-page").style.display = "none";
          document.getElementById("passwordPanel").style.display = "none";
          document.getElementById("main-content").style.display = "block";
        },
      });
    });
}

// Build UI page

function pageBuilder(tab, selectId, displayId, searchInputId) {
  // Search box
  p = document.getElementById(tab);
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement3 = document.createElement("input");

  newElement.setAttribute("class", "w3-row-padding");
  newElement2.setAttribute("class", "w3-col s12 m4 l4");
  newElement3.setAttribute("class", "w3-input w3-border w3-margin-top");
  newElement3.setAttribute("placeholder", "Search");
  newElement3.setAttribute("type", "text");
  newElement3.setAttribute("id", searchInputId);

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);

  p.appendChild(newElement);

  // Select box
  p = document.getElementById(tab);
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement3 = document.createElement("label");
  newElement4 = document.createElement("select");

  newElement.setAttribute("class", "w3-row-padding");
  newElement2.setAttribute("class", "w3-col s12 m4 l4");
  newElement3.innerHTML = "Select Equipment";
  newElement4.setAttribute("class", "w3-select w3-border w3-margin-top");
  newElement4.setAttribute("id", selectId);

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);
  newElement2.appendChild(newElement4);

  p.appendChild(newElement);

  // Data view
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement4 = document.createElement("p");

  newElement.setAttribute("class", "w3-row-padding");
  newElement2.setAttribute("class", "w3-col s12 m12 l12");
  newElement3.setAttribute("id", displayId);
  newElement3.setAttribute("class", "data-display w3-col s12 m12 l12 w3-margin-top");

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);

  p.appendChild(newElement);
}

// Search the data source and update the options in th dropdown menu
function searchData(searchTerm, dataSource, outputDropdown) {
  document.getElementById(outputDropdown).innerText = null;
  for (i = 0; i < dataSource.data.length; i++) {
    if (dataSource.data[i]["Display Name"].toLowerCase().includes(searchTerm.toLowerCase())) {
      var option = document.createElement("option");
      option.text = dataSource.data[i]["Display Name"];
      option.value = dataSource.data[i]["Id"];
      document.getElementById(outputDropdown).add(option);
    }
  }
}

// Update the data display when a new item is selected
function dropdownSelected(selectInput, displayOutput, dataSource) {
  var input = document.getElementById(selectInput).value;
  document.getElementById(displayOutput).innerHTML = "";
  for (i = 0; i < dataSource.data.length; i++) {
    if (input == dataSource.data[i]["Id"]) {
      for (var label in dataSource.data[i]) {
        if (label != "Id" && label != "Display Name") {
          document.getElementById(displayOutput).innerHTML += label;
          document.getElementById(displayOutput).innerHTML += ": ";
          document.getElementById(displayOutput).innerHTML += dataSource.data[i][label];
          document.getElementById(displayOutput).innerHTML += "<br>";
          document.getElementById(displayOutput).innerHTML += "<br>";
        }
      }
    }
  }
}

// Show selected tab and hide inactive tabs
function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

async function install() {
  if (deferredPrompt) {
    // Hide our user interface that shows our A2HS button
    document.getElementById("installPanel").style.display = "none";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(function (choiceResult) {
      if (choiceResult.outcome === "accepted") {
        console.log("Your PWA has been installed");
      } else {
        console.log("User chose to not install your PWA");
      }

      deferredPrompt = null;
    });
  }
}

// On load function
async function onLoadFunction() {
  document.getElementById("main-content").style.display = "none";

  window.addEventListener("load", function () {
    window.history.pushState(
      {
        noBackExitsApp: true,
      },
      openTab("Home")
    );
  });

  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.noBackExitsApp) {
      window.history.pushState(
        {
          noBackExitsApp: true,
        },
        openTab("Home")
      );
    }
  });

  // Webapp install
  document.getElementById("installPanel").style.display = "none";

  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("[Main] A2HS Triggered");
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    document.getElementById("installPanel").style.display = "block";
  });

  // Execute a function when the user releases a key on the keyboard
  document.getElementById("login-password").addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      login();
    }
  });

  menuBuilder(menuStructure);
}

// Call onload function
window.onload = onLoadFunction();
