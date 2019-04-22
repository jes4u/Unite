function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("mapcontent").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mapcontent").style.marginLeft = "0";
}

function openfilter() {
  if(document.getElementById("population").checked = true){
    document.getElementById("populationFilter").style.display = "block";
  }
  if(document.getElementById("gdp").checked == true){
    document.getElementById("gdpFilter").style.visibility = visible;
  }
  if(document.getElementById("carbon").checked == true){
    document.getElementById("carbonFilter").style.visibility = visible;
  }
}
