"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function stack() {
  var margin = {
    top: 24,
    right: 8,
    bottom: 24,
    left: 40
  };
  var width = 0;
  var height = 0;
  var w = 0;
  var h = 0;
  var chart = d3.select('.bar-rate-natural-increase');
  var svg = chart.select('svg');
  var scales = {};
  var dataz;
  var tooltip = chart.append('div').attr('class', 'tooltip tooltip-negative').style('opacity', 0);

  function setupScales() {
    var countX = d3.scaleBand().domain(dataz.map(function (d) {
      return d.year;
    }));
    var countY = d3.scaleLinear().domain([d3.min(dataz, function (d) {
      if (d.saldo >= 0) {
        return 0;
      } else {
        return d.saldo * 1.5;
      }
    }), d3.max(dataz, function (d) {
      return d.saldo * 2;
    })]);
    scales.count = {
      x: countX,
      y: countY
    };
  }

  ;

  function setupElements() {
    var g = svg.select('.bar-rate-natural-increase-container');
    g.append('g').attr('class', 'axis axis-x');
    g.append('g').attr('class', 'axis axis-y');
    g.append('g').attr('class', 'bar-rate-natural-increase-container-bis');
  }

  ;

  function updateScales(width, height) {
    scales.count.x.rangeRound([0, width]).paddingInner(0.1);
    scales.count.y.range([height, 0]);
  }

  ;

  function drawAxes(g) {
    var axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format('d')).ticks(4);
    g.select('.axis-x').attr('transform', "translate(0,".concat(height, ")")).call(axisX);
    var axisY = d3.axisLeft(scales.count.y).tickFormat(d3.format('d')).ticks(5).tickSize(-width).tickPadding(8);
    g.select('.axis-y').transition().duration(500).call(axisY);
  }

  ;

  function updateChart(dataz) {
    w = chart.node().offsetWidth;
    h = 600;
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
    svg.attr('width', w).attr('height', h);
    var translate = "translate(".concat(margin.left, ",").concat(margin.top, ")");
    var g = svg.select('.bar-rate-natural-increase-container');
    g.attr('transform', translate);
    updateScales(width, height);
    var container = chart.select('.bar-rate-natural-increase-container-bis');
    var layer = container.selectAll('.bar-vertical').remove().exit().data(dataz);
    var newLayer = layer.enter().append('rect').attr('class', function (d) {
      if (d.saldo < 0) {
        return 'bar-vertical negative';
      } else {
        return 'bar-vertical positive';
      }
    });
    layer.merge(newLayer).on('mouseover', function (d) {
      tooltip.transition();
      tooltip.style('opacity', 1).html("\n                        <p class=\"tooltip-year\"><span class=\"tooltip-number\">".concat(d.year, "</span><p/>\n                        <p class=\"tooltip-born\">Nacidos: <span class=\"tooltip-number\">").concat(d.born, "</span><p/>\n                        <p class=\"tooltip-deceased\">Fallecidos: <span class=\"tooltip-number\">").concat(d.dead, "</span><p/>\n                        <p class=\"tooltip-deceased\">Saldo: <span class=\"tooltip-number\">").concat(d.saldo, "</span><p/>\n                        ")).style('left', w / 2 - 100 + 'px').style('top', 50 + 'px');
    }).on('mouseout', function (d) {
      tooltip.transition().duration(200).style('opacity', 0);
    }).attr('height', 0).attr('x', function (d) {
      return scales.count.x(d.year);
    }).attr('y', function (d) {
      return scales.count.y(0);
    }).transition().duration(600).ease(d3.easeLinear).attr('width', scales.count.x.bandwidth()).attr('x', function (d) {
      return scales.count.x(d.year);
    }).attr('y', function (d) {
      if (d.saldo > 0) {
        return scales.count.y(d.saldo);
      } else {
        return scales.count.y(0);
      }
    }).attr('height', function (d) {
      return Math.abs(scales.count.y(d.saldo) - scales.count.y(0));
    });
    drawAxes(g);
  }

  ;

  function resize() {
    updateChart(dataz);
  }

  ;

  function menuCities() {
    d3.csv('csv/saldo-vegetativo.csv', function (data) {
      var nest = Array.from(d3.group(data, function (d) {
        return d.province;
      }), function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return {
          key: key,
          value: value
        };
      });
      console.table(nest);
      var selectCity = d3.select('#select-cities');
      selectCity.selectAll('option').data(nest).enter().append('option').attr('value', function (d) {
        return d.key;
      }).text(function (d) {
        return d.key;
      });
      selectCity.on('change', function () {
        update();
      });
    });
  }

  ;

  function update() {
    d3.csv('csv/saldo-vegetativo.csv', function (error, data) {
      dataz = data;
      var city = d3.select('#select-cities').property('value');
      dataz = dataz.filter(function (d) {
        return String(d.province).match(city);
      });
      dataz.forEach(function (d) {
        d.year = +d.year;
        d.born = +d.born;
        d.dead = +d.dead;
        d.saldo = d.born - d.dead;
      });
      setupScales();
      updateChart(dataz);
    });
  }

  function loadData() {
    d3.csv('csv/saldo-vegetativo.csv', function (error, data) {
      if (error) {
        console.log(error);
      } else {
        var city = data[0].province;
        dataz = data.filter(function (d) {
          return String(d.province).match(city);
        });
        dataz.forEach(function (d) {
          d.year = +d.year;
          d.born = +d.born;
          d.dead = +d.dead;
          d.saldo = d.born - d.dead;
        });
        setupElements();
        setupScales();
        menuCities();
        updateChart(dataz);
      }
    });
  }

  ;
  window.addEventListener('resize', resize);
  loadData();
}

;
stack();
new SlimSelect({
  select: '#select-cities'
});