//The dropdown menu should already work on hover, but this also allows it to work
//on click. The goal is to show the menu if it is clicked, and to close it if click again
//or close it if other parts of the content are clicked.
var menuShow = true;
document.getElementById('dropdown').addEventListener("click", function() {
  if (menuShow) {
    document.getElementById('features-menu').style.display = 'flex';
  }
  else {
    document.getElementById('features-menu').style.display = 'none';
  }
  menuShow = !menuShow;
});
document.getElementById('content').addEventListener("click", function() {
  document.getElementById('features-menu').style.display = 'none';
  menuShow = true;
});
