var valves = null;
var phones = null;
var esd = null;
var ups = null;
var breakers = null;
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
      sub: null
    },
    {
      label: "Hotel",
      icon: "mdi-toilet",
      sub: [{
        label: "Phone",
        icon: "mdi-phone mdi-rotate-90",
        sub: null
      }]
    },
  ]

}

function menuBuilder(parent) {
  for (var y in parent.sub) {
    console.log(parent.sub[y]);
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
  console.log("open");
}

function w3_close() {
  document.getElementById("sideBar").style.display = "none";
}

function sendMail() {
  var recipient = "josephdouce";
  var at = String.fromCharCode(64);
  var host = "gmail.com";
  document.location.href = "mailto:" + recipient + at + host + "?subject=" +
    encodeURIComponent("QM2 Tools Support: " + document.getElementById('senderName').value) +
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
  username = document.getElementById('login-username').value;

  document.getElementById("login-page").style.display = "none";
  document.getElementById('passwordPanel').style.display = "none";
  document.getElementById("main-content").style.display = "block";

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
