var Maps =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	"path": "KSGU;KDEN",
	"time": "2017-02-01T20:30:00Z",
	"variance": 10
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = removeBeginEndDuplicates;
/* harmony export (immutable) */ __webpack_exports__["b"] = addToLayer;
//import L from 'leaflet';
//import $ from 'jQuery';

function removeBeginEndDuplicates(polygon) {
  return polygon;//FILLER
}

function addToLayer(layers, mapItem, type) {
  if (layers[type] === undefined) {
    layers[type] = L.layerGroup();
  }
  layers[type].addLayer(mapItem);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__airmets__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "airmets", function() { return __WEBPACK_IMPORTED_MODULE_0__airmets__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sigmets__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sigmets", function() { return __WEBPACK_IMPORTED_MODULE_1__sigmets__["a"]; });




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flightdata_json__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__flightdata_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_js__ = __webpack_require__(1);



var flightTime = new Date(__WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.time);

const styles = {
  "TURB-HI": { color: "darkorange" },
  "TURB-LO": { color: "darkred" },
  "LLWS": { color: "brown" },
  "ICE": { color: "darkblue" },
  "FZLVL": { color: "blue" },
  "IFR": { color: "darkpurple" },
  "MT_OBSC": { color: "darkpink" },
}

const disabledTypes = ["FZLVL", "IFR", "MT_OBSC"];

const HOURS = 60*60*1000;

// A storage space for groups of layers.
var layers = {};

/* harmony default export */ __webpack_exports__["a"] = function(callback) {
  $.get({
    url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
    data: {
        dataSource: "gairmets",
        requestType: "retrieve",
        format: "xml",
        flightPath: __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.variance + ";" + __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.path,
        hoursBeforeNow: 3, // We just need the latest forecasts.
    },
    dataType : "xml",
    crossDomain: true,
  })
  .done(function( xml ) {
    $( xml )
      .find( "GAIRMET" )
      .filter(function(){
        // Only use AIRMETs that are 1.5 hours or less from the flight time. AIRMETs are issued every three hours for three hour periods in advance, so 1.5 hours is half of 3.
        let airmet_time = new Date( $( this ).children( "expire_time" ).text() );
        if (Math.abs(airmet_time - flightTime) < 1.5*HOURS) {
          return true;
        }
      })
      .each(function(){
        var mapItem;

        // Get the hazard type.
        let type = $( this ).children( "hazard" ).attr( "type" );

        // Remove unwanted types.
        if ( disabledTypes.includes(type) ) return;

        // Make an outline of the polygon from the points.
        let outline = [];
        $( this ).find( "area point" ).each(function(){
            let longitude = $(this).children("longitude").text();
            let latitude = $(this).children("latitude").text();
            outline.push([Number(latitude), Number(longitude)]);
          });

          // Remove duplicate beginning and ending elements.
          outline = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_js__["a" /* removeBeginEndDuplicates */])(outline);

          // Is it a polygon or a line?
          let geometry_type =  $( this ).children( "geometry_type" ).text();
          if (geometry_type === "AREA") {
            mapItem = L.polygon(outline, styles[type])
            .bindPopup(type);
          } else if (geometry_type === "LINE") {
            mapItem = L.polyline(outline, styles[type]);
          }

          // Add the item to the appropriate layer.
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_js__["b" /* addToLayer */])(layers, mapItem, type);
        });
      callback(layers);
    });
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flightdata_json__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__flightdata_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_js__ = __webpack_require__(1);



var flightTime = new Date(__WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.time);

const styles = {
  "TURB-HI": { color: "darkorange" },
  "TURB-LO": { color: "darkred" },
  "LLWS": { color: "brown" },
  "ICE": { color: "darkblue" },
  "FZLVL": { color: "blue" },
  "IFR": { color: "darkpurple" },
  "MT_OBSC": { color: "darkpink" },
}

// A storage space for groups of layers.
var layers = {};

/* harmony default export */ __webpack_exports__["a"] = function(callback) {
  $.get({
    url: "https://adds-forwarder.herokuapp.com/dataserver_current/httpparam",
    data: {
        dataSource: "airsigmets",
        requestType: "retrieve",
        format: "xml",
        flightPath: __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.variance + ";" + __WEBPACK_IMPORTED_MODULE_0__flightdata_json___default.a.path,
        hoursBeforeNow: 4, // We just need the latest forecasts. This does exclude hurracaines.
    },
    dataType : "xml",
    crossDomain: true,
  })
  .done(function( xml ) {
    $( xml )
      .find( "AIRSIGMET" )
      .filter(function(){
        // Only use SIGMETs if they apply to the flight time.
        let sigmet_start_time = new Date( $( this ).children( "valid_time_from" ).text() );
        let sigmet_end_time = new Date( $( this ).children( "valid_time_to" ).text() );
        if ((flightTime >= sigmet_start_time) && (flightTime <= sigmet_end_time)) {
          return true;
        }
      })
      .each(function(){
        var mapItem;

        // Get the hazard type.
        let type = $( this ).children( "hazard" ).attr( "type" );

        // Remove unwanted types.
        if ( disabledTypes.includes(type) ) return;

        // Make an outline of the polygon from the points.
        let outline = [];
        $( this ).find( "area point" ).each(function(){
            let longitude = $(this).children("longitude").text();
            let latitude = $(this).children("latitude").text();
            outline.push([Number(latitude), Number(longitude)]);
          });

          // Remove duplicate beginning and ending elements.
          outline = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_js__["a" /* removeBeginEndDuplicates */])(outline);

          // SIGMETs are always polygons.
          mapItem = L.polygon(outline, styles[type])
            .bindPopup(type);

          // Add the item to the appropriate layer.
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_js__["b" /* addToLayer */])(layers, mapItem, type);
        });
      callback(layers);
    });
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map_handlers_index__ = __webpack_require__(2);
/* harmony export (immutable) */ __webpack_exports__["createMap"] = createMap;


function createMap(mapType, mapID) {
  var map = L.map(mapID).setView([39.8282, -98.5795], 4);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  __WEBPACK_IMPORTED_MODULE_0__map_handlers_index__[mapType](function(layers){
    for (let layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        map.addLayer(layers[layer]);
      }
    }
    L.control.layers(null, layers).addTo(map);
  });
}


/***/ })
/******/ ]);