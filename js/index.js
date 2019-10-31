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


var tooltipInfo = [['tooltip-pf', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-idc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-vdc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ']]; //When dom loaded launch radio buttons

document.addEventListener('DOMContentLoaded', function () {
  var _arr = tooltipInfo;

  for (var _i = 0; _i < _arr.length; _i++) {
    var args = _arr[_i];
    tooltips.apply(void 0, _toConsumableArray(args));
  }
}); //Some values from radio buttons

var idPib = document.getElementById('pib-chart');
var idEmpleo = document.getElementById('empleo-chart');
var csvTest = "test-frp";
var legendText = ["Miles de M €", "Miles"]; //Chart radio buttons

var barChart = function barChart(id, csv, legend) {
  var margin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 60
  };
  var width = 370 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;
  var chart = d3.select(id);
  var svg = chart.select('svg');
  var durationTransition = 400;
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
    var keys = data.columns.slice(1);
    x0.domain(data.map(function (_ref) {
      var type = _ref.type;
      return type;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([d3.min(data, function (d) {
      return d3.min(keys, function (key) {
        return d[key];
      });
    }), d3.max(data, function (d) {
      return d3.max(keys, function (key) {
        return d[key];
      });
    })]).nice();
    var axisX = g.append("g").attr("class", "axis axis-x").attr("transform", "translate(0,".concat(height, ")")).transition().duration(durationTransition).ease(d3.easeLinear).call(d3.axisBottom(x0));
    var axisY = g.append("g").attr("class", "axis axis-y").transition().duration(durationTransition).ease(d3.easeLinear).call(d3.axisLeft(y).tickFormat(locale.format('~s')).ticks(6).tickSizeInner(-width));
    var rects = g.append("g").selectAll("g").data(data).enter().append("g").attr("transform", function (_ref2) {
      var type = _ref2.type;
      return "translate(".concat(x0(type), ",0)");
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
      return y(value);
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
    var legends = g.append('text').attr('class', 'legend-top').attr("x", -45).attr("y", 0).text(legend);
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
      var containerInit = document.getElementsByClassName("container-init");

      for (var _i2 = 0; _i2 < containerInit.length; _i2++) {
        containerInit[_i2].style.display = 'none';
      }

      var fileName = arrayCheckedValues.join('-');
      d3.selectAll('.container-chart').remove().exit();
      barChart(idPib, fileName, legendText[0]);
      barChart(idEmpleo, fileName, legendText[1]);
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