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
    population: {
        min: 0,
        max: 20
    },
    gdp: {
        min: 0,
        max: 20
    },
    carbon: {
        min: 0,
        max: 20
    }
}

//Map object
var mymap;
var currentSelcted;
var explore;
var compare;
var color;

// Array of Options tags for the dropdown/Select tag
var dropDownOptions = [];
// Object variabel containing the data of each marker on the map. Key is the location's ORIG_FID, value is the marker object
var markerObject = {};
// Layer group for markers
var markerLayer;

var nationAbbr = {};
var cityList = [];
var countyList = [];
var nationList = [];
var stateList = [];

var isOnCompare = false;
var compare1;
var compare2;


$(document).ready(function () {


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
    var searchboxControl = createSearchboxControl();
    explore = new searchboxControl({
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
                    onclick: "activateSlider('carbon');",
                    min: sliderValues.carbon.min,
                    max: sliderValues.carbon.max
                }
            ]
        }
    });

    compare = new searchboxControl({
        sidebarTitleText: "Compare",
        sidebarMenuItems: {
            Items: [
                {
                    type: "search",
                    id: "compare1"
                },
                {
                    type: "search",
                    id: "compare2"
                }
            ]
        }
    });

    // Onclick search button
    explore._searchfunctionCallBack = function (searchkeywords) {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }

        onClickSearch(searchkeywords)
    }
    mymap.addControl(explore);

    markerLayer = L.layerGroup().addTo(mymap);

    $.getJSON('./Data/GeoJSONFiles/nationpoint.geojson', function (data) {
        var search
        search = L.geoJson(data, {
            filter: function (feature) {
                nationAbbr[feature.properties.GID_0] = feature.properties.NAME;
            }
        });
    });

    $.getJSON('./Data/GeoJSONFiles/allpoint.geojson', function (data) {
        var search;
        search = L.geoJson(data, {
            filter: function (feature) {
                if (feature.properties.UNITTYPE == "URBANEXTENT") {
                    cityList.push(feature.properties.NAME + ", " + nationAbbr[feature.properties.ISO3] + " " + feature.properties.ORIG_FID)
                } else if (feature.properties.UNITTYPE == "COUNTY") {
                    countyList.push(feature.properties.NAME_2 + ", " + feature.properties.NAME_1 + ", " + feature.properties.NAME_0 + " " + feature.properties.ORIG_FID)
                } else if (feature.properties.UNITTYPE == "NATION") {
                    nationList.push(feature.properties.NAME + " " + feature.properties.ORIG_FID)
                } else if (feature.properties.UNITTYPE == "STATE") {
                    stateList.push(feature.properties.NAME_1 + ", " + feature.properties.NAME_0 + " " + feature.properties.ORIG_FID)
                }
            }
        })
    });

});


// This method controls the display of the sliders within the filter panel.
//If the checkbox is checked then the slider appears, if it is not checked, the slider disappears
function activateSlider(element) {
    let checkboxEle = document.getElementById(element + "ID");
    let sliderEle = document.getElementById(element + "SliderID");
    let searchbox = document.getElementById("controlbox");
    let panelHeaderTitle = document.getElementById("panel-header-title");
    if (checkboxEle.checked == true) {
        sliderEle.parentElement.parentElement.parentElement.style.display = "block";
        sliderCheck[element] = true;
    } else {
        sliderEle.parentElement.parentElement.parentElement.style.display = "none";
        sliderCheck[element] = false;
    }

}

// This method constantly updates the display for current slider value everytime the slider changes value
function updateSliderValue(element, value) {
    values[element] = value;
    let valEle= "value" + element;
    document.getElementById(valEle).innerHTML = "Value: " + value;
}


function popupContent(feature, title) {

    var content = document.createElement("div");
    var head = document.createElement("p");
    head.innerHTML = title;
    var link = document.createElement("a");
    content.appendChild(head);
    content = themeInfo(feature, content);
    // keywork seems to be unhelpful currently so I am replacing it with the title element
    // additionally, scale Info was causing it to crash
    // var keyword = "";
    // keyword += scaleInfo(content, keyword);
    // keyword += themeKeyword();
    link.href = "http://www.google.com/search?q=" + title.split(": ")[1];
    link.innerHTML = "Search for more information!";
    link.target = "_blank";
    content.appendChild(link);
    currentSelcted = feature;
    return content;
}

// function scaleInfo(content, keyword){
//   var scale = document.getElementById("scale");
//   var selected = scale.options[scale.selectedIndex].id;
//   for(var i = 0; i < parseInt(selected); i++){
//     // this line was causing issues so I commented it out -SK
//     content.childNodes[i].style.display = "block";
//     keyword += content.childNodes[i].value + " ";
//   }
//   return keyword;
// }

