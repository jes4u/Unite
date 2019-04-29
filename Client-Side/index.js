'use strict';


$(document).ready(function() {


    $("#mapid").height($(window).height()).width($(window).width());


    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        zoomControl: true,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiamVzNHUiLCJhIjoiY2p1dDRnaGwwMDQ3bzQ0cWh4bmpkYW41dSJ9.tHX3oSxnnDMgpo6YM1X4bg'
    }).addTo(mymap);

    mymap.zoomControl.setPosition('bottomright');


    var searchboxControl=createSearchboxControl();
    var control = new searchboxControl({
        sidebarTitleText: 'Header',
        sidebarMenuItems: {
            Items: [
                { 
                    type: "checkbox",
                    name: "GDP", 
                    onclick: "createGDP();" 
                }
                ,{ type: "link", name: "Link 1 (github.com)", href: "http://github.com", icon: "icon-local-carwash" }
                // { type: "link", name: "Link 2 (google.com)", href: "http://google.com", icon: "icon-cloudy" },
                // { type: "button", name: "Button 1", onclick: "alert('button 1 clicked !')", icon: "icon-potrait" },
                // { type: "button", name: "Button 2", onclick: "button2_click();", icon: "icon-local-dining" },
                // { type: "link", name: "Link 3 (stackoverflow.com)", href: 'http://stackoverflow.com', icon: "icon-bike" },
            ]
        }
    });
    control._searchfunctionCallBack = function (searchkeywords)
    {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }
        alert(searchkeywords);
    }
    mymap.addControl(control);

    
});

function button2_click(){
    alert('button 2 clicked !!!');
}
function createGDP() {
    alert('hi');
    let gdpDiv = document.createElement("div");
    let gdpSlider = document.createElement("input");
    gdpSlider.setAttribute("type", "range");
    gdpSlider.setAttribute("max", "5");
    gdpSlider.setAttribute("min", "0");
    gdpDiv.appendChild(gdpSlider);

}

