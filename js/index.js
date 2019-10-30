"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.querySelectorAll(".input-radio").forEach(function (input) {
  return input.addEventListener('click', getName);
});

function getName() {
  var targetElement = event.target;
  var inputName = targetElement.getAttribute('name');
  getActive(inputName);
}

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
}

function tooltips(element, text) {
  new Tooltip(document.getElementById(element), {
    placement: "top",
    title: text
  });
}

var tooltipInfo = [['tooltip-pf', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-idc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '], ['tooltip-vdc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ']];
document.addEventListener('DOMContentLoaded', function () {
  var _arr = tooltipInfo;

  for (var _i = 0; _i < _arr.length; _i++) {
    var args = _arr[_i];
    tooltips.apply(void 0, _toConsumableArray(args));
  }
});

var barChart = function barChart() {
  var margin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 56
  };
  var width = 300 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
  var chart = d3.select('#pib-chart');
  var svg = chart.select('svg');
  var g = d3.select("svg").append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
  var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.2);
  var x1 = d3.scaleBand().padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var z = d3.scaleOrdinal().range(["#006D63", "#B8DF22"]);
  d3.csv("csv/test-frp.csv", function (d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) {
      d[columns[i]] = +d[columns[i]];
    }

    return d;
  }, function (error, data) {
    if (error) throw error;
    var keys = data.columns.slice(1);
    x0.domain(data.map(function (_ref) {
      var type = _ref.type;
      return type;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([d3.min(data, function (d) {
      return d3.min(keys, function (key) {
        return d[key] * 14;
      });
    }), d3.max(data, function (d) {
      return d3.max(keys, function (key) {
        return d[key];
      });
    })]).nice();
    g.append("g").selectAll("g").data(data).enter().append("g").attr("transform", function (_ref2) {
      var type = _ref2.type;
      return "translate(".concat(x0(type), ",0)");
    }).selectAll("rect").data(function (d) {
      return keys.map(function (key) {
        return {
          key: key,
          value: d[key]
        };
      });
    }).enter().append("rect").attr("class", "rect").attr("x", function (d) {
      return x1(d.key);
    }).attr('y', function (d) {
      if (d.value > 0) {
        return y(d.value);
      } else {
        return y(0);
      }
    }).attr("width", x1.bandwidth()).attr('height', function (d) {
      return Math.abs(y(d.value) - y(0));
    }).attr("fill", function (d) {
      return z(d.key);
    });
    g.append("g").attr("class", "axis").attr("transform", "translate(0,".concat(height / 2.5, ")")).call(d3.axisBottom(x0));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks());
  });
};

barChart();