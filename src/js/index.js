document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('click', getName));
document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('change', checkValues));

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

const idPib = document.getElementById('pib-chart')
const idEmpleo = document.getElementById('empleo-chart')
const csvTest = "test-frp"
const legendText = ["Miles de M €", "Miles"]

const barChart = (id, csv, legend) => {
  const margin = { top: 16, right: 16, bottom: 16, left: 60 };
  const width = 370 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  const chart = d3.select(id);
  const svg = chart.select('svg');
  const durationTransition = 400;
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr('class', 'container-chart')

  svg.attr('width', "100%")
    .attr('height', 250);

  const x0 = d3.scaleBand()
    .rangeRound([10, width])
    .paddingInner(0.3);

  const x1 = d3.scaleBand()

  const y = d3.scaleLinear()
    .rangeRound([height, 0]);

  const z = d3.scaleOrdinal()
    .range(["#006D63", "#B8DF22"]);

  d3.csv(`csv/${csv}.csv`, function(d, i, columns) {
      for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
      return d;
    },

    function(error, data) {
      if (error) throw error;

      const locale = d3.formatDefaultLocale({
        decimal: ',',
        thousands: '.',
        grouping: [3]
      });

      const keys = data.columns.slice(1);
      x0.domain(data.map(({ type }) => type));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([d3.min(data, d => d3.min(keys, key => d[key])), d3.max(data, d => d3.max(keys, key => d[key]))]).nice();

      const axisX = g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .transition()
        .duration(durationTransition)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x0));

      const axisY = g.append("g")
        .attr("class", "axis axis-y")
        .transition()
        .duration(durationTransition)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y).tickFormat(locale.format('~s')).ticks(6).tickSizeInner(-width))

      const rects = g.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", ({ type }) => `translate(${x0(type)},0)`)
        .attr('class', 'grouped-bar-chart')
        .selectAll("rect")
        .data(d => keys.map(key => ({
          key,
          value: d[key]
        })))
        .enter()
        .append("rect")
        .attr("x", ({ key }) => x1(key))
        .attr("y", ({ value }) => y(value))
        .attr("width", x1.bandwidth())
        .attr('height', 0)
        .transition()
        .delay((d, i) => i * 10)
        .duration(durationTransition)
        .attr("x", ({ key }) => x1(key))
        .attr("y", ({ value }) => value > 0 ? y(value) : y(0))
        .attr("height", ({ value }) => value > 0 ? y(0) - y(value) : y(value) - y(0))
        .attr("width", x1.bandwidth())
        .attr("fill", ({ key }) => z(key));


      const legends = g.append('text')
        .attr('class', 'legend-top')
        .attr("x", -45)
        .attr("y", 0)
        .text(legend);

    });
};

barChart(idPib, csvTest, legendText[0]);
barChart(idEmpleo, csvTest, legendText[1]);

function checkValues() {
  let arrayCheckedValues = []

  const checkbox = document.getElementsByTagName('input');
  let checkboxChecked = 0;
  for (let i = 0; i < checkbox.length; i++) {

    if (checkbox[i].checked) {
      checkboxChecked++
      let checkedValue = checkbox[i].id;
      arrayCheckedValues.push(checkedValue)
    }

    if (checkboxChecked === 3) {
      const fileName = arrayCheckedValues.join('-');

      d3.selectAll('.container-chart')
        .remove()
        .exit()

      barChart(idPib, fileName, legendText[0]);
      barChart(idEmpleo, fileName, legendText[1]);

    }
  }
}


function getWidth() {

  const widthSimulation = document.getElementById("empleo-simulacion").offsetWidth
  const widthChart = document.getElementById("pib-chart").offsetWidth
  const sumWidth = widthSimulation + widthChart
  const containerInit = document.getElementsByClassName("container-init");

  for(let i=0; i < containerInit.length; i++){
      containerInit[i].style.width = `${sumWidth}px`;
   }
}

getWidth()
