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
});
document.getElementById('button-view').addEventListener('click', function () {
  document.getElementById('initial-view').style.opacity = '0';
  setTimeout(function () {
    document.getElementById('initial-view').style.display = 'none';
    document.getElementById('simulation-view').style.display = 'block';
    multipleLine(pibCsv, scalePib[0], scalePib[1]);
  }, 300);
  document.getElementById('simulation-view').style.opacity = '1';
  simulationView = true;
});
document.getElementById('back-view').addEventListener("click", function () {
  document.getElementById('initial-view').style.opacity = '1';
  setTimeout(function () {
    document.getElementById('initial-view').style.display = 'block';
    document.getElementById('simulation-view').style.display = 'none';
    multipleLine();
  }, 300);
  document.getElementById('simulation-view').style.opacity = '0';
  document.querySelectorAll(".input-radio").checked = false;
  simulationView = false;
});
document.getElementById('empleo-view').addEventListener("click", function () {
  document.getElementById('pib-view').classList.remove('btn-view-active');
  document.getElementById('empleo-view').classList.add('btn-view-active');
});
document.getElementById('pib-view').addEventListener("click", function () {
  document.getElementById('empleo-view').classList.remove('btn-view-active');
  document.getElementById('pib-view').classList.add('btn-view-active');
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
var tablePib = '.simulation-pib-data';
var tableEmpleo = '.simulation-empleo-data';
var legendText = ["Miles de M €", "Miles"];
var simulationView = false;
var locale = d3.formatDefaultLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3]
}); //Charts

