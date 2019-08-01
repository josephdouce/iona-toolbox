var data  = null;

// on load function
async function onLoadFunction() {

  Papa.parse("./data.csv", {
	  header: true,
	  download:true,
      complete: function(results) {
          console.log("Finished:", results);
		  data = results;
		  for (i = 0; i < data.data.length; i++){
			  var option = document.createElement('option');
			  option.text = option.value = data.data[i]["VALVE"];
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

function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

function valveSelected() {
	var valve = document.getElementById("selectValve").value;
	document.getElementById("displayData").innerHTML = "";
	for (i = 0; i < data.data.length; i++){
		if ( valve == data.data[i]["VALVE"] ){
			console.log(data.data[i]);
			for ( var label in data.data[i] ) {
				console.log(label);
				console.log(data.data[i][label]);
				document.getElementById("displayData").innerHTML += label;
				document.getElementById("displayData").innerHTML += ": ";
				document.getElementById("displayData").innerHTML += data.data[i][label];
				document.getElementById("displayData").innerHTML += "<br>";
			}
		}	
	}
}

function search() {
	var input = document.getElementById("searchField").value;
	document.getElementById("selectValve").innerText = null;
	for (i = 0; i < data.data.length; i++){
		if ( data.data[i]["VALVE"].includes(input) ){
			var option = document.createElement('option');
			option.text = option.value = data.data[i]["VALVE"];
			document.getElementById("selectValve").add(option);
		}
	}
	valveSelected()
}

// call onload function
window.onload = onLoadFunction();

// webapp install
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
const addPanel = document.querySelector('.add-panel');
addPanel.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("[Main] A2HS Triggered")
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addPanel.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addPanel.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});
