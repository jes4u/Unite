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

//Map object
var mymap;
// Array of Options tags for the dropdown/Select tag
var dropDownOptions = [];
// Object variabel containing the data of each marker on the map. Key is the location's GID_2, value is the marker object
var markerObject = {};
// Layer group for markers
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

    // The variables searchboxControl and control determine the options within the filter panel
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

    // Onclick search button
    control._searchfunctionCallBack = function (searchkeywords){
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }

        onClickSearch(searchkeywords)
    }
    mymap.addControl(control);
    markerLayer = L.layerGroup().addTo(mymap);
});

// This method controls the display of the sliders within the filter panel. 
//If the checkbox is checked then the slider appears, if it is not checked, the slider disappears
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

// This method constantly updates the display for current slider value everytime the slider changes value
function updateSliderValue(element, value) {
    values[element] = value
    let valEle= "value" + element;
    document.getElementById(valEle).innerHTML = "Value: " + value;
}

//This method displays all the texts with each marker
function popupContent(feature) {
    var content = document.createElement("div");
    var country = document.createElement("p");
    country.innerHTML = "Country: " + feature.properties.NAME_0;
    var city = document.createElement("p");
    city.innerHTML = "City/Province: " + feature.properties.NAME_1;
    var county = document.createElement("p");
    county.innerHTML = "County: " + feature.properties.NAME_2;
    var population = document.createElement("p");
    population.innerHTML = "Population: " + feature.properties.POPULATION;
    var popDensity = document.createElement("p");
    popDensity.innerHTML = "Population Density: " + feature.properties.POPDENSITY;
    var carbon = document.createElement("p");
    carbon.innerHTML = "Carbon Emission Level: " + feature.properties.CARBON;
    var perCapCarbon = document.createElement("p");
    perCapCarbon.innerHTML = "Carbon Emission per Capita: " + feature.properties.PERCAPCARB;

    var link = document.createElement("a");
    link.href = "http://www.google.com/search?q=" + feature.properties.NAME_0 + "+" + feature.properties.NAME_1 + "+" + feature.properties.NAME_2;
    link.innerHTML = "Search for more information!";
    content.appendChild(country);
    content.appendChild(city);
    content.appendChild(county);
    content.appendChild(population);
    content.appendChild(popDensity);
    content.appendChild(carbon);
    content.appendChild(perCapCarbon);
    content.appendChild(link);

    return content;
  }

// This method is called after the search button is pressed, the method will search through
//  the geoJSON file and create markers for each location that matches the results
// If there are no results, an error will appear saying no location has been found
function onClickSearch(input) {
    $.getJSON('./Data/GeoJSONFiles/countypoint.geojson', function(data){
        var search;
        var foundLocation = false;
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = [];
        search = L.geoJson(data, {filter: function(feature) {
            if (feature.properties.NAME_2 == null) {
                return false;
            }
            if(feature.properties.NAME_2.toString().toLowerCase() == input.toString().toLowerCase()){
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

// This method is called after the submit button is pressed within the filter panel
// When called, the method will use the filtered values and search the geoJSON files for 
//  locations that fits within the filtered range and will throw and error if there are no
//  results found
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
        var selectedProperties = markerObject[dropDownValue]._layers[ markerObject[dropDownValue]._leaflet_id - 1 ].feature.properties
        var selectedPopulation = selectedProperties.POPULATION;
        var selectedCarbon = selectedProperties.CARBON;
        var marker_HASC_2 = markerObject[dropDownValue]._layers[ markerObject[dropDownValue]._leaflet_id - 1 ].feature.properties.HASC_2;
        var foundMatches = false;
        var search;
        
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = [];

        search = L.geoJson(data, {filter: function(feature) {
            
            if (feature.properties.POPULATION > (selectedPopulation * (1.0 - popValPercent)) && 
                feature.properties.POPULATION < (selectedPopulation * (1.0 + popValPercent)) &&
                feature.properties.CARBON > (selectedCarbon * (1.0 - carbonValPercent)) &&
                feature.properties.CARBON < (selectedCarbon * (1.0 + carbonValPercent)) ) 
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

// This method adds each location found into the dropdown option and adds the location marker into the
//  marker group layer.
function addMarkerActions(feature) {
    var content = popupContent(feature);
    var dropDown = document.getElementById("dropDown");
    var option = document.createElement("option");
    option.value = feature.properties.GID_2;
    dropDownOptions.push(feature.properties.GID_2 + "");
    option.innerHTML = feature.properties.NAME_2 + " County " + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
    dropDown.appendChild(option);
    var marker = L.geoJson(feature).bindPopup(content).addTo(markerLayer);
    markerObject[feature.properties.GID_2] = marker
    marker.on("click", function(event) { 
        document.getElementById("dropDown").selectedIndex = dropDownOptions.indexOf(event.layer.feature.properties.GID_2 + "");
    });
}

// This method removes all the options within the dropdown list
function removeLocationOptions() {
    var locationList = document.getElementById("dropDown");
    for ( var i = locationList.options.length -1 ; i >= 0 ; i-- ) {
        locationList.remove(i);
    }
}