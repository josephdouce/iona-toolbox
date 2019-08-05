var valves = null;
var phones = null;

// on load function
async function onLoadFunction() {

  Papa.parse("./valves.csv", {
	  header: true,
	  download:true,
      complete: function(results) {
          console.log("Finished:", results);
		  valves = results;
		  for (i = 0; i < valves.data.length; i++){
			  var option = document.createElement('option');
			  option.text = option.value = valves.data[i]["VALVE"];
			  document.getElementById("selectValve").add(option);
		   }
		   valveSelected()
      }
  });
  
  Papa.parse("./phones.csv", {
	  header: true,
	  download:true,
      complete: function(results) {
          console.log("Finished:", results);
		  phones = results;
		  for (i = 0; i < phones.data.length; i++){
			  var option = document.createElement('option');
			  option.text = option.value = phones.data[i]["NAME"];
			  document.getElementById("selectPhone").add(option);
		   }
		   phoneSelected()
      }
  });
  
}

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchField").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    search()
  }
});

// Execute a function when the user releases a key on the keyboard
document.getElementById("searchFieldPhones").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    searchPhones()
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

// Get valve data for delected valve and display it
function valveSelected() {
	var valve = document.getElementById("selectValve").value;
	document.getElementById("displayData").innerHTML = "";
	for (i = 0; i < valves.data.length; i++){
		if ( valve == valves.data[i]["VALVE"] ){
			console.log(valves.data[i]);
			for ( var label in valves.data[i] ) {
				console.log(label);
				console.log(valves.data[i][label]);
				document.getElementById("displayData").innerHTML += label;
				document.getElementById("displayData").innerHTML += ": ";
				document.getElementById("displayData").innerHTML += valves.data[i][label];
				document.getElementById("displayData").innerHTML += "<br>";
				document.getElementById("displayData").innerHTML += "<br>";
			}
		}	
	}
}

function phoneSelected() {
	var phone = document.getElementById("selectPhone").value;
	document.getElementById("displayDataPhones").innerHTML = "";
	for (i = 0; i < phones.data.length; i++){
		if ( phone == phones.data[i]["NAME"] ){
			console.log(phones.data[i]);
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

// Check if serch term is in valve name and if so add it to drop down menu
function search() {
	var input = document.getElementById("searchField").value;
	document.getElementById("selectValve").innerText = null;
	for (i = 0; i < valves.data.length; i++){
		if ( valves.data[i]["VALVE"].includes(input) ){
			var option = document.createElement('option');
			option.text = option.value = valves.data[i]["VALVE"];
			document.getElementById("selectValve").add(option);
		}
	}
	valveSelected()
}

function searchPhones() {
	var input = document.getElementById("searchFieldPhones").value;
	document.getElementById("selectPhone").innerText = null;
	for (i = 0; i < phones.data.length; i++){
	if ( phones.data[i]["NAME"].includes(input) || 
		phones.data[i]["CABIN"].includes(input) || 
		phones.data[i]["PAGER"].includes(input) || 
		phones.data[i]["PHONE"].includes(input) ){
			var option = document.createElement('option');
			option.text = option.value = phones.data[i]["NAME"];
			document.getElementById("selectPhone").add(option);
		}
	}
	phoneSelected()
}

// call onload function
window.onload = onLoadFunction();

// webapp install
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
	// hide our user interface that shows our A2HS button
    document.getElementById('installPanel').style.display = 'none';
	// Show the prompt
    deferredPrompt.prompt();
    console.log(deferredPrompt)
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