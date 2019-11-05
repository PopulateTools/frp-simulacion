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

let firstUpdate = false

//Charts
const barChart = (id, csv, legend, tableClass) => {
  const margin = { top: 32, right: 16, bottom: 16, left: 56 };
  const chart = d3.select(id);
  const svg = chart.select('svg');
  let width = 0;
  let height = 0;
  let w = 0;
  let h = 270;
  const durationTransition = 400;
  let dataz;
  let dataDifNetAcu;
  const scales = {};
  const z = d3.scaleOrdinal()
    .range(["#006D63", "#B8DF22"]);

  const legends = svg
    .append('text')
    .attr('class', 'legend-top')
    .attr("x", 10)
    .attr("y", 20)
    .text(legend);

  const locale = d3.formatDefaultLocale({
    decimal: ',',
    thousands: '.',
    grouping: [3]
  });

  const setupScales = () => {

    const dataDifNetAcu = dataz.map(key => ({
      year: key[0],
      neta: key[1],
      acumulada: key[2]
    }))

    let keys = d3.keys(dataDifNetAcu[0]);
    keys = keys.slice(1)

    const countX = d3.scaleBand()
      .rangeRound([10, width])
      .domain(dataDifNetAcu.map(({ year }) => year))
      .paddingInner(0.3);

    const countX1 = d3.scaleBand()
      .domain(keys);

    const countY = d3.scaleLinear()
      .domain([d3.min(dataDifNetAcu, d => {
        if (d3.min(keys, key => d[key]) > 0) {
          return 0
        } else {
          return d3.min(keys, key => d[key])
        }
      }), d3.max(dataDifNetAcu, d => {
        if (d3.max(keys, key => d[key]) < 0) {
          return 0
        } else {
          return d3.max(keys, key => d[key])
        }
      })]).nice()


    scales.count = { x0: countX, x1: countX1, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.bar-grouped-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'bar-grouped-container-bis');

  };

  const updateScales = (width, height) => {
    scales.count.x0.rangeRound([10, width]);
    scales.count.x1.rangeRound([0, scales.count.x0.bandwidth()]);
    scales.count.y.range([height - margin.top, margin.bottom]);
  };

  const drawAxes = (g) => {

    const axisX = d3
      .axisBottom(scales.count.x0)

    g.select('.axis-x')
      .transition()
      .delay((d, i) => i * 10)
      .duration(durationTransition)
      .ease(d3.easeLinear)
      .attr('transform', `translate(0,${height - margin.top})`)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat(d3.format('d'))
      .tickPadding(10)
      .ticks(5)
      .tickSizeInner(-width);

    g.select('.axis-y')
      .transition()
      .delay((d, i) => i * 10)
      .duration(durationTransition)
      .ease(d3.easeLinear)
      .call(axisY);
  };

  const updateChart = (dataz) => {
    w = chart.node().offsetWidth;
    h = 260;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.bar-grouped-container');

    g.attr('transform', translate);

    updateScales(width, height);

    const container = chart.select('.bar-grouped-container-bis');

    const dataDifNetAcu = dataz.map(key => ({
      year: key[0],
      neta: key[1],
      acumulada: key[2]
    }))

    let keys = d3.keys(dataDifNetAcu[0]);
    keys = keys.slice(1)

    const layer = container
      .selectAll('.container-grouped')
      .data(dataDifNetAcu)

    layer.exit().remove()

    layer.enter()
      .append('g')
      .attr('class', 'container-grouped')
      .attr("transform", ({ year }) => `translate(${scales.count.x0(year)},0)`)


    const rects = container
      .selectAll('.container-grouped')
      .selectAll("rect")
      .data(d => keys.map(key => ({
        key,
        value: d[key]
      })))

    rects
      .enter()
      .append('rect')
      .attr("width", scales.count.x1.bandwidth())
      .attr("x", ({ key }) => scales.count.x1(key))
      .attr("fill", ({ key }) => z(key))
      .attr("y", 0)
      .transition()
      .duration(durationTransition)
      .attr("y", ({ value }) => value > 0 ? scales.count.y(value) : scales.count.y(0))
      .attr("height", ({ value }) => Math.abs(scales.count.y(value) - scales.count.y(0)))

    rects.transition()
      .duration(durationTransition)
      .attr("y", ({ value }) => value > 0 ? scales.count.y(value) : scales.count.y(0))
      .attr("height", ({ value }) => Math.abs(scales.count.y(value) - scales.count.y(0)))

    rects.exit().remove()


    drawAxes(g);

  };

  const resize = () => {
    d3.csv(`csv/${csv}.csv`, type, (error, data) => {
      if (error) {

      } else {
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

        arrayDifNetaAcumula = arrayDifNeta.map((value, index) => [years[index], arrayDifNeta[index], arrayDifAcumulada[index]])

        dataz = arrayDifNetaAcumula
        setupScales();
        updateChart(dataz);
      }
    });
  };

  const loadData = () => {
    d3.csv(`csv/${csv}.csv`, type, (error, data) => {
      if (error) {

      } else {
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
          .text(({ value }) => value >= 0 ? `+${value}%` : `${value}%`)

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

        arrayDifNetaAcumula = arrayDifNeta.map((value, index) => [years[index], arrayDifNeta[index], arrayDifAcumulada[index]])

        dataz = arrayDifNetaAcumula

        setupElements();
        setupScales();
        updateChart(dataz);
      }
    });
  };

  function type(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
  }

  window.addEventListener('resize', resize);

  loadData();
}

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

  }

  if (checkboxChecked === 3) {

    const containerInit = document.getElementsByClassName("container-init");

    for (let i = 0; i < containerInit.length; i++) {
      containerInit[i].style.width = 0;
      setTimeout(() => {
        containerInit[i].style.display = "none";
      }, 150)
    }

    const fileName = arrayCheckedValues.join('-');

    d3.selectAll('.legend-top')
      .remove()
      .exit()

    const fileNamePib = `pib/${fileName}`
    const fileNameEmpleo = `empleo/${fileName}`

    barChart(idPib, fileNamePib, legendText[0], tablePib);
    barChart(idEmpleo, fileNameEmpleo, legendText[1], tableEmpleo);


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


const multipleLine = () => {
  const margin = { top: 24, right: 24, bottom: 32, left: 48 };
  let width = 0;
  let height = 0;
  const chart = d3.select('#multiline-simulation-empleo');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;
  const tooltipSimulation = chart
    .append('div')
    .attr('class', 'tooltip tooltip-simulation')
    .style('opacity', 0);

  const setupScales = () => {
    const countX = d3.scaleTime()
      .domain([
        2019,
        2022
      ]);

    const countY = d3.scaleLinear()
      .domain([
        19000,
        22000
      ]);

    scales.count = { x: countX, y: countY };
  };

  const setupElements = () => {
    const g = svg.select('.multiline-simulation-empleo-container');

    g.append('g').attr('class', 'axis axis-x');

    g.append('g').attr('class', 'axis axis-y');

    g.append('g').attr('class', 'multiline-simulation-empleo-container-dos');
  };

  const updateScales = (width, height) => {
    scales.count.x.range([0, width]);
    scales.count.y.range([height, 0]);
  };

  const drawAxes = (g) => {
    const axisX = d3.axisBottom(scales.count.x).tickFormat(d3.format('d'));

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat(d3.format('d'))
      .ticks(5)
      .tickSizeInner(-width);

    g.select('.axis-y').call(axisY);
  };

  const updateChart = (data) => {
    const w = chart.node().offsetWidth;
    const h = 600;

    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

    svg.attr('width', w).attr('height', h);

    const translate = `translate(${margin.left},${margin.top})`;

    const g = svg.select('.multiline-simulation-empleo-container');

    g.attr('transform', translate);

    updateScales(width, height);

    const dataComb = d3
      .nest()
      .key((d) => d.filter)
      .entries(data);
    console.log("dataComb", dataComb);

    const container = chart.select('.multiline-simulation-empleo-container-dos');

    const line = d3
      .line()
      .x((d) => scales.count.x(d.year))
      .y((d) => scales.count.y(d.simulacionpib));

    container
      .selectAll('.line')
      .remove()
      .exit()
      .data(dataComb);
    console.log("dataComb", dataComb);

    dataComb.forEach((d) => {
      container
        .append('path')
        .on('mouseover', (d) => {
          const positionX = scales.count.x(d.key);
          const postionWidthTooltip = positionX + 270;
          const tooltipWidth = 210;
          const positionleft = `${d3.event.pageX}px`;
          const positionright = `${d3.event.pageX - tooltipWidth}px`;
          tooltipSimulation.transition();
          tooltipSimulation.attr('class', 'tooltip tooltip-scatter tooltip-min');
          tooltipSimulation
            .style('opacity', 1)
            .html(
              `<p class="tooltip-scatter-text">La temperatura mínima de ${d.values} en ${d.key} <p/>`
            )
            .style(
              'left',
              postionWidthTooltip > w ? positionright : positionleft
            )
            .style('top', `${d3.event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltipSimulation
            .transition()
            .duration(200)
            .style('opacity', 0);
        })
        .attr('class', 'line ' + d.key)
        .style('stroke', '#DADADA')
        .attr('d', line(d.values));
    });

    drawAxes(g);
  };

  const resize = () => {
    d3.csv('csv/simulation-empleo-all.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        updateChart(data);
      }
    });
  };

  const loadData = () => {
    d3.csv('csv/simulation-empleo-all.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {

        setupElements();
        setupScales();
        updateChart(data);
      }
    });
  };

  window.addEventListener('resize', resize);

  loadData();
};

multipleLine();
