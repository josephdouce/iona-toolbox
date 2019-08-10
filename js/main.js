var valves = null;
var phones = null;
var breakers = null;
var passphrase = null;
var passphraseEncrypt = null;

function sendMail() {
	var recipient="josephdouce";
	var at = String.fromCharCode(64);
	var dotcom="gmail.com";
    document.location.href = "mailto:" + recipient + at + dotcom + "?subject="
        + encodeURIComponent("QM2 Tools")
        + "&body=" + encodeURIComponent("Sent from QM2 Tools");
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
	 }
	 else {
		document.getElementById("encrypt-display").innerHTML = "No file selected"; 
	 }
}

// Log in button action
function login() {
	
	passphrase = document.getElementById('login-password').value;
	
	// Valves 
	
	// Fetch encrypted .csv file and process is with papa
	fetch('valves_encrypted.csv')
	.then(response => response.text())
	.then((data) => {
		// Decrypt
		var bytes  = CryptoJS.AES.decrypt(data, passphrase);
		try{
			var originalText = bytes.toString(CryptoJS.enc.Utf8);
		}
		catch(err){
			document.getElementById('passwordPanel').style.display = "block";
			return;
		}

		// Parse decrypted data and phones valves variable 
		Papa.parse(originalText, {
			header: true,
			complete: function(results) {
			valves = results;
			console.log(valves);
				for (i = 0; i < valves.data.length; i++){
				  var option = document.createElement('option');
				  option.text = option.value = valves.data[i]["VALVE"];
				  document.getElementById("selectValve").add(option);
				}
			valveSelected()
			document.getElementById("login-page").style.display = "none";
			document.getElementById('passwordPanel').style.display = "none";
			document.getElementById("main-content").style.display = "block";
			}
		});
	});
	
	// Phones 
  
	// Fetch encrypted .csv file and process is with papa
	fetch('phones_encrypted.csv')
	.then(response => response.text())
	.then((data) => {
		// Decrypt
		var bytes  = CryptoJS.AES.decrypt(data, passphrase);
		try{
			var originalText = bytes.toString(CryptoJS.enc.Utf8);
		}
		catch(err){
			return;
		}

		// Parse decrypted data and populate valves variable 
		Papa.parse(originalText, {
			header: true,
			complete: function(results) {
			phones = results;
			for (i = 0; i < phones.data.length; i++){
				var option = document.createElement('option');
				option.text = option.value = phones.data[i]["NAME"];
				document.getElementById("selectPhone").add(option);
			}
			phoneSelected()
			}
		});
	});  
	
	// Breakers
	
	// Fetch encrypted .csv file and process is with papa
	fetch('breaker_encrypted.csv')
	.then(response => response.text())
	.then((data) => {
		// Decrypt
		var bytes  = CryptoJS.AES.decrypt(data, passphrase);
		try{
			var originalText = bytes.toString(CryptoJS.enc.Utf8);
		}
		catch(err){
			return;
		}

		// Parse decrypted data and populate valves variable 
		Papa.parse(originalText, {
			header: true,
			complete: function(results) {
			breakers = results;
			for (i = 0; i < breakers.data.length; i++){
				var option = document.createElement('option');
				option.text = option.value = breakers.data[i]["DESCRIPTION"];
				document.getElementById("selectBreaker").add(option);
			}
			breakerSelected()
			}
		});
	});  
}

// on load function
async function onLoadFunction() {
	document.getElementById("main-content").style.display = "none";
}

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchFieldValves").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    searchValves()
  }
});

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchFieldPhones").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    searchPhones()
  }
});

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchFieldBreakers").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    searchBreakers()
  }
});

// Execute a function when the user releases a key on the keyboard
document.getElementById("login-password").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    login()
  }
});

// Show selected tab and hide inactive tabs
function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

// Get valve data for selected valve and display it
function valveSelected() {
	var valve = document.getElementById("selectValve").value;
	document.getElementById("displayDataValves").innerHTML = "";
	for (i = 0; i < valves.data.length; i++){
		if ( valve == valves.data[i]["VALVE"] ){
			for ( var label in valves.data[i] ) {
				document.getElementById("displayDataValves").innerHTML += label;
				document.getElementById("displayDataValves").innerHTML += ": ";
				document.getElementById("displayDataValves").innerHTML += valves.data[i][label];
				document.getElementById("displayDataValves").innerHTML += "<br>";
				document.getElementById("displayDataValves").innerHTML += "<br>";
			}
		}	
	}
}

