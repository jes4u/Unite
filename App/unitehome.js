function openNav() {
  document.getElementById("mySidenav").style.width = "20%";
  document.getElementById("mapcontent").style.marginLeft = "20%";
  document.getElementById("slideMenu").style.display = "none";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mapcontent").style.marginLeft = "0";
  document.getElementById("slideMenu").style.display = "block";
}

function openfilter(name) {
    console.log(name);
  if(document.getElementById(name).style.display === "none"){
    document.getElementById(name).style.display = "inline";
  } else {
    document.getElementById(name).style.display = "none";
  }
}
