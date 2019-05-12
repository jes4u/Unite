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
        max: 100
    },
    gdp : {
        min: 0,
        max: 100
    },
    carbon : {
        min: 2,
        max: 100
    }
}

var selectedFeature;
var search;
var mymap;

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

    var selected;
    function onClickSearch(input) {
        //var input = document.getElementById('searchbox').value;
        $.getJSON("../citydatatest.geojson", function(data){
            if (typeof search != "undefined") {
                search.clearLayers();
            }
            //var selected;
            var content;
            search = L.geoJson(data, {filter: function(feature) {
                selected = feature;
                if (feature.properties.NAME_2 == null) {
                    return false;
                }
                if(feature.properties.NAME_2.toLowerCase() == input.toLowerCase()){
                    content = popupContent(feature);
                    return true;
                }
                return false;
            }}).bindPopup(content).addTo(mymap);
            mymap.fitBounds(search.getBounds())
            selectedFeature = selected
        });
    }

    function popupContent(feature) {
      var content = document.createElement("div");
      var country = document.createElement("p");
      country.innerHTML = "Country: " + feature.properties.NAME_0;
      var city = document.createElement("p");
      city.innerHTML = "City/Province: " + feature.properties.NAME_1;
      var county = document.createElement("p");
      county.innerHTML = "County: " + feature.properties.NAME_2;
      var link = document.createElement("a");
      link.href = "http://www.google.com/search?q=" + feature.properties.NAME_0 + "+" + feature.properties.NAME_1 + "+" + feature.properties.NAME_2;
      link.innerHTML = "Search for more information!";
      content.appendChild(country);
      content.appendChild(city);
      content.appendChild(county);
      content.appendChild(link);
      console.log(content.childNodes);
      return content;
    }

    // function useLocation(selected) {
    //     $.getJSON("../citydatatest.geojson", function(data){
    //         if (typeof search != "undefined") {
    //             search.clearLayers();
    //         }
    //         search = L.geoJson(data, {filter: function(feature) {
    //             return ((feature.properties.POPULATION > (selected.properties.POPULATION * 0.99) &&
    //                     feature.properties.POPULATION < (selected.properties.POPULATION * 1.02))) ||
    //                     feature.properties.HASC_2 == selected.properties.HASC_2;
    //         }}).addTo(mymap);
    //         mymap.fitBounds(search.getBounds());
    //     });
    // }

    // function submitValues(selected) {
    //     console.log(values);
        
    // }    




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

}

//Old name: useLocation
function searchPopulationPercent() {
    var popValPercent = values.population / 100;
    console.log(popValPercent)
    $.getJSON("../citydatatest.geojson", function(data){
        if (typeof search != "undefined") {
            search.clearLayers();
        }
        search = L.geoJson(data, {filter: function(feature) {
            return ((feature.properties.POPULATION > (selectedFeature.properties.POPULATION * (1.0 - popValPercent)) && 
                    feature.properties.POPULATION < (selectedFeature.properties.POPULATION * (1.0 + popValPercent)))) || 
                    feature.properties.HASC_2 == selectedFeature.properties.HASC_2;
        }}).addTo(mymap);
        mymap.fitBounds(search.getBounds());
    });
}