var barChart = function barChart(id, csv, legend, tableClass) {
  var margin = {
    top: 32,
    right: 16,
    bottom: 16,
    left: 56
  };
  var chart = d3.select(id);
  var svg = chart.select('svg');
  var width = 0;
  var height = 0;
  var w = 0;
  var h = 270;
  var durationTransition = 400;
  var dataz;
  var dataDifNetAcu;
  var scales = {};
  var z = d3.scaleOrdinal().range(["#006D63", "#B8DF22"]);
  var legends = svg.append('text').attr('class', 'legend-top').attr("x", 10).attr("y", 20).text(legend);

  var setupScales = function setupScales() {
    var dataDifNetAcu = dataz.map(function (key) {
      return {
        year: key[0],
        neta: key[1],
        acumulada: key[2]
      };
    });
    var keys = d3.keys(dataDifNetAcu[0]);
    keys = keys.slice(1);
    var countX = d3.scaleBand().rangeRound([10, width]).domain(dataDifNetAcu.map(function (_ref) {
      var year = _ref.year;
      return year;
    })).paddingInner(0.3);
    var countX1 = d3.scaleBand().domain(keys);
    var countY = d3.scaleLinear().domain([d3.min(dataDifNetAcu, function (d) {
      if (d3.min(keys, function (key) {
        return d[key];
      }) > 0) {
        return 0;
      } else {
        return d3.min(keys, function (key) {
          return d[key];
        });
      }
    }), d3.max(dataDifNetAcu, function (d) {
      if (d3.max(keys, function (key) {
        return d[key];
      }) < 0) {
        return 0;
      } else {
        return d3.max(keys, function (key) {
          return d[key];
        });
      }
    })]).nice();
    scales.count = {
      x0: countX,
      x1: countX1,
      y: countY
    };
  };

  var setupElements = function setupElements() {
    var g = svg.select('.bar-grouped-container');
    g.append('g').attr('class', 'axis axis-x');
    g.append('g').attr('class', 'axis axis-y');
    g.append('g').attr('class', 'bar-grouped-container-bis');
  };

  var updateScales = function updateScales(width, height) {
    scales.count.x0.rangeRound([10, width]);
    scales.count.x1.rangeRound([0, scales.count.x0.bandwidth()]);
    scales.count.y.range([height - margin.top, margin.bottom]);
  };

  var drawAxes = function drawAxes(g) {
    var axisX = d3.axisBottom(scales.count.x0);
    g.select('.axis-x').transition().delay(function (d, i) {
      return i * 10;
    }).duration(durationTransition).ease(d3.easeLinear).attr('transform', "translate(0,".concat(height - margin.top, ")")).call(axisX);
    var axisY = d3.axisLeft(scales.count.y).tickFormat(d3.format('d')).tickPadding(10).ticks(5).tickSizeInner(-width);
    g.select('.axis-y').transition().delay(function (d, i) {
      return i * 10;
    }).duration(durationTransition).ease(d3.easeLinear).call(axisY);
  };

  var updateChart = function updateChart(dataz) {
    w = chart.node().offsetWidth;
    h = 260;
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
    svg.attr('width', w).attr('height', h);
    var translate = "translate(".concat(margin.left, ",").concat(margin.top, ")");
    var g = svg.select('.bar-grouped-container');
    g.attr('transform', translate);
    updateScales(width, height);
    var container = chart.select('.bar-grouped-container-bis');
    var dataDifNetAcu = dataz.map(function (key) {
      return {
        year: key[0],
        neta: key[1],
        acumulada: key[2]
      };
    });
    var keys = d3.keys(dataDifNetAcu[0]);
    keys = keys.slice(1);
    var layer = container.selectAll('.container-grouped').data(dataDifNetAcu);
    layer.exit().remove();
    layer.enter().append('g').attr('class', 'container-grouped').attr("transform", function (_ref2) {
      var year = _ref2.year;
      return "translate(".concat(scales.count.x0(year), ",0)");
    });
    var rects = container.selectAll('.container-grouped').selectAll("rect").data(function (d) {
      return keys.map(function (key) {
        return {
          key: key,
          value: d[key]
        };
      });
    });
    rects.enter().append('rect').attr("width", scales.count.x1.bandwidth()).attr("x", function (_ref3) {
      var key = _ref3.key;
      return scales.count.x1(key);
    }).attr("fill", function (_ref4) {
      var key = _ref4.key;
      return z(key);
    }).attr("y", 0).transition().duration(durationTransition).attr("y", function (_ref5) {
      var value = _ref5.value;
      return value > 0 ? scales.count.y(value) : scales.count.y(0);
    }).attr("height", function (_ref6) {
      var value = _ref6.value;
      return Math.abs(scales.count.y(value) - scales.count.y(0));
    });
    rects.transition().duration(durationTransition).attr("y", function (_ref7) {
      var value = _ref7.value;
      return value > 0 ? scales.count.y(value) : scales.count.y(0);
    }).attr("height", function (_ref8) {
      var value = _ref8.value;
      return Math.abs(scales.count.y(value) - scales.count.y(0));
    });
    rects.exit().remove();
    drawAxes(g);
  };

  var resize = function resize() {
    d3.csv("csv/".concat(csv, ".csv"), type, function (error, data) {
      if (error) {} else {
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
        arrayDifNetaAcumula = arrayDifNeta.map(function (value, index) {
          return [years[index], arrayDifNeta[index], arrayDifAcumulada[index]];
        });
        dataz = arrayDifNetaAcumula;
        setupScales();
        updateChart(dataz);
      }
    });
  };

  var loadData = function loadData() {
    d3.csv("csv/".concat(csv, ".csv"), type, function (error, data) {
      if (error) {} else {
        var keysSimulationPib = data.columns.slice(2, 3);
        var keysSimulationIncrease = data.columns.slice(3);
        var simulation = d3.selectAll(tableClass).selectAll('div').remove().exit().data(data).enter().append("div").attr('class', 'simulation-pib-data-container w-100 turquoise20-bgc fl');
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
          return value >= 0 ? "+".concat(value, "%") : "".concat(value, "%");
        });
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
        arrayDifNetaAcumula = arrayDifNeta.map(function (value, index) {
          return [years[index], arrayDifNeta[index], arrayDifAcumulada[index]];
        });
        dataz = arrayDifNetaAcumula;
        setupElements();
        setupScales();
        updateChart(dataz);
      }
    });
  };

  function type(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) {
      d[columns[i]] = +d[columns[i]];
    }

    return d;
  }

  window.addEventListener('resize', resize);
  loadData();
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
      var fileNamePib = "pib/".concat(fileName);
      var fileNameEmpleo = "empleo/".concat(fileName);

      if (simulationView === false) {
        d3.selectAll('.legend-top').remove().exit();
        barChart(idPib, fileNamePib, legendText[0], tablePib);
        barChart(idEmpleo, fileNameEmpleo, legendText[1], tableEmpleo);
      }
    })();
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

var multipleLine = function multipleLine(csv, scaleY1, scaleY2) {
  var margin = {
    top: 24,
    right: 24,
    bottom: 32,
    left: 64
  };
  var width = 0;
  var height = 0;
  var chart = d3.select('#multiline-simulation-empleo');
  var svg = chart.select('svg');
  var scales = {};
  var dataz;
  var tooltipSimulation = chart.append('div').attr('class', 'tooltip-simulation').style('opacity', 0);

  var setupScales = function setupScales() {
    var countX = d3.scaleTime().domain([2019, 2022]);
    var countY = d3.scaleLinear().domain([scaleY1, scaleY2]);
    scales.count = {
      x: countX,
      y: countY
    };
  };

  var setupElements = function setupElements() {
    var g = svg.select('.multiline-simulation-empleo-container');
    g.append('g').attr('class', 'axis axis-x');
    g.append('g').attr('class', 'axis axis-y');
    g.append('g').attr('class', 'multiline-simulation-empleo-container-dos');
  };

  var updateScales = function updateScales(width, height) {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
  };

  var drawAxes = function drawAxes(g) {
    var axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format('d'));
    g.select('.axis-x').attr('transform', "translate(0,".concat(height, ")")).call(axisX);
    var axisY = d3.axisLeft(scales.count.y).tickFormat(locale.format(',.0f')).ticks(5).tickSizeInner(-width);
    g.select('.axis-y').call(axisY);
  };

  var updateChart = function updateChart(data) {
    var w = chart.node().offsetWidth;
    var h = 600;
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
    svg.attr('width', w).attr('height', h);
    var translate = "translate(".concat(margin.left, ",").concat(margin.top, ")");
    var g = svg.select('.multiline-simulation-empleo-container');
    g.attr('transform', translate);
    updateScales(width, height);
    var dataComb = d3.nest().key(function (d) {
      return d.filter;
    }).entries(data);
    var container = chart.select('.multiline-simulation-empleo-container-dos');
    var line = d3.line().x(function (d) {
      return scales.count.x(d.year);
    }).y(function (d) {
      return scales.count.y(d.simulacionpib);
    });
    container.selectAll('.line').data(dataComb);
    dataComb.forEach(function (d) {
      container.append('path').attr('class', 'line ' + d.key).style('stroke', '#DADADA').attr('d', line(d.values));
    });

    d3.selection.prototype.moveToFront = function () {
      return this.each(function () {
        this.parentNode.appendChild(this);
      });
    };

    d3.selection.prototype.moveToBack = function () {
      return this.each(function () {
        var firstChild = this.parentNode.firstChild;

        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };

    d3.select('.prevision').moveToFront();
    d3.select('.highlighted').data(dataComb).moveToFront().on('mouseover', function (d) {
      var formatValues = locale.format(',.0f');
      var positionleft = "".concat(d3.event.pageX);
      var positionTop = "".concat(d3.event.pageY);
      var tooltipWidth = d3.select('.tooltip-simulation').node().getBoundingClientRect().width;
      var tooltipHeight = d3.select('.tooltip-simulation').node().getBoundingClientRect().height;
      var positionTopTooltip = positionTop - tooltipHeight;
      var positionleftTooltip = positionleft - tooltipWidth / 2;
      var pibFormat = [];
      var percentageFormat = [];

      for (var i = 0; i < d.values.length; i++) {
        var element = d.values[i].simulacionpib;
        var valueToFixed = formatValues(element);
        pibFormat.push(valueToFixed);
      }

      for (var _i3 = 0; _i3 < d.values.length; _i3++) {
        var _element = d.values[_i3].simulacionpercentage;

        var _valueToFixed = Number(_element).toFixed(2);

        _valueToFixed = (_valueToFixed >= 0 ? '+' : '') + _valueToFixed;
        percentageFormat.push(_valueToFixed);
      }

      tooltipSimulation.style('opacity', 1).html("<div class=\"w-20 fl\">\n              <span class=\"f5 dib fw7 h2\"></span>\n              <span class=\"db\" style=\"height: 28px;\"></span>\n              <span class=\"f7 black50-txt bb tr greydark-50-bd db pv2 pr3\">2018</span>\n              <span class=\"f7 black50-txt bb tr greydark-50-bd db pv2 pr3\">2019</span>\n              <span class=\"f7 black50-txt bb tr greydark-50-bd db pv2 pr3\">2020</span>\n              <span class=\"f7 black50-txt bb tr greydark-50-bd db pv2 pr3\">2021</span>\n              <span class=\"f7 black50-txt bb tr greydark-50-bd db pv2 pr3\">2022</span>\n            </div>\n            <div class=\"w-40 fl relative\">\n              <span class=\"bd-dotted\"></span>\n              <span class=\"f5 dib vam rect-before h2\">Previsi\xF3n</span>\n              <div class=\"w-100 h2\">\n                <span class=\"f7 dib w-50 fl olivedark-txt fw7\">PIB</span>\n                <span class=\"f7 dib w-50 fl olivedark-txt fw7\">Crecimiento</span>\n              </div>\n              <div class=\"w-100 olive20-bgc fl\">\n                <span class=\"dib w-50 fl f7 black-text black-txt pv2 tc\">1.169.572</span>\n                <span class=\"dib w-50 fl f7 black-text black-txt pv2 tc\"></span>\n              </div>\n              <div class=\"w-100 olive20-bgc fl\">\n                <span class=\"dib w-50 fl f7 black-text bb bt greydark-50-bd black-txt pv2 tc\">1.195.302</span>\n                <span class=\"fw8 dib w-50 fl f7 black-text bb bt greydark-50-bd black-txt pv2 tc\">+2.2%</span>\n              </div>\n              <div class=\"w-100 olive20-bgc fl\">\n                <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">1.218.013</span>\n                <span class=\"fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">+1.9%</span>\n              </div>\n              <div class=\"w-100 olive20-bgc fl\">\n                <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">1.239.937</span>\n                <span class=\"fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">+1.8%</span>\n              </div>\n              <div class=\"w-100 olive20-bgc fl\">\n                <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">1.262.256</span>\n                <span class=\"fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">+1.8%</span>\n              </div>\n              <div class=\"w-100 fl\">\n                <span class=\"dib w-50 fl f7 black-text black50-txt pv2 tc\">Millones de \u20AC</span>\n              </div>\n            </div>\n            <div class=\"w-40 fl relative\">\n              <span class=\"f5 dib vam rect-before-fluor h2 pl3\">Simulacion</span>\n              <div class=\"w-100 h2\">\n                <span class=\"f7 dib w-50 fl olivedark-txt fw7 pl3\">PIB</span>\n                <span class=\"f7 dib w-50 fl olivedark-txt fw7\">Crecimiento</span>\n              </div>\n              <div class=\"w-100 turquoise20-bgc fl bb greydark-50-bd\">\n                <span class=\"dib w-50 fl f7 black-text black-txt pv2 tc\">1.169.572</span>\n              </div>\n              <div class=\"simulation-pib-data\">\n                <div class=\"simulation-pib-data-container w-100 turquoise20-bgc fl\">\n                  <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">".concat(pibFormat[0], "</span>\n                  <span class=\"simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(percentageFormat[0], "%\n                  </span>\n                </div>\n                <div class=\"simulation-pib-data-container w-100 turquoise20-bgc fl\">\n                  <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(pibFormat[1], "</span>\n                  <span class=\"simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(percentageFormat[1], "%\n                  </span>\n                </div>\n                <div class=\"simulation-pib-data-container w-100 turquoise20-bgc fl\">\n                  <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(pibFormat[2], "</span></span>\n                  <span class=\"simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(percentageFormat[2], "%\n                  </span>\n                </div>\n                <div class=\"simulation-pib-data-container w-100 turquoise20-bgc fl\">\n                  <span class=\"dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(pibFormat[3], "</span></span>\n                  <span class=\"simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc\">").concat(percentageFormat[3], "%\n                  </span>\n                </div>\n              </div>\n              <div class=\"w-100 fl\">\n                <span class=\"dib w-50 fl f7 black-text black50-txt pv2 tc\">Millones de \u20AC</span>\n              </div>\n            </div>")).style('left', "".concat(positionleftTooltip, "px")).style('top', "".concat(positionTopTooltip - 35, "px "));
    }).on('mouseout', function () {
      tooltipSimulation.style('opacity', 0);
    });
    drawAxes(g);
  };

  function radioUpdate() {
    d3.selectAll(".input-radio").on("change", function () {
      var arrayCheckedValues = [];
      var checkbox = document.getElementsByTagName('input');
      var checkboxChecked = 0;

      for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
          checkboxChecked++;
          var checkedValue = checkbox[i].id;
          arrayCheckedValues.push(checkedValue);
        }
      }

      if (checkboxChecked === 3 && simulationView === true) {
        var fileName = arrayCheckedValues.join('-');
        update(fileName, csv);
      }
    });
  }

  function update(filter, csv) {
    d3.csv("csv/".concat(csv, ".csv"), function (error, data) {
      if (error) {
        console.log(error);
      } else {
        dataz = data.filter(function (d) {
          return String(d.filter).match(filter);
        });
        d3.selectAll('.highlighted').attr('class', '');
        d3.selectAll(".".concat(filter)).attr('class', 'highlighted');
        updateChart(dataz);
      }
    });
  }

  var resize = function resize() {
    d3.csv("csv/".concat(csv, ".csv"), function (error, data) {
      if (error) {
        console.log(error);
      } else {
        updateChart(data);
      }
    });
  };

  var loadData = function loadData() {
    d3.csv("csv/".concat(csv, ".csv"), function (error, data) {
      if (error) {
        console.log(error);
      } else {
        d3.selectAll('.highlighted').attr('class', '');
        dataz = data;
        setupElements();
        setupScales();
        updateChart(dataz);
      }
    });
  };

  d3.select("#empleo-view").on("click", function () {
    d3.selectAll('.line').remove().exit();
    d3.selectAll('.tooltip-simulation').remove().exit();
    multipleLine(empleoCsv, scaleEmpleo[0], scaleEmpleo[1]);
  });
  d3.select("#pib-view").on("click", function () {
    d3.selectAll('.line').remove().exit();
    d3.selectAll('.tooltip-simulation').remove().exit();
    multipleLine(pibCsv, scalePib[0], scalePib[1]);
  });
  window.addEventListener('resize', resize);
  loadData();
  radioUpdate();
};

var empleoCsv = 'simulation-empleo-all';
var pibCsv = 'simulation-pib-all';
var scalePib = ['1155302', '1292256'];
var scaleEmpleo = ['20000', '22000'];