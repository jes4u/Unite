//Editors: Jesse Tran

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
        min: 1,
        max: 101
    },
    carbon : {
        min: 2,
        max: 102
    }
}

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

    //popup proto
    $.getJSON("sample.geojson", function(data) {
      var dataLayer = L.geoJson(data, {onEachFeature: addPopup}).addTo(mymap);
      console.log("here");
    });

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

    var search;
    function onClickSearch(input) {
        //var input = document.getElementById('searchbox').value;
        $.getJSON("../citydatatest.geojson", function(data){
            if (typeof search != "undefined") {
                search.clearLayers();
            }
            var selected;
            search = L.geoJson(data, {filter: function(feature) {
                selected = feature;
                if (feature.properties.NAME_2 == null) {
                    return false;
                }
                return feature.properties.NAME_2.toLowerCase() == input.toLowerCase();
            }}).addTo(mymap).on('click', function() {useLocation(selected);});
            mymap.fitBounds(search.getBounds());
        });
    }

    function useLocation(selected) {
        $.getJSON("../citydatatest.geojson", function(data){
            if (typeof search != "undefined") {
                search.clearLayers();
            }
            search = L.geoJson(data, {filter: function(feature) {
                return ((feature.properties.POPULATION > (selected.properties.POPULATION * 0.99) && 
                        feature.properties.POPULATION < (selected.properties.POPULATION * 1.02))) || 
                        feature.properties.HASC_2 == selected.properties.HASC_2;
            }}).addTo(mymap);
            mymap.fitBounds(search.getBounds());
        });
    }
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