function themeKeyword() {
    if (document.getElementById("gdpID").checked) {
        return "GDP";
    } else if (document.getElementById("populationID").checked) {
        return "Population";
    } else if (document.getElementById("carbonID").checked) {
        return "Carbon Emission";
    } else {
        return "";
    }
}

function themeInfo(feature, content) {

    if (isOnCompare || document.getElementById("gdpID").checked) {
        // gdp to be added
    }
    if (isOnCompare || document.getElementById("populationID").checked) {
        var population = document.createElement("p");
        population.innerHTML = "Population: " + feature.properties.POPULATION;
        var popDensity = document.createElement("p");
        popDensity.innerHTML = "Population Density: " + feature.properties.POPDENSITY;
        content.appendChild(population);
        content.appendChild(popDensity);
    }
    if (isOnCompare || document.getElementById("carbonID").checked) {
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
    $.getJSON('./Data/GeoJSONFiles/allpoint.geojson', function (data) {
        var search;
        var foundLocation = false;
        markerLayer.clearLayers();
        removeLocationOptions();
        dropDownOptions = [];
        var value = 0;
        var scale = document.getElementById("scale").options[document.getElementById("scale")
                .selectedIndex].value.toUpperCase();
        search = L.geoJson(data, {filter: function(feature) {
            if (feature.properties.UNITTYPE != scale || feature.properties.UNINAME.split(" ").length == 1) {
                return false;
            }
            value = 0;
            (input.toString().toLowerCase().split(" ")).forEach(function(word){
                value += (feature.properties.UNINAME.toString() + feature.properties.NAME 
                        + feature.properties.NAME_0 + feature.properties.NAME_1 + feature.properties.NAME_2 
                        + feature.properties.ISO3).toLowerCase().includes(word);
            });
            if (value == input.toString().split(" ").length){
                addMarkerActions(feature);
                foundLocation = true;
                return true;
            }
            return false;
        }})
        if(foundLocation) {
            mymap.fitBounds(search.getBounds());
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
    $.getJSON("/Data/GeoJSONFiles/allpoint.geojson", function (data) {
        var dropDownValue = document.getElementById("dropDown").value;
        if (dropDownValue === "") {
            alert("Location not selected in the dropdown. Canceling search");
            return;
        }

        if (!sliderCheck.carbon && !sliderCheck.gdp && !sliderCheck.population) {
            alert("No filters selected. Canceling search");
            return;
        }

        var selectedProperties = markerObject[dropDownValue]._layers[markerObject[dropDownValue]._leaflet_id - 1].feature.properties;

        var selectedLocation = {
            population: {
                name: "population",
                valPercent: values.population / 100,
                value: selectedProperties.POPULATION,
                slider: sliderCheck.population
            },
            carbon: {
                name: "carbon",
                valPercent: values.carbon / 100,
                value: selectedProperties.CARBON,
                slider: sliderCheck.carbon
            },
            gdp: {
                name: "gdp",
                valPercent: values.gdp / 100,
                value: 0, //insert value amount
                slider: false // change to sliderCheck.gdp after getting data
            }
        }

        var foundMatches = false;
        var search;

        //markerLayer.clearLayers();


        search = L.geoJson(data, {
            filter: function (feature) {

                //Each if statements calls the same function but changes the ordering of filter options
                if (cycleSelectedFilters(feature, selectedLocation.population, selectedLocation.carbon, selectedLocation.gdp)) {
                    if (!foundMatches) {
                        markerLayer.clearLayers();
                        removeLocationOptions();
                        dropDownOptions = [];
                    }
                    foundMatches = true;
                    return true;
                } else if (cycleSelectedFilters(feature, selectedLocation.carbon, selectedLocation.population, selectedLocation.gdp)) {
                    if (!foundMatches) {
                        markerLayer.clearLayers();
                        removeLocationOptions();
                        dropDownOptions = [];
                    }
                    foundMatches = true;
                    return true;
                } else { //Add another else if for gdp
                    return false;
                }

            }
        })
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
        if (filterComparison(feature, selection1.value, selection1.valPercent, selection1.name)) {
            if (selection2.slider) {
                if (filterComparison(feature, selection2.value, selection2.valPercent, selection2.name)) {
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
        featureType = feature.properties.POPULATION;
    } else /* if (type == "carbon") */ {
        featureType = feature.properties.CARBON;
    } //else type gdp

    if (featureType >= (initialAmount * (1.0 - range)) &&
        featureType <= (initialAmount * (1.0 + range))) {
        return true;
    }
    return false;
}

// This method adds each location found into the dropdown option and adds the location marker into the
//  marker group layer.
function addMarkerActions(feature) {
    var title;
    switch (feature.properties.UNITTYPE) {
        case "STATE":
            title = "State:  " + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
            color = "green";
            break;
        case "COUNTY":
            title = "County:  " + feature.properties.NAME_2 + ", " 
                    + feature.properties.NAME_1 + ", " + feature.properties.NAME_0;
            color = "yellow";
            break;
        case "NATION":
            title = "Nation:  " + feature.properties.NAME;
            color = "blue";
            break;
        case "URBANEXTENT":
            title = "Urban Extent:  " + feature.properties.NAME + ", " + feature.properties.ISO3;
            color = "violet";
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
    if(!isOnCompare){
        dropDown.appendChild(option);
    }
    var marker = L.geoJson(feature).bindPopup(content);//.addTo(markerLayer);
    marker.setStyle({
        fillColor: 'white'
    });
    marker.addTo(markerLayer);
    markerObject[feature.properties.ORIG_FID] = marker;
    if (!isOnCompare){
        marker.on("click", function (event) {
            document.getElementById("dropDown").selectedIndex = dropDownOptions.indexOf(event.layer.feature.properties.ORIG_FID + "");
        });
    }
    // Because changing color also makes use of the 'feature' object and the switch statement,
    // I joined it with the pop-up function
    document.getElementsByClassName("leaflet-pane leaflet-marker-pane")[0].lastChild.src = 
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + ".png";
}

// This method removes all the options within the dropdown list
function removeLocationOptions() {
    var locationList = document.getElementById("dropDown");
    if( locationList == null) {
        return;
    }
    for (var i = locationList.options.length - 1; i >= 0; i--) {
        locationList.remove(i);
    }
}

function searchCompare() {

    console.log(compare1 + " " +  compare2)
    var searchIDs = document.getElementsByClassName("searchID")
    console.log(searchIDs)
    console.log(document.getElementById("compare1").value)

    $.getJSON('./Data/GeoJSONFiles/allpoint.geojson', function (data) {
        var search;
        var foundLocation = false;
        search = L.geoJson(data, {
            filter: function (feature) {
                if (feature.properties.UNINAME.split(" ").length == 1) {
                    return false;
                }
                if (feature.properties.ORIG_FID == compare1 || feature.properties.ORIG_FID == compare2) {
                    //console.log(value)
                    addMarkerActions(feature);
                    foundLocation = true;
                    return true;
                }
                return false;
            }
        })
        if (foundLocation) {
            mymap.fitBounds(search.getBounds())
        } else {
            alert("Location not found... replace with modal popup");
        }

    });
}

function openExplore() {
    mymap.removeControl(compare);
    isOnCompare = false;
    mymap.addControl(explore);
    $(".panel").toggle();
    document.getElementById("controlbox").classList.add("hidden");
    markerLayer.clearLayers();
    removeLocationOptions();
    dropDownOptions = [];
}

function openCompare() {
    markerLayer.clearLayers();
    removeLocationOptions();
    dropDownOptions = [];
    mymap.removeControl(explore);
    isOnCompare = true;
    mymap.addControl(compare);
    $(".panel").toggle(function () {
        autocomplete(document.getElementById("compare1"), nationList, "compare1");
        autocomplete(document.getElementById("compare2"), nationList, "compare2");

        $("#scale0").change(function() {
            var scaleVal = document.getElementById("scale0").value;
            scaleSelection("compare1", scaleVal);
        });
        $("#scale1").change(function() {
            var scaleVal = document.getElementById("scale1").value;
            scaleSelection("compare2", scaleVal);
        });

    });
    document.getElementById("controlbox").classList.add("hidden");

}

function scaleSelection(compareSearch, scale) {
    if (scale == "nation") {
        autocomplete(document.getElementById(compareSearch), nationList, compareSearch);
    } else if (scale == "state") {
        autocomplete(document.getElementById(compareSearch), stateList, compareSearch);
    } else if (scale == "county") {
        autocomplete(document.getElementById(compareSearch), countyList, compareSearch);
    } else if (scale == "city") {
        autocomplete(document.getElementById(compareSearch), cityList, compareSearch);
    }
}


// Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp 
function autocomplete(inp, arr, compareSearch) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            var location = arr[i].substr(0, arr[i].lastIndexOf(" "));
            var idLocation = arr[i].substr(arr[i].lastIndexOf(" ") + 1, arr[i].length)
            /*check if the item starts with the same letters as the text field value:*/
            if (location.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + location.substr(0, val.length) + "</strong>";
                b.innerHTML += location.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + location + "'>";
                b.innerHTML += '<input type="hidden" value="' + idLocation + '">';
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    if (compareSearch == "compare1") {
                        compare1 =  this.getElementsByTagName("input")[1].value;
                    } else {
                        compare2 =  this.getElementsByTagName("input")[1].value;
                    }
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
