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

var selectedFeature;
var search;
var mymap;
var currentSelcted;
var control;

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
    control = new searchboxControl({
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

//onclick checkboxes makes sliders appear and disappear
function activateSlider(element) {
    //console.log(element);
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

//store values when submit button
function updateSliderValue(element, value) {
    //console.log(element + " has value " + value);
    values[element] = value
    let valEle= "value" + element;
    document.getElementById(valEle).innerHTML = "Value: " + value;
}

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

function onClickSearch(input) {
    //var input = document.getElementById('searchbox').value;
    $.getJSON("/Data/GeoJSONFiles/" + checkScale(), function(data){
        if (typeof search != "undefined") {
            search.clearLayers();
        }
        var content;
        search = L.geoJson(data, {filter: function(feature) {
            selectedFeature = feature;
            if (feature.properties.NAME_2 == null) {
                return false;
            }
            if(feature.properties.NAME_2.toString().toLowerCase() == input.toString().toLowerCase()){
                content = popupContent(feature);

                var dropDown = document.getElementById("dropDown");
                var option = document.createElement("option");
                option.value = '"' + feature.properties.GID_2 + '"';
                option.innerHTML = feature.properties.NAME_2 + " County " + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
                dropDown.appendChild(option);

                //console.log(feature)
                L.geoJson(feature).bindPopup(content).addTo(mymap);

                return true;
            }
            return false;
            //need to apply bindpopup to every feature in true
        }})
        mymap.fitBounds(search.getBounds())
    });
    //console.log(selectedFeature)
}

//Old name: useLocation
function searchPopulationPercent() {
    console.log(values)
    var input = $("#searchboxinput").val
    onClickSearch(input);
    var content;
    var popValPercent = values.population / 100;
    var carbonValPercent = values.carbon / 100;
    var gdpValPercent = values.gdp / 100;
    $.getJSON("/Data/GeoJSONFiles/countypoint.geojson", function(data){
        if (typeof search != "undefined") {
            search.clearLayers();
        }
        search = L.geoJson(data, {filter: function(feature) {
            if (((feature.properties.POPULATION > (selectedFeature.properties.POPULATION * (1.0 - popValPercent)) &&
            feature.properties.POPULATION < (selectedFeature.properties.POPULATION * (1.0 + popValPercent)))) ||
            feature.properties.HASC_2 == selectedFeature.properties.HASC_2){
              content = popupContent(feature);
              return true;
            }
            return false;
        }}).bindPopup(content).addTo(mymap);
        mymap.fitBounds(search.getBounds());
    });
}
