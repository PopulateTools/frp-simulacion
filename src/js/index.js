//Listen radiobuttons and fire functions to get the names and radio buttons
document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('click', () => {
  getName();
  checkValues();
}));

//Get the name for every group of radio buttons
function getName() {
  const targetElement = event.target;
  const inputName = targetElement.getAttribute('name');
  getActive(inputName)
}

//Add active class to radio buttons
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

//Fire tooltips with different radio buttons
function tooltips(element, text) {
  new Tooltip(document.getElementById(element), {
    placement: "top",
    title: text
  });
}

//Text radio buttons
const tooltipInfo = [
  ['tooltip-pf', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '],
  ['tooltip-idc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. '],
  ['tooltip-vdc', 'La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ']
];

//When dom loaded launch tooltips
document.addEventListener('DOMContentLoaded', function() {
  for (const args of tooltipInfo) tooltips(...args);
});

//Some values from charts
const idPib = document.getElementById('pib-chart')
const idEmpleo = document.getElementById('empleo-chart')

const tablePib = '.simulation-pib-data'
const tableEmpleo = '.simulation-empleo-data'

const legendText = ["Miles de M €", "Miles"]

const firstUpdate = false

//Charts
const barChart = (id, csv, legend, tableClass) => {
  const margin = { top: 24, right: 16, bottom: 16, left: 40 };
  const width = 370 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  const chart = d3.select(id);
  const svg = chart.select('svg');
  const durationTransition = 400;
  let data;
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

      /* Generate a new dataset */
      let arrayDifNeta = []
      let arrayDifAcumulada = []
      let arrayDifNetaAcumula = []
      const years = ["2019", "2020", "2021", "2022"]

      for (let i = 0; i < data.length; i++) {
        const difNeta = data[i].simulacionpib - data[i].prevision
        arrayDifNeta.push(difNeta)
      }

      arrayDifAcumulada.push(arrayDifNeta[0])

      const difAcumuladaValue2020 = arrayDifNeta[0] + arrayDifNeta[1]
      arrayDifAcumulada.push(difAcumuladaValue2020)

      const difAcumuladaValue2021 = difAcumuladaValue2020 + arrayDifNeta[2]
      arrayDifAcumulada.push(difAcumuladaValue2021)


      const difAcumuladaValue2022 = difAcumuladaValue2021 + arrayDifNeta[3]
      arrayDifAcumulada.push(difAcumuladaValue2022)
      console.log("arrayDifAcumulada", arrayDifAcumulada);

      arrayDifNetaAcumula = arrayDifNeta.map((value, index) => [years[index],arrayDifNeta[index],arrayDifAcumulada[index]])

      const dataDifNetAcu = arrayDifNetaAcumula.map(key => ({
          year: key[0],
          neta: key[1],
          acumulada: key[2]
        }))

      let keys = d3.keys(dataDifNetAcu[0]);
      keys = keys.slice(1)

      console.log(dataDifNetAcu[3].acumulada)

      x0.domain(dataDifNetAcu.map(({ year }) => year));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      if(dataDifNetAcu[3].acumulada > 15000) {
        y.domain([d3.min(dataDifNetAcu, d => d3.min(keys, key => d[key] * 2)), d3.max(dataDifNetAcu, d => d3.max(keys, key => d[key] * 3.25))]).nice();
      } else {
        y.domain([d3.min(dataDifNetAcu, d => d3.min(keys, key => d[key] * 2)), d3.max(dataDifNetAcu, d => d3.max(keys, key => d[key] * 1.25))]).nice();
      }

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
        .call(d3.axisLeft(y).tickFormat(locale.format('~s')).ticks(5).tickSizeInner(-width))

      const rects = g.append("g")
        .attr('class', 'container-grouped')
        .selectAll("g")
        .data(dataDifNetAcu)
        .enter()
        .append("g")
        .attr("transform", ({ year }) => `translate(${x0(year)},0)`)
        .attr('class', 'grouped-bar-chart')
        .selectAll("rect")
        .data(d => keys.map(key => ({
          key,
          value: d[key]
        })))
        .enter()
        .append("rect")
        .attr("x", ({ key }) => x1(key))
        .attr("y", ({ value }) => y(0))
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

      const legends = g
        .append('text')
        .attr('class', 'legend-top')
        .attr("x", -35)
        .attr("y", -10)
        .text(legend);

      const keysSimulationPib = data.columns.slice(2, 3);
      const keysSimulationIncrease = data.columns.slice(3);

      const simulation = d3.selectAll(tableClass)
        .selectAll('div')
        .remove()
        .exit()
        .data(data)
        .enter()
        .append("div")
        .attr('class', 'simulation-pib-data-container w-100 turquoise20-bgc fl')

      simulation
        .selectAll("span")
        .data(d => keysSimulationPib.map(key => ({
          key,
          value: d[key]
        })))
        .enter()
        .append("span")
        .attr('class', 'dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc')
        .transition()
        .duration(durationTransition)
        .text(({ value }) => locale.format(',.0f')(value))

       simulation
        .selectAll(".simulation-percentage")
        .data(d => keysSimulationIncrease.map(key => ({
          key,
          value: d[key].toFixed(2)
        })))
        .enter()
        .append("span")
        .attr('class', 'simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc')
        .transition()
        .duration(durationTransition)
        .text(({ value }) => value >= 0 ? `+${value}` : value)


    });
};

//We need store values from radio buttons
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

      const containerInit = document.getElementsByClassName("container-init");

      for (let i = 0; i < containerInit.length; i++) {
        containerInit[i].style.width = 0;
        setTimeout(() => {
          containerInit[i].style.display = "none";
        }, 150)
      }

      d3.selectAll('.container-chart')
        .remove()
        .exit()

      const fileName = arrayCheckedValues.join('-');

      const fileNamePib = `pib/${fileName}`
      const fileNameEmpleo = `empleo/${fileName}`

      barChart(idPib, fileNamePib, legendText[0], tablePib);
      barChart(idEmpleo, fileNameEmpleo, legendText[1], tableEmpleo);

    }
  }
}

function getWidth() {
  const widthSimulation = document.getElementById("empleo-simulacion").offsetWidth
  const widthChart = document.getElementById("pib-chart").offsetWidth
  const sumWidth = widthSimulation + widthChart
  const containerInit = document.getElementsByClassName("container-init");

  for (let i = 0; i < containerInit.length; i++) {
    containerInit[i].style.width = `${sumWidth}px`;
  }
}

getWidth()
