var elec_isolations = null;
var passphrase = null;
var passphraseEncrypt = null;
let deferredPrompt = null;

var menuStructure = {
  label: "Home",
  sub: [{
      label: "Mechanical",
      icon: "mdi-wrench",
      sub: [{
          label: "Valves",
          icon: "mdi-reflect-vertical mdi-rotate-90",
          sub: null
        },
        {
          label: "Engine",
          icon: "mdi-engine",
          sub: [{
            label: "Sensors",
            icon: "mdi-thermometer",
            sub: null
          }]
        }
      ]
    },
    {
      label: "Electrical",
      icon: "mdi-flash",
      sub: [{
        label: "Isolations",
        icon: "mdi-flash",
        sub: null
      }]
    }]
}

function menuBuilder(parent) {
  for (var y in parent.sub) {
    var p, newElement, newElement3, newElement3, newElement4;
    var sub = parent.sub[y];

    p = document.getElementById(parent["label"]);
    newElement = document.createElement("div");
    newElement2 = document.createElement("div");
    newElement3 = document.createElement("i");
    newElement4 = document.createElement("p");

    newElement.setAttribute('class', "w3-col l3 m4 s6 w3-margin-bottom");

    newElement2.setAttribute('class', "w3-card w3-container w3-display-container w3-theme-l5");
    newElement2.setAttribute('style', "padding-top: 100%");
    newElement2.setAttribute('onclick', "openTab('" + sub["label"] + "')");

    newElement3.setAttribute('class', "mdi " + sub["icon"] + " w3-margin-bottom w3-text-theme w3-hover-opacity w3-display-middle w3-jumbo");

    newElement4.setAttribute('class', "w3-text-theme w3-display-topmiddle");
    newElement4.innerHTML = sub["label"];

    newElement2.appendChild(newElement3);
    newElement2.appendChild(newElement4);
    newElement.appendChild(newElement2);
    p.appendChild(newElement);

    p = document.getElementById("main-content");
    newElement = document.createElement("div");

    newElement.setAttribute('class', "w3-row-padding w3-center w3-margin-top tabPage");
    newElement.setAttribute('style', "display:none");
    newElement.setAttribute('id', sub["label"]);
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
  document.location.href = "mailto:" + recipient + at + host + "?subject=" +
    encodeURIComponent("Iona Toolbox Support: " + document.getElementById('senderName').value) +
    "&body=" + encodeURIComponent(document.getElementById('mailBody').value);
}


//Encrypt the selected file and display the data
function encryptFile() {
  var preview = document.getElementById('encrypt-display');
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader()

  reader.onload = function (event) {
    passphraseEncrypt = document.getElementById('encrypt-password').value;
    var ciphertext = CryptoJS.AES.encrypt(event.target.result, passphraseEncrypt).toString();
    document.getElementById("encrypt-display").innerHTML = ciphertext;
  }

  if (file) {
    reader.readAsText(file);
  } else {
    document.getElementById("encrypt-display").innerHTML = "No file selected";
  }
}

//Encrypt the selected file and display the data
function decryptFile() {
  var preview = document.getElementById('encrypt-display');
  var file = document.querySelector('input[type=file]').files[0];
  var reader = new FileReader()

  reader.onload = function (event) {
    passphraseEncrypt = document.getElementById('encrypt-password').value;
    var bytes = CryptoJS.AES.decrypt(event.target.result, passphraseEncrypt);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    document.getElementById("encrypt-display").innerHTML = originalText;
  }

  if (file) {
    reader.readAsText(file);
  } else {
    document.getElementById("encrypt-display").innerHTML = "No file selected";
  }
}

// Log in button action
function login() {

  passphrase = document.getElementById('login-password').value;

  // Electrical Isolations

  // Fetch encrypted .csv file and process is with papa
  fetch('encrypted_csv_files/electrical_isolation_list_encrypted.csv')
      .then(response => response.text())
      .then((data) => {
          // Decrypt
          var bytes = CryptoJS.AES.decrypt(data, passphrase);
          try {
              var originalText = bytes.toString(CryptoJS.enc.Utf8);
          } catch (err) {
              document.getElementById('passwordPanel').style.display = "block";
              return;
          }

          // Parse decrypted data and phones valves variable 
          Papa.parse(originalText, {
              header: true,
              complete: function(results) {
                  pageBuilder ("Isolations", "selectIsolation", "isolationSelected()", "displayDataElecIsolations", "isolationsSearchInput");
                  elec_isolations = results;
                  for (i = 0; i < elec_isolations.data.length; i++) {
                      var option = document.createElement('option');
                      option.text = elec_isolations.data[i]["Name"] + " D" + elec_isolations.data[i]["Deck"] + "Z" + elec_isolations.data[i]["Zone"]
                      option.value = elec_isolations.data[i]["Id"];
                      document.getElementById("selectIsolation").add(option);
                  }
                  $("#isolationsSearchInput").keypress(function(event) { 
                    if (event.keyCode === 13) { 
                      isolationsSearch();
                    } 
                  }); 
                  isolationSelected()
                  document.getElementById("login-page").style.display = "none";
                  document.getElementById('passwordPanel').style.display = "none";
                  document.getElementById("main-content").style.display = "block";
              }
          });
      });

}

// build UI for each page

function pageBuilder (tab, selectId, selectFunction, displayId, searchInputId){

  // search box
  p = document.getElementById(tab);
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement3 = document.createElement("input");

  newElement.setAttribute('class', "w3-row-padding");
  newElement2.setAttribute('class', "w3-col s12 m4 l4");
  newElement3.setAttribute('class', "w3-input w3-border");
  newElement3.setAttribute('placeholder', "Search");
  newElement3.setAttribute('type', "text");
  newElement3.setAttribute('id', searchInputId);

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);
  
  p.appendChild(newElement);

  // select box
  p = document.getElementById(tab);
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement3 = document.createElement("label");
  newElement4 = document.createElement("select");

  newElement.setAttribute('class', "w3-row-padding");
  newElement2.setAttribute('class', "w3-col s12 m4 l4");
  newElement3.innerHTML = "Select Equipment";
  newElement4.setAttribute('class', "w3-select w3-border");
  newElement4.setAttribute('id', selectId);
  newElement4.setAttribute('onchange', selectFunction);

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);
  newElement2.appendChild(newElement4);

  p.appendChild(newElement);

  // data view
  newElement = document.createElement("div");
  newElement2 = document.createElement("div");
  newElement4 = document.createElement("p");
  
  newElement.setAttribute('class', "w3-row-padding");
  newElement2.setAttribute('class', "w3-col s12 m12 l12");
  newElement3.setAttribute('id', displayId);
  newElement3.setAttribute('class', "data-display w3-col s12 m12 l12");

  newElement.appendChild(newElement2);
  newElement2.appendChild(newElement3);

  p.appendChild(newElement);
}

