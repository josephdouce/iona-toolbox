var valves  = null;

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
  
}

// Get the input field
var input = document.getElementById("searchField");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    search()
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