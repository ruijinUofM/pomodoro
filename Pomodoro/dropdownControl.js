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
