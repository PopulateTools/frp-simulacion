document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('click', getName));

function getName() {
  const targetElement = event.target;
  const inputName = targetElement.getAttribute('name');
  getActive(inputName)
}

function getActive(name) {
  const inputs = document.querySelectorAll(`input[name='${name}']`);
  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i].parentNode
    if (inputs[i].checked === false) {
      element.classList.remove('active-checkbox')
    } else {
      element.classList.add('active-checkbox')
    }
  }
}

function tooltips(element, text) {
  new Tooltip(document.getElementById(element), {
    placement: "top",
    title: text
  });
}

const tooltipInfo = [
  ['tooltip-pf', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '],
  ['tooltip-idc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '],
  ['tooltip-vdc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ']
];

document.addEventListener('DOMContentLoaded', function() {
  for (const args of tooltipInfo) tooltips(...args);
});


const barChart = () => {
  const margin = { top: 16, right: 16, bottom: 16, left: 56 };
  const width = 300 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const chart = d3.select('#pib-chart');
  const svg = chart.select('svg');

  const g = d3.select("svg")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.2);

  const x1 = d3.scaleBand()
    .padding(0.1);

  const y = d3.scaleLinear()
    .rangeRound([height, 0]);

  const z = d3.scaleOrdinal()
    .range(["#006D63", "#B8DF22"]);


  d3.csv("csv/test-frp.csv", function(d, i, columns) {
      for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
      return d;
    },
    function(error, data) {
      if (error) throw error;
      var keys = data.columns.slice(1);
      x0.domain(data.map(({type}) => type));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([
               d3.min(data, d => d3.min(keys, key => d[key] * 14)),
               d3.max(data, d => d3.max(keys, key => d[key]))]).nice();

      g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", ({type}) => `translate(${x0(type)},0)`)
        .selectAll("rect")
        .data(d => keys.map(key => ({
          key,
          value: d[key]
        })))
        .enter().append("rect").attr("class", "rect")
        .attr("x", d => x1(d.key))
        .attr('y', (d) => {
            if (d.value > 0) {
                return y(d.value);
            } else {
                return y(0);
            }
        })
        .attr("width", x1.bandwidth())
        .attr('height', d => Math.abs(y(d.value) - y(0)))
        .attr("fill", d => z(d.key))

      g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height/2.5})`)
        .call(d3.axisBottom(x0))

      g.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y).ticks())
    });
};

barChart();