// Get valve data for selected phone and display it
function phoneSelected() {
	var phone = document.getElementById("selectPhone").value;
	document.getElementById("displayDataPhones").innerHTML = "";
	for (i = 0; i < phones.data.length; i++){
		if ( phone == phones.data[i]["NAME"] ){
			for ( var label in phones.data[i] ) {
				document.getElementById("displayDataPhones").innerHTML += label;
				document.getElementById("displayDataPhones").innerHTML += ": ";
				document.getElementById("displayDataPhones").innerHTML += phones.data[i][label];
				document.getElementById("displayDataPhones").innerHTML += "<br>";
				document.getElementById("displayDataPhones").innerHTML += "<br>";
			}
		}	
	}
}

// Get valve data for selected phone and display it
function breakerSelected() {
	var breaker = document.getElementById("selectBreaker").value;
	document.getElementById("displayDataBreakers").innerHTML = "";
	for (i = 0; i < breakers.data.length; i++){
		if ( breaker == breakers.data[i]["DESCRIPTION"] ){
			for ( var label in breakers.data[i] ) {
				document.getElementById("displayDataBreakers").innerHTML += label;
				document.getElementById("displayDataBreakers").innerHTML += ": ";
				document.getElementById("displayDataBreakers").innerHTML += breakers.data[i][label];
				document.getElementById("displayDataBreakers").innerHTML += "<br>";
				document.getElementById("displayDataBreakers").innerHTML += "<br>";
			}
		}	
	}
}

// Search through valves and populate drop down menu with matches
function searchValves() {
	var input = document.getElementById("searchFieldValves").value;
	document.getElementById("selectValve").innerText = null;
	for (i = 0; i < valves.data.length; i++){
		if ( valves.data[i]["VALVE"].toLowerCase().includes(input.toLowerCase()) ){
			var option = document.createElement('option');
			option.text = option.value = valves.data[i]["VALVE"];
			document.getElementById("selectValve").add(option);
		}
	}
	valveSelected()
}

// Search through phones and populate drop down menu with matches
function searchPhones() {
	var input = document.getElementById("searchFieldPhones").value;
	document.getElementById("selectPhone").innerText = null;
	for (i = 0; i < phones.data.length; i++){
		if ( phones.data[i]["NAME"].toLowerCase().includes(input.toLowerCase()) || 
			phones.data[i]["CABIN"] == input || 
			phones.data[i]["PAGER"] == input || 
			phones.data[i]["PHONE"] == input ){
			var option = document.createElement('option');
			option.text = option.value = phones.data[i]["NAME"];
			document.getElementById("selectPhone").add(option);
		}
	}
	phoneSelected()
}

// Search through phones and populate drop down menu with matches
function searchBreakers() {
	var input = document.getElementById("searchFieldBreakers").value;
	document.getElementById("selectBreaker").innerText = null;
	for (i = 0; i < breakers.data.length; i++){
	if ( breakers.data[i]["TAG"].toLowerCase().includes(input.toLowerCase()) || 
			breakers.data[i]["DESCRIPTION"].toLowerCase().includes(input.toLowerCase()) ){
			var option = document.createElement('option');
			option.text = option.value = breakers.data[i]["DESCRIPTION"];
			document.getElementById("selectBreaker").add(option);
		}
	}
	breakerSelected()
}

// Call onload function
window.onload = onLoadFunction();

// Webapp install
let deferredPrompt = null;
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

async function install() {
  if (deferredPrompt) {
	// Hide our user interface that shows our A2HS button
    document.getElementById('installPanel').style.display = 'none';
	// Show the prompt
    deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(function(choiceResult){

      if (choiceResult.outcome === 'accepted') {
      console.log('Your PWA has been installed');
    } else {
      console.log('User chose to not install your PWA');
    }

    deferredPrompt = null;

    });
  }
}