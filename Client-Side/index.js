//Editors: Jesse Tran, Stone Kaech, Jeewon Ha

'use strict';

var values = {
    population: 0,
    gdp: 0,
    carbon: 0
};

var sliderValues = {
    population : {
        min: 0,
        max: 20
    },
    gdp : {
        min: 0,
        max: 20
    },
    carbon : {
        min: 0,
        max: 20
    }
}

var mymap;
var dropDownOptions = [];
var markerObject = {};
var markerLayer;

$(document).ready(function() {


    $("#mapid").height($(window).height()).width($(window).width());


    mymap = L.map('mapid').setView([51.505, -0.09], 2);

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
        sidebarTitleText: "",
        sidebarMenuItems: {
            Items: [
                {
                    type: "checkbox",
                    name: "GDP",
                    value: "gdp",
                    onclick: "activateSlider('gdp');",
                    min: sliderValues.gdp.min,
                    max: sliderValues.gdp.max
                },
                {
                    type: "checkbox",
                    name: "Population",
                    value: "population",
                    onclick: "activateSlider('population');",
                    min: sliderValues.population.min,
                    max: sliderValues.population.max
                },
                {
                    type: "checkbox",
                    name: "Carbon Emissions",
                    value: "carbon",
                    onclick: "activateSlider('carbon');" ,
                    min: sliderValues.carbon.min,
                    max: sliderValues.carbon.max
                }
            ]
        }
    });
    control._searchfunctionCallBack = function (searchkeywords)
    {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }

        onClickSearch(searchkeywords)
    }
    mymap.addControl(control);
    markerLayer = L.layerGroup().addTo(mymap);
});

function addPopup(feature, layer){
  layer.bindPopup(feature.properties.NAME_0);
}

function activateSlider(element) {
    let checkboxEle = document.getElementById(element + "ID");
    let sliderEle = document.getElementById(element + "SliderID");
    let searchbox = document.getElementById("controlbox");
    let panelHeaderTitle = document.getElementById("panel-header-title");
    if( checkboxEle.checked == true ) {
        sliderEle.parentElement.parentElement.parentElement.style.display = "block";
    } else {
        sliderEle.parentElement.parentElement.parentElement.style.display = "none";
    }

}

function updateSliderValue(element, value) {
    values[element] = value;
    console.log(element + ":  " + value);
    let valEle= "value" + element;
    document.getElementById(valEle).innerHTML = "Value: " + value;
}

function popupContent(feature, title) {

    var content = document.createElement("div");
    var head = document.createElement("p");
    head.innerHTML = title;
    var population = document.createElement("p");
    population.innerHTML = "Population: " + feature.properties.POPULATION;
    var popDensity = document.createElement("p");
    popDensity.innerHTML = "Population Density: " + feature.properties.POPDENSITY;
    var carbon = document.createElement("p");
    carbon.innerHTML = "Carbon Emission Level: " + feature.properties.CARBON;
    var perCapCarbon = document.createElement("p");
    perCapCarbon.innerHTML = "Carbon Emission per Capita: " + feature.properties.PERCAPCARB;

    var link = document.createElement("a");
    link.href = "http://www.google.com/search?q=" + title.split(": ")[1];
    link.target = "_blank";
    link.innerHTML = "Search for more information!";
    content.appendChild(head);
    content.appendChild(population);
    content.appendChild(popDensity);
    content.appendChild(carbon);
    content.appendChild(perCapCarbon);
    content.appendChild(link);

    return content;
  }

function onClickSearch(input) {
    $.getJSON('./Data/GeoJSONFiles/allpoint.geojson', function(data){
        var search;
        var foundLocation = false;
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = []
        search = L.geoJson(data, {filter: function(feature) {
            if (feature.properties.UNINAME.split(" ").length == 1) {
                return false;
            }
            if (feature.properties.UNINAME.toString().toLowerCase().includes(input.toString().toLowerCase())){
                addMarkerActions(feature);
                foundLocation = true;
                return true;
            }
            return false;
        }}) 
        if(foundLocation) {
            mymap.fitBounds(search.getBounds())
        } else {
            alert("Location not found... replace with modal popup");
        }
        
    });
}

function searchPopulationPercent() {
    $.getJSON('./Data/GeoJSONFiles/countypoint.geojson', function(data){
        var dropDownValue = document.getElementById("dropDown").value;
        if(dropDownValue === "") {
            alert("Location not selected in the dropdown. Canceling search");
            return;
        }
        var popValPercent = values.population / 100;
        var carbonValPercent = values.carbon / 100;
        var gdpValPercent = values.gdp / 100;
        var selctedPopulation = markerObject[dropDownValue]._layers[ markerObject[dropDownValue]._leaflet_id - 1 ].feature.properties.POPULATION;
        var marker_ORIG_FID = markerObject[dropDownValue]._layers[ markerObject[dropDownValue]._leaflet_id - 1 ].feature.properties.ORIG_FID;
        var foundMatches = false;
        var search;
        
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = []
        search = L.geoJson(data, {filter: function(feature) {
            
            if (((feature.properties.POPULATION > (selctedPopulation * (1.0 - popValPercent)) && 
                feature.properties.POPULATION < (selctedPopulation * (1.0 + popValPercent)))) || 
                feature.properties.ORIG_FID == marker_ORIG_FID) 
            {
                foundMatches = true;
                addMarkerActions(feature);
                return true;

            } else {
                return false;
            }
        }})
        if (foundMatches) {
            mymap.fitBounds(search.getBounds());
        } else {
            alert("No matches found.... replace with modal popup");
        }
        
    });
}

function addMarkerActions(feature) {
    var title;
    switch(feature.properties.UNITTYPE) {
        case "STATE":
            title = "State:  " + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
            break;
        case "COUNTY":
            title = "County:  " + feature.properties.NAME_2 + ", " 
                    + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
            break;
        case "NATION":
            title = "Nation:  " + feature.properties.NAME;
            break;
        case "URBANEXTENT":
            title = "Urban Extent:  " + feature.properties.NAME + ", " + feature.properties.ISO3;
            break;
        default:
            title = feature.properties.UNITTYPE;
            break;
    }
    var content = popupContent(feature, title);
    var dropDown = document.getElementById("dropDown");
    var option = document.createElement("option");
    option.value = feature.properties.ORIG_FID;
    dropDownOptions.push(feature.properties.ORIG_FID + "");
    option.innerHTML = title;
    dropDown.appendChild(option);
    var marker = L.geoJson(feature).bindPopup(content).addTo(markerLayer);
    markerObject[feature.properties.ORIG_FID] = marker
    marker.on("click", function(event) { 
        document.getElementById("dropDown").selectedIndex = dropDownOptions.indexOf(event.layer.feature.properties.ORIG_FID + "");
    });
}

function removeLocationOptions() {
    var locationList = document.getElementById("dropDown");
    for ( var i = locationList.options.length -1 ; i >= 0 ; i-- ) {
        locationList.remove(i);
    }
}