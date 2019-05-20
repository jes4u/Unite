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
//var search;
var mymap;
var currentSelcted;

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

   


});

function addPopup(feature, layer){
  layer.bindPopup(feature.properties.NAME_0);
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
    //console.log(content.childNodes);

    currentSelcted = feature;

    return content;
  }

function onClickSearch(input) {
    //var input = document.getElementById('searchbox').value;
    var search;
    $.getJSON("/Data/GeoJSONFiles/countypoint.geojson", function(data){
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
        }}) 
        console.log(search);
        mymap.fitBounds(search.getBounds())
    });
}

//Old name: useLocation
function searchPopulationPercent() {
    //console.log(values)
    var search;
    var input = $("#searchboxinput").val
    onClickSearch(input);
    var popValPercent = values.population / 100;
    var carbonValPercent = values.carbon / 100;
    var gdpValPercent = values.gdp / 100;
    $.getJSON("/Data/GeoJSONFiles/countypoint.geojson", function(data){
        var content;
        if (typeof search != "undefined") {
            search.clearLayers();
        }
        search = L.geoJson(data, {filter: function(feature) {
            
            if (((feature.properties.POPULATION > (selectedFeature.properties.POPULATION * (1.0 - popValPercent)) && 
                feature.properties.POPULATION < (selectedFeature.properties.POPULATION * (1.0 + popValPercent)))) || 
                feature.properties.HASC_2 == selectedFeature.properties.HASC_2) 
            {
                content = popupContent(feature);
                L.geoJson(feature).bindPopup(content).addTo(mymap);
                return true;
            } else {
                return false;
            }
        }})
        mymap.fitBounds(search.getBounds())
    });
}
