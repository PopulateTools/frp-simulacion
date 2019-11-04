"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

//Listen radiobuttons and fire functions to get the names and radio buttons
document.querySelectorAll(".input-radio").forEach(function (input) {
  return input.addEventListener('click', function () {
    getName();
    checkValues();
  });
}); //Get the name for every group of radio buttons

function getName() {
  var targetElement = event.target;
  var inputName = targetElement.getAttribute('name');
  getActive(inputName);
} //Add active class to radio buttons


function getActive(name) {
  var inputs = document.querySelectorAll("input[name='".concat(name, "']"));

  for (var i = 0; i < inputs.length; i++) {
    var element = inputs[i].parentNode;

    if (inputs[i].checked === false) {
      element.classList.remove('active-checkbox');
    } else {
      element.classList.add('active-checkbox');
    }
  }
} //Fire tooltips with different radio buttons


function tooltips(element, text) {
  new Tooltip(document.getElementById(element), {
    placement: "top",
    title: text
  });
} //Text radio buttons


var tooltipInfo = [['tooltip-pf', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-idc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-vdc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ']]; //When dom loaded launch tooltips

document.addEventListener('DOMContentLoaded', function () {
  var _arr = tooltipInfo;

  for (var _i = 0; _i < _arr.length; _i++) {
    var args = _arr[_i];
    tooltips.apply(void 0, _toConsumableArray(args));
  }
}); //Some values from charts

var idPib = document.getElementById('pib-chart');
var idEmpleo = document.getElementById('empleo-chart');
var legendText = ["Miles de M €", "Miles"]; //Charts

var barChart = function barChart(id, csv, legend) {
  var margin = {
    top: 24,
    right: 16,
    bottom: 16,
    left: 60
  };
  var width = 370 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;
  var chart = d3.select(id);
  var svg = chart.select('svg');
  var durationTransition = 400;
  var data;
  var g = svg.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr('class', 'container-chart');
  svg.attr('width', "100%").attr('height', 250);
  var x0 = d3.scaleBand().rangeRound([10, width]).paddingInner(0.3);
  var x1 = d3.scaleBand();
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var z = d3.scaleOrdinal().range(["#006D63", "#B8DF22"]);
  d3.csv("csv/".concat(csv, ".csv"), function (d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) {
      d[columns[i]] = +d[columns[i]];
    }

    return d;
  }, function (error, data) {
    if (error) throw error;
    var locale = d3.formatDefaultLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3]
    });
    /* Generate a new dataset */

    var arrayDifNeta = [];
    var arrayDifAcumulada = [];
    var arrayDifNetaAcumula = [];
    var years = ["2019", "2020", "2021", "2022"];

    for (var i = 0; i < data.length; i++) {
      var difNeta = data[i].simulacionpib - data[i].prevision;
      arrayDifNeta.push(difNeta);
    }

    arrayDifAcumulada.push(arrayDifNeta[0]);
    var difAcumuladaValue2020 = arrayDifNeta[0] + arrayDifNeta[1];
    arrayDifAcumulada.push(difAcumuladaValue2020);
    var difAcumuladaValue2021 = difAcumuladaValue2020 + arrayDifNeta[2];
    arrayDifAcumulada.push(difAcumuladaValue2021);
    var difAcumuladaValue2022 = difAcumuladaValue2021 + arrayDifNeta[3];
    arrayDifAcumulada.push(difAcumuladaValue2022);
    console.log("arrayDifAcumulada", arrayDifAcumulada);
    arrayDifNetaAcumula = arrayDifNeta.map(function (value, index) {
      return [years[index], arrayDifNeta[index], arrayDifAcumulada[index]];
    });
    var dataDifNetAcu = arrayDifNetaAcumula.map(function (key) {
      return {
        year: key[0],
        neta: key[1],
        acumulada: key[2]
      };
    });
    var keys = d3.keys(dataDifNetAcu[0]);
    keys = keys.slice(1);
    x0.domain(dataDifNetAcu.map(function (_ref) {
      var year = _ref.year;
      return year;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([d3.min(dataDifNetAcu, function (d) {
      return d3.min(keys, function (key) {
        return d[key] * 2;
      });
    }), d3.max(dataDifNetAcu, function (d) {
      return d3.max(keys, function (key) {
        return d[key] * 1.25;
      });
    })]).nice();
    var axisX = g.append("g").attr("class", "axis axis-x").attr("transform", "translate(0,".concat(height, ")")).transition().duration(durationTransition).ease(d3.easeLinear).call(d3.axisBottom(x0));
    var axisY = g.append("g").attr("class", "axis axis-y").transition().duration(durationTransition).ease(d3.easeLinear).call(d3.axisLeft(y).tickFormat(locale.format('~s')).ticks(5).tickSizeInner(-width));
    var rects = g.append("g").selectAll("g").data(dataDifNetAcu).enter().append("g").attr("transform", function (_ref2) {
      var year = _ref2.year;
      return "translate(".concat(x0(year), ",0)");
    }).attr('class', 'grouped-bar-chart').selectAll("rect").data(function (d) {
      return keys.map(function (key) {
        return {
          key: key,
          value: d[key]
        };
      });
    }).enter().append("rect").attr("x", function (_ref3) {
      var key = _ref3.key;
      return x1(key);
    }).attr("y", function (_ref4) {
      var value = _ref4.value;
      return y(0);
    }).attr("width", x1.bandwidth()).attr('height', 0).transition().delay(function (d, i) {
      return i * 10;
    }).duration(durationTransition).attr("x", function (_ref5) {
      var key = _ref5.key;
      return x1(key);
    }).attr("y", function (_ref6) {
      var value = _ref6.value;
      return value > 0 ? y(value) : y(0);
    }).attr("height", function (_ref7) {
      var value = _ref7.value;
      return value > 0 ? y(0) - y(value) : y(value) - y(0);
    }).attr("width", x1.bandwidth()).attr("fill", function (_ref8) {
      var key = _ref8.key;
      return z(key);
    });
    var legends = g.append('text').attr('class', 'legend-top').attr("x", -45).attr("y", -10).text(legend);
    var keysSimulationPib = data.columns.slice(2, 3);
    var keysSimulationIncrease = data.columns.slice(3);
    var simulation = d3.selectAll('.simulation-pib-data').selectAll('div').data(data).enter().append("div").attr('class', 'simulation-pib-data-container w-100 turquoise20-bgc fl');
    simulation.selectAll("span").data(function (d) {
      return keysSimulationPib.map(function (key) {
        return {
          key: key,
          value: d[key]
        };
      });
    }).enter().append("span").attr('class', 'dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc').transition().duration(durationTransition).text(function (_ref9) {
      var value = _ref9.value;
      return locale.format(',.0f')(value);
    });
    simulation.selectAll(".simulation-percentage").data(function (d) {
      return keysSimulationIncrease.map(function (key) {
        return {
          key: key,
          value: d[key].toFixed(2)
        };
      });
    }).enter().append("span").attr('class', 'simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc').transition().duration(durationTransition).text(function (_ref10) {
      var value = _ref10.value;
      return value >= 0 ? "+".concat(value) : value;
    });
  });
}; //We need store values from radio buttons


function checkValues() {
  var arrayCheckedValues = [];
  var checkbox = document.getElementsByTagName('input');
  var checkboxChecked = 0;

  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      checkboxChecked++;
      var checkedValue = checkbox[i].id;
      arrayCheckedValues.push(checkedValue);
    }

    if (checkboxChecked === 3) {
      (function () {
        var containerInit = document.getElementsByClassName("container-init");

        var _loop = function _loop(_i2) {
          containerInit[_i2].style.width = 0;
          setTimeout(function () {
            containerInit[_i2].style.display = "none";
          }, 150);
        };

        for (var _i2 = 0; _i2 < containerInit.length; _i2++) {
          _loop(_i2);
        }

        var fileName = arrayCheckedValues.join('-');
        d3.selectAll('.container-chart').remove().exit();
        d3.selectAll('.simulation-pib-data-container').remove().exit();
        var fileNamePib = "pib/".concat(fileName);
        var fileNameEmpleo = "empleo/".concat(fileName);
        barChart(idPib, fileNamePib, legendText[0]);
        barChart(idEmpleo, fileNameEmpleo, legendText[1]);
      })();
    }
  }
}

function getWidth() {
  var widthSimulation = document.getElementById("empleo-simulacion").offsetWidth;
  var widthChart = document.getElementById("pib-chart").offsetWidth;
  var sumWidth = widthSimulation + widthChart;
  var containerInit = document.getElementsByClassName("container-init");

  for (var i = 0; i < containerInit.length; i++) {
    containerInit[i].style.width = "".concat(sumWidth, "px");
  }
}

getWidth();