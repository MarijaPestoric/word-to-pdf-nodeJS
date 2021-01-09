//document.getElementById("converted").innerHTML = 
/*$.getJSON("notes.json", function(json) {
    document.getElementById("converted").innerHTML = "json"; 
}); */

const conv = document.getElementById("converted");

$.getJSON("notes.json", function(json) {
    conv.textContent = json; 
});