function isolationsSearch() {
  var input = document.getElementById("isolationsSearchInput").value;
  document.getElementById("selectIsolation").innerText = null;
  for (i = 0; i < elec_isolations.data.length; i++) {
      var search_term = input;
      var search_in = elec_isolations.data[i]["Name"] + " D" + elec_isolations.data[i]["Deck"] + "Z" + elec_isolations.data[i]["Zone"];
      if (search_in.toLowerCase().includes(search_term.toLowerCase())) {
          var option = document.createElement('option');
          option.text = elec_isolations.data[i]["Name"] + "  D" + elec_isolations.data[i]["Deck"] + "Z" + elec_isolations.data[i]["Zone"];
          option.value = elec_isolations.data[i]["Id"];
          document.getElementById("selectIsolation").add(option);
      }
  }
  isolationSelected()
}

// Get valve data for selected valve and display it
function isolationSelected() {
  var input = document.getElementById("selectIsolation").value;
  document.getElementById("displayDataElecIsolations").innerHTML = "";
  for (i = 0; i < elec_isolations.data.length; i++) {
      if (input == elec_isolations.data[i]["Id"]) {
          for (var label in elec_isolations.data[i]) {
              if(label != "Id"){
                  document.getElementById("displayDataElecIsolations").innerHTML += label;
                  document.getElementById("displayDataElecIsolations").innerHTML += ": ";
                  document.getElementById("displayDataElecIsolations").innerHTML += elec_isolations.data[i][label];
                  document.getElementById("displayDataElecIsolations").innerHTML += "<br>";
                  document.getElementById("displayDataElecIsolations").innerHTML += "<br>";
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
    document.getElementById('installPanel').style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(function (choiceResult) {

      if (choiceResult.outcome === 'accepted') {
        console.log('Your PWA has been installed');
      } else {
        console.log('User chose to not install your PWA');
      }

      deferredPrompt = null;

    });
  }
}

// On load function
async function onLoadFunction() {

  document.getElementById("main-content").style.display = "none";

  window.addEventListener('load', function () {
    window.history.pushState({
      noBackExitsApp: true
    }, openTab('Home'))
  })

  window.addEventListener('popstate', function (event) {
    if (event.state && event.state.noBackExitsApp) {
      window.history.pushState({
        noBackExitsApp: true
      }, openTab('Home'))
    }
  })

  // Webapp install
  document.getElementById('installPanel').style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log("[Main] A2HS Triggered")
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    document.getElementById('installPanel').style.display = 'block';
  });

  // Execute a function when the user releases a key on the keyboard
  document.getElementById("login-password").addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      login()
    }
  });

  menuBuilder(menuStructure);

}

// Call onload function
window.onload = onLoadFunction();
