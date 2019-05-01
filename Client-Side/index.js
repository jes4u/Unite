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


    var searchboxControl=createSearchboxControl();
    var control = new searchboxControl({
        sidebarTitleText: 'Header',
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
        alert(searchkeywords);
    }
    mymap.addControl(control);

    
});

function activateSlider(element) {
    console.log(element);
    let checkboxEle = document.getElementById(element + "ID");
    let sliderEle = document.getElementById(element + "SliderID");
    if( checkboxEle.checked == true ) {
        sliderEle.style.display = "block";
    } else {
        sliderEle.style.display = "none";
    }
    
    //need if statements to remove sliders
}

