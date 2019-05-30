//Editors: Jesse Tran, Stone Kaech, Jeewon Ha, Seohyung Lee

'use strict';

var values = {
    population: 0,
    gdp: 0,
    carbon: 0
};

var sliderCheck = {
    population: false,
    gdp: false,
    carbon: false
}

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
var currentSelcted;
var control;

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
    control = new searchboxControl({
        sidebarTitleText: "",
        sidebarMenuItems: {
            Items: [
                {
                    type: "checkbox",
                    name: "&ensp; GDP",
                    value: "gdp",
                    onclick: "activateSlider('gdp');",
                    min: sliderValues.gdp.min,
                    max: sliderValues.gdp.max
                },
                {
                    type: "checkbox",
                    name: "&ensp;  Population",
                    value: "population",
                    onclick: "activateSlider('population');",
                    min: sliderValues.population.min,
                    max: sliderValues.population.max
                },
                {
                    type: "checkbox",
                    name: "&ensp;  Carbon Emissions",
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

function checkScale() {
  var scale = document.getElementById("scale");
  var value = scale.options[scale.selectedIndex].value;
  if (value == "nation") {
    return "nationpoint.geojson";
  } else if (value == "state") {
    return "statepoint.geojson";
  } else if (value == "county") {
    return "countypoint.geojson";
  } else {
    return "citypoint.geojson";
  }
}

// This method controls the display of the sliders within the filter panel. 
//If the checkbox is checked then the slider appears, if it is not checked, the slider disappears
function activateSlider(element) {
    let checkboxEle = document.getElementById(element + "ID");
    let sliderEle = document.getElementById(element + "SliderID");
    let searchbox = document.getElementById("controlbox");
    let panelHeaderTitle = document.getElementById("panel-header-title");
    if( checkboxEle.checked == true ) {
        sliderEle.parentElement.parentElement.parentElement.style.display = "block";
        sliderCheck[element] = true;
    } else {
        sliderEle.parentElement.parentElement.parentElement.style.display = "none";
        sliderCheck[element] = false;
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
    country.value = feature.properties.NAME_0;
    country.style.display = "none";
    var state = document.createElement("p");
    state.innerHTML = "State: " + feature.properties.NAME_1;
    state.value = feature.properties.NAME_1;
    state.style.display = "none";
    var county = document.createElement("p");
    county.innerHTML = "County: " + feature.properties.NAME_2;
    county.value = feature.properties.NAME_2 + " County";
    county.style.display = "none";
    var city = document.createElement("p");
    city.innerHTML = "City: " + feature.properties.NAME_3;
    city.value = feature.properties.NAME_3;
    city.style.display = "none";
    var link = document.createElement("a");
    content.appendChild(country);
    content.appendChild(state);
    content.appendChild(county);
    content.appendChild(city);
    content = themeInfo(feature, content);
    var keyword = "";
    keyword += scaleInfo(content, keyword);
    keyword += themeKeyword();
    link.href = "http://www.google.com/search?q=" + keyword;
    link.innerHTML = "Search for more information!";
    link.target ="_blank";
    content.appendChild(link);
    currentSelcted = feature;
    return content;
}

function scaleInfo(content, keyword){
  var scale = document.getElementById("scale");
  var selected = scale.options[scale.selectedIndex].id;
  for(var i = 0; i < parseInt(selected); i++){
    content.childNodes[i].style.display = "block";
    keyword += content.childNodes[i].value + " ";
  }
  return keyword;
}

function themeKeyword(){
  if(document.getElementById("gdpID").checked) {
    return "GDP";
  } else if (document.getElementById("populationID").checked) {
    return "Population";
  } else if (document.getElementById("carbonID").checked) {
    return "Carbon Emission";
  } else {
    return "";
  }
}

function themeInfo(feature, content){
  if(document.getElementById("gdpID").checked) {
    // gdp to be added
  }
  if(document.getElementById("populationID").checked) {
    var population = document.createElement("p");
    population.innerHTML = "Population: " + feature.properties.POPULATION;
    var popDensity = document.createElement("p");
    popDensity.innerHTML = "Population Density: " + feature.properties.POPDENSITY;
    content.appendChild(population);
    content.appendChild(popDensity);
  }
  if (document.getElementById("carbonID").checked) {
    var carbon = document.createElement("p");
    carbon.innerHTML = "Carbon Emission Level: " + feature.properties.CARBON;
    var perCapCarbon = document.createElement("p");
    perCapCarbon.innerHTML = "Carbon Emission per Capita: " + feature.properties.PERCAPCARB;
    content.appendChild(carbon);
    content.appendChild(perCapCarbon);

  }
  return content;
}

// This method is called after the search button is pressed, the method will search through
//  the geoJSON file and create markers for each location that matches the results
// If there are no results, an error will appear saying no location has been found
function onClickSearch(input) {
    $.getJSON("/Data/GeoJSONFiles/" + checkScale(), function(data){
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
    $.getJSON("/Data/GeoJSONFiles/" + checkScale(), function(data){
    //$.getJSON('./Data/GeoJSONFiles/countypoint.geojson', function(data){
        var dropDownValue = document.getElementById("dropDown").value;
        if (dropDownValue === "") {
            alert("Location not selected in the dropdown. Canceling search");
            return;
        }
        
        if (!sliderCheck.carbon && !sliderCheck.gdp && !sliderCheck.population) {
            alert("No filters selected. Canceling search");
            return;
        }

        var selectedProperties = markerObject[dropDownValue]._layers[ markerObject[dropDownValue]._leaflet_id - 1 ].feature.properties;
        
        var selectedLocation = {
            population : {
                name: "population",
                valPercent: values.population / 100,
                value: selectedProperties.POPULATION,
                slider: sliderCheck.population
            },
            carbon : {
                name: "carbon",
                valPercent: values.carbon / 100,
                value: selectedProperties.CARBON,
                slider: sliderCheck.carbon
            },
            gdp : {
                name: "gdp",
                valPercent: values.gdp / 100,
                value: 0, //insert value amount
                slider: false // change to sliderCheck.gdp after getting data
            }
        }

        var foundMatches = false;
        var search;
        
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = [];

        search = L.geoJson(data, {filter: function(feature) {
           
            //Each if statements calls the same function but changes the ordering of filter options
            if (cycleSelectedFilters(feature, selectedLocation.population, selectedLocation.carbon, selectedLocation.gdp) ){
                foundMatches = true;
                return true;
            } else if (cycleSelectedFilters(feature, selectedLocation.population, selectedLocation.carbon, selectedLocation.gdp) ) {
                foundMatches = true;
                return true;
            } else { //Add another else if for gdp
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

// This function goes through each filter selection and determines in the filter will apply and will
//  add a new marker for the feature accordingly
// If feature is within the filter bounds, the method will return true, otherwise it will return false
function cycleSelectedFilters(feature, selection1, selection2, selection3) {
    if (selection1.slider) {
        if (filterComparison(feature, selection1.value, selection1.valPercent, selection1.name) ) {
            if (selection2.slider) {
                if (filterComparison(feature, selection2.value, selection2.valPercent, selection2.name) ) {
                    // Another if statement for gdp
                    // if (sliderCheck.gdp) {
                    //     if (gdpComparison(feature, selectedGDP, gdpValPercent) ) {
                    //         return true;
                    //     } else {
                    //         return false;
                    //     }
                    // }
                    addMarkerActions(feature);
                    return true;
                } else {
                    return false;
                }
                
            } 
            // Another if statement for gdp
            // if (sliderCheck.gdp) {
            //     if (gdpComparison(feature, selectedGDP, gdpValPercent) ) {
            //         if(sliderCheck.carbon) {
            //             if (carbonComparision(feature, selectedCarbon, carbonValPercent) ) {
            //                 return true;
            //             } else {
            //                 return false;
            //             }
            //         }
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }
            addMarkerActions(feature);
            return true;
        } else {
            return false;
        }
    }                                      
}

// This method compares the feature with the filter bounds
// The method will return true if the feature is within bounds and false if not
function filterComparison(feature, initialAmount, range, type) {
    var featureType;
    if (type == "population") {
        featureType = feature.properties.POPULATION
    } else /* if (type == "carbon") */ {
        featureType = feature.properties.CARBON
    } //else type gdp

    if (featureType >= (initialAmount * (1.0 - range)) && 
        featureType <= (initialAmount * (1.0 + range))){
        return true;
    }
    return false;
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
    var marker = L.geoJson(feature).bindPopup(content)//.addTo(markerLayer);
    marker.setStyle({
        fillColor: 'white'
    });
    marker.addTo(markerLayer);
    markerObject[feature.properties.GID_2] = marker
    marker.on("click", function(event) { 
        document.getElementById("dropDown").selectedIndex = dropDownOptions.indexOf(event.layer.feature.properties.GID_2 + "");
//>>>>>>> master conflict started on line 291
    });
}

// This method removes all the options within the dropdown list
function removeLocationOptions() {
    var locationList = document.getElementById("dropDown");
    for ( var i = locationList.options.length -1 ; i >= 0 ; i-- ) {
        locationList.remove(i);
    }
}