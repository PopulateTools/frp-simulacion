//Listen radiobuttons and fire functions to get the names and radio buttons
document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('click', () => {
  getName();
  checkValues();
}));

document.getElementById('button-view').addEventListener('click', () => {
  document.getElementById('initial-view').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('initial-view').style.display = 'none';
    document.getElementById('text-back').style.display = 'none';
    document.getElementById('simulation-view').style.display = 'block';
    document.getElementById('back-view').style.display = 'block';
    multipleLine(pibCsv);

    multipLeFired = true
  }, 300)
  document.getElementById('simulation-view').style.opacity = '1';
  document.getElementById('back-view').style.opacity = '1';
  document.getElementById('empleo-view').classList.remove('btn-view-active')
  document.getElementById('pib-view').classList.add('btn-view-active')

  /*const idInputs = ['pf-1', 'pf-2', 'pf-3', 'pf-4', 'idc-1', 'idc-2', 'idc-3', 'idc-4', 'vdc-1', 'vdc-2']

  for (let i = 0; i < idInputs.length; i++) {
    const element = document.getElementById(idInputs[i])
    element.checked = false
    const parent = element.parentNode
    parent.classList.remove('active-checkbox')
  }*/

  simulationView = true

});

document.getElementById('back-view').addEventListener("click", () => {
  document.getElementById('initial-view').style.opacity = '1';
  setTimeout(() => {
    document.getElementById('initial-view').style.display = 'block';
    document.getElementById('text-back').style.display = 'block';
    document.getElementById('simulation-view').style.display = 'none';
    document.getElementById('back-view').style.display = 'none';
  }, 300)
  document.getElementById('simulation-view').style.opacity = '0';
  document.getElementById('back-view').style.opacity = '0';

  document.querySelectorAll(".input-radio").checked = false;
  simulationView = false
});

document.getElementById('empleo-view').addEventListener("click", () => {
  document.getElementById('pib-view').classList.remove('btn-view-active')
  document.getElementById('empleo-view').classList.add('btn-view-active')

  valueFilter = 'empleo'
});

document.getElementById('pib-view').addEventListener("click", () => {
  document.getElementById('empleo-view').classList.remove('btn-view-active')
  document.getElementById('pib-view').classList.add('btn-view-active')

  valueFilter = 'pib'


});

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
  ['tooltip-pf', 'Elija el instrumento fiscal para estimular la economía'],
  ['tooltip-idc', 'Elija el instrumento fiscal que utilizaría el gobierno para ajustar la ratio de deuda sobre PIB a su nivel inicial.'],
  ['tooltip-vdc', 'Elija el tiempo que el gobierno tardará en activar el instrumento de consolidación: (1) Rápida (el gobierno empieza a subir impuestos o reducir gasto transcurrido un año desde el estímulo fiscal); (2) Lenta (el gobierno empieza a subir impuestos o reducir gasto transcurridos cuatro años desde el estímulo fiscal).'],
  ['tooltip-empleo-diferencia', 'La barra verde oscura representa la diferencia, año a año, entre el nivel de PIB/Empleo simulado con la política y el nivel de PIB/Empleo previsto en el Programa de Estabilidad. La barra verde clara representa la diferencia acumulada hasta un año entre el PIB/Empleo simulado con la política y el PIB/Empleo previsto en el Programa de Estabilidad.'],
  ['tooltip-pib-diferencia', 'La barra verde oscura representa la diferencia, año a año, entre el nivel del PIB o el Empleo simulado con la política y el nivel del PIB o el Empleo previsto en el Programa de Estabilidad. La barra verde clara representa la diferencia acumulada hasta un año concreto entre el PIB o el Empleo simulado con la política fiscal y el PIB o el Empleo previsto en el Programa de Estabilidad.'],
  ['tooltip-pib-ca', 'Tasa de crecimiento anual de la predicción de PIB o del Empleo a partir del Programa de Estabilidad.'],
  ['tooltip-pib-vrp', 'Variación relativa (en %) entre el PIB o el Empleo simulado con la política fiscal y el PIB o el Empleo previsto en el Programa de Estabilidad.'],
  ['tooltip-ee-ca', 'Tasa de crecimiento anual de la predicción de PIB o del Empleo a partir del Programa de Estabilidad.'],
  ['tooltip-ee-vrp', 'Variación relativa (en %) entre el PIB o el Empleo simulado con la política fiscal y el PIB o el Empleo previsto en el Programa de Estabilidad.']
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

let simulationView = false
let valueFilter = 'pib'
let multipLeFired = false

const locale = d3.formatDefaultLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3]
});

//Charts
const barChart = (id, csv, legend, tableClass, scaleMinY, scaleMaxY) => {
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

  const tooltipSimulationBarChart = chart
    .append('div')
    .attr('class', 'tooltip-simulation-bar-chart')
    .style('opacity', 0);

  const legends = svg
    .append('text')
    .attr('class', 'legend-top')
    .attr("x", 10)
    .attr("y", 20)
    .text(legend);

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
      .domain([scaleMinY, scaleMaxY])


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
    h = 230;

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


    chart.selectAll('.container-grouped')
      .data(dataDifNetAcu)
      .on('mouseover', function(d) {
          let legend = "Miles de M €"
          if(chart._groups[0][0].id === "empleo-chart") {
            legend = "Miles"
          }
          tooltipSimulationBarChart
            .style('opacity', 1)
            .html(`
                  <span class="tooltip-bar-chart-year"><strong>Año:</strong> ${d.year}</span>
                  <span class="tooltip-bar-chart-dif-neta"><strong class="rect-before">Diferencia neta:</strong> ${d.neta} ${legend}</span>
                  <span class="tooltip-bar-chart-dif-acumulada"><strong class="rect-before-fluor">Acumulada:</strong> ${d.acumulada} ${legend}</span>
            `)
            .style('left', `${margin.left * 2}px`)
            .style('top', `${margin.top}px`);

      })
      .on('mouseout', function() {

          tooltipSimulationBarChart
            .style('opacity', 0)
      })

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


    const fileNamePib = `pib/${fileName}`
    const fileNameEmpleo = `empleo/${fileName}`



    if (simulationView === false) {
      d3.selectAll('.legend-top')
        .remove()
        .exit()

      const scalePib = [-30000, 30000]
      const scaleEmpleo = [-600, 600]
      barChart(idPib, fileNamePib, legendText[0], tablePib, scalePib[0], scalePib[1])
      barChart(idEmpleo, fileNameEmpleo, legendText[1], tableEmpleo, scaleEmpleo[0], scaleEmpleo[1])
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

const multipleLine = (csv) => {
  const margin = { top: 24, right: 24, bottom: 40, left: 64 };
  let width = 0;
  let height = 0;
  const chart = d3.select('#multiline-simulation-empleo');
  const svg = chart.select('svg');
  const scales = {};
  let dataz;
  const tooltipSimulation = chart
    .append('div')
    .attr('class', 'tooltip-simulation')
    .style('opacity', 0);

  if(multipLeFired === false) {
    const legends = svg
      .append('text')
      .attr('class', 'legend-top')
      .attr("x", 0)
      .attr("y", 20)
      .text('Miles de M €');
  }

  const setupScales = () => {
    const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.year));

    const countY = d3
        .scaleLinear()
        .domain([
            d3.min(dataz, (d) => d.simulacionpib),
            d3.max(dataz, (d) => d.simulacionpib)
        ]).nice();

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
    const axisX = d3
    .axisBottom(scales.count.x)
    .tickFormat(d3.format('d'))
    .tickPadding(15);

    g.select('.axis-x')
      .attr('transform', `translate(0,${height})`)
      .transition()
      .duration(300)
      .call(axisX);

    const axisY = d3
      .axisLeft(scales.count.y)
      .tickFormat(locale.format(',.0f'))
      .ticks(5)
      .tickSizeInner(-width);

    g.select('.axis-y')
      .transition()
      .duration(300)
      .call(axisY);
  };

  const updateChart = (data) => {

    const radio1 = document.getElementById("radio-buttons-first")
    const radio2 = document.getElementById("radio-buttons-second")
    const radio3 = document.getElementById("radio-buttons-third").offsetHeight

    function getAbsoluteHeight(el) {
      el = (typeof el === 'string') ? document.querySelector(el) : el;

      var styles = window.getComputedStyle(el);
      var margin = parseFloat(styles['marginTop']) +
                   parseFloat(styles['marginBottom']);

      return el.offsetHeight + margin;
    }

    const w = chart.node().offsetWidth;
    const h = getAbsoluteHeight(radio1) + getAbsoluteHeight(radio2) + radio3

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

    dataComb.forEach((d) => {
      container
        .append('path')
        .attr('class', 'line ' + d.key)
        .attr('id', d.key)
        .style('stroke', '#DADADA')
        .attr('d', line(d.values));
    });

    d3.selectAll('.line')
      .data(dataComb)
      .on('mouseover', function(d) {
          d3.select(this)
            .attr('class', 'highlighted')

          const element = d3.select(this).attr("id")
          const elementSplit = element.split('-');

          const firstOption = elementSplit[0] + '-' + elementSplit[1]
          const secondOption = elementSplit[2] + '-' + elementSplit[3]
          const thirdOption = elementSplit[4] + '-' + elementSplit[5]

          const firstRadio = document.getElementById(firstOption).parentNode
          const secondRadio = document.getElementById(secondOption).parentNode
          const thirdRadio = document.getElementById(thirdOption).parentNode

          document.getElementById(firstOption).checked = true;
          document.getElementById(secondOption).checked = true;
          document.getElementById(thirdOption).checked = true;

          firstRadio.classList.add('active-checkbox')
          secondRadio.classList.add('active-checkbox')
          thirdRadio.classList.add('active-checkbox')

          const formatValues = locale.format(',.0f')
          const width = chart.node().offsetWidth;
          const positionleft = `${d3.event.pageX}`;
          const positionTop = `${d3.event.pageY}`;
          const tooltipWidth = d3.select('.tooltip-simulation').node().getBoundingClientRect().width;
          const tooltipHeight = d3.select('.tooltip-simulation').node().getBoundingClientRect().height;
          const positionTopTooltip = positionTop - tooltipHeight
          const positionleftTooltip = positionleft - (tooltipWidth / 2)
          const positionright = width - (tooltipWidth / 8)

          let pibFormat = []
          let percentageFormat = []

          for (let i = 0; i < d.values.length; i++) {
           const element = d.values[i].simulacionpib
           const valueToFixed = formatValues(element)
           pibFormat.push(valueToFixed)
          }

          for (let i = 0; i < d.values.length; i++) {
           const element = d.values[i].simulacionpercentage
           let valueToFixed = Number(element).toFixed(2)
           valueToFixed = (valueToFixed >= 0 ? '+' : '' ) + valueToFixed

           percentageFormat.push(valueToFixed)
          }

          tooltipSimulation
            .style('opacity', 1)
            .html(
              `<div class="w-20 fl">
                <span class="f5 dib fw7 h2"></span>
                <span class="db" style="height: 28px;"></span>
                <span class="f7 black50-txt bb tr greydark-50-bd db pv2 pr3">2018</span>
                <span class="f7 black50-txt bb tr greydark-50-bd db pv2 pr3">2019</span>
                <span class="f7 black50-txt bb tr greydark-50-bd db pv2 pr3">2020</span>
                <span class="f7 black50-txt bb tr greydark-50-bd db pv2 pr3">2021</span>
                <span class="f7 black50-txt bb tr greydark-50-bd db pv2 pr3">2022</span>
              </div>
              <div class="w-40 fl relative">
                <span class="bd-dotted"></span>
                <span class="f5 dib vam rect-before h2">Previsión</span>
                <div class="w-100 h2">
                  <span class="f7 dib w-50 fl olivedark-txt fw7">PIB</span>
                  <span class="f7 dib w-50 fl olivedark-txt fw7">Crecimiento</span>
                </div>
                <div class="w-100 olive20-bgc fl">
                  <span class="dib w-50 fl f7 black-text black-txt pv2 tc">1.169.572</span>
                  <span class="dib w-50 fl f7 black-text black-txt pv2 tc"></span>
                </div>
                <div class="w-100 olive20-bgc fl">
                  <span class="dib w-50 fl f7 black-text bb bt greydark-50-bd black-txt pv2 tc">1.195.302</span>
                  <span class="fw8 dib w-50 fl f7 black-text bb bt greydark-50-bd black-txt pv2 tc">+2.2%</span>
                </div>
                <div class="w-100 olive20-bgc fl">
                  <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">1.218.013</span>
                  <span class="fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">+1.9%</span>
                </div>
                <div class="w-100 olive20-bgc fl">
                  <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">1.239.937</span>
                  <span class="fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">+1.8%</span>
                </div>
                <div class="w-100 olive20-bgc fl">
                  <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">1.262.256</span>
                  <span class="fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">+1.8%</span>
                </div>
                <div class="w-100 fl">
                  <span class="dib w-50 fl f7 black-text black50-txt pv2 tc">Millones de €</span>
                </div>
              </div>
              <div class="w-40 fl relative">
                <span class="f5 dib vam rect-before-fluor h2 pl3">Simulacion</span>
                <div class="w-100 h2">
                  <span class="f7 dib w-50 fl olivedark-txt fw7 pl3">PIB</span>
                  <span class="f7 dib w-50 fl olivedark-txt fw7">Crecimiento</span>
                </div>
                <div class="w-100 turquoise20-bgc fl bb greydark-50-bd">
                  <span class="dib w-50 fl f7 black-text black-txt pv2 tc">1.169.572</span>
                </div>
                <div class="simulation-pib-data">
                  <div class="simulation-pib-data-container w-100 turquoise20-bgc fl">
                    <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${pibFormat[0]}</span>
                    <span class="simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${percentageFormat[0]}%
                    </span>
                  </div>
                  <div class="simulation-pib-data-container w-100 turquoise20-bgc fl">
                    <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${pibFormat[1]}</span>
                    <span class="simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${percentageFormat[1]}%
                    </span>
                  </div>
                  <div class="simulation-pib-data-container w-100 turquoise20-bgc fl">
                    <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${pibFormat[2]}</span></span>
                    <span class="simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${percentageFormat[2]}%
                    </span>
                  </div>
                  <div class="simulation-pib-data-container w-100 turquoise20-bgc fl">
                    <span class="dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${pibFormat[3]}</span></span>
                    <span class="simulation-percentage fw8 dib w-50 fl f7 black-text bb greydark-50-bd black-txt pv2 tc">${percentageFormat[3]}%
                    </span>
                  </div>
                </div>
                <div class="w-100 fl">
                  <span class="dib w-50 fl f7 black-text black50-txt pv2 tc">Millones de €</span>
                </div>
              </div>`
            )
            .style('left', positionleftTooltip > width ? `${positionright}px` : `${positionleftTooltip}px`)
            .style('top', `${positionTopTooltip - 35}px `);
      })
      .on('mouseout', function() {
          d3.select(this)
            .attr('class', 'line')
            .moveToFront()

          d3.select('.prevision')
            .moveToFront()

          d3.selectAll('.active-checkbox')
            .attr('class', 'container-radio w-100 pa2 v-mid')

          const element = d3.select(this).attr("id")
          const elementSplit = element.split('-');

          const firstOption = elementSplit[0] + '-' + elementSplit[1]
          const secondOption = elementSplit[2] + '-' + elementSplit[3]
          const thirdOption = elementSplit[4] + '-' + elementSplit[5]

          document.getElementById(firstOption).checked = false;
          document.getElementById(secondOption).checked = false;
          document.getElementById(thirdOption).checked = false;

          tooltipSimulation
            .style('opacity', 0)
      })

    d3.selection.prototype.moveToFront = function() {
      return this.each(function() {
        this.parentNode.appendChild(this);
      });
    };

    d3.selection.prototype.moveToBack = function() {
      return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };

    d3.select('.prevision')
      .moveToFront()

    drawAxes(g);

  };

  function radioUpdate() {

    d3.selectAll(".input-radio").on("change", function() {
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

      if (checkboxChecked === 3 && simulationView === true) {
        const fileName = arrayCheckedValues.join('-');
        update(fileName)
      }
    });
  }

  function update(filter) {
    d3.csv('csv/simulation-pib-all.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        dataz = data.filter((d) => String(d.type).match(valueFilter));

        d3.selectAll('.highlighted')
          .attr('class', '')


        d3.selectAll(`.${filter}`)
          .attr('class', 'highlighted')

        updateChart(dataz);
      }
    });
  }

  const resize = () => {
    d3.csv('csv/simulation-pib-all.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {
         data = data.filter((d) => String(d.type).match(valueFilter));
        const countX = d3.scaleTime().domain(d3.extent(data, (d) => d.year));

        const countY = d3
            .scaleLinear()
            .domain([
                d3.min(data, (d) => d.simulacionpib),
                d3.max(data, (d) => d.simulacionpib)
            ]).nice();

        scales.count = { x: countX, y: countY };
         updateChart(data);
      }
    });
  };

  const loadData = () => {
    d3.csv('csv/simulation-pib-all.csv', (error, data) => {
      if (error) {
        console.log(error);
      } else {

        data = data.filter((d) => String(d.type).match('pib'));

        d3.selectAll('.highlighted')
          .attr('class', '')
        dataz = data

        setupElements();
        setupScales();
        updateChart(dataz);
      }
    });
  };

  d3.select("#empleo-view")
    .on("click", function() {
      d3.csv('csv/simulation-pib-all.csv', (error, data) => {
        if (error) {
          console.log(error);
        } else {
          data = data.filter((d) => String(d.type).match('empleo'));


         const countX = d3.scaleTime().domain(d3.extent(data, (d) => d.year));

         const countY = d3
             .scaleLinear()
             .domain([
                 d3.min(data, (d) => d.simulacionpib),
                 d3.max(data, (d) => d.simulacionpib)
             ]).nice();

         scales.count = { x: countX, y: countY };

         d3.select('.legend-top')
          .remove()

          const legends = svg
            .append('text')
            .attr('class', 'legend-top')
            .attr("x", 0)
            .attr("y", 20)
            .text('Miles');

          updateChart(data);

        }
      });
    });

  d3.select("#pib-view")
    .on("click", function() {

      d3.csv('csv/simulation-pib-all.csv', (error, data) => {
        if (error) {
          console.log(error);
        } else {

          data = data.filter((d) => String(d.type).match('pib'));

          const countX = d3.scaleTime().domain(d3.extent(data, (d) => d.year));

          const countY = d3
              .scaleLinear()
              .domain([
                  d3.min(data, (d) => d.simulacionpib),
                  d3.max(data, (d) => d.simulacionpib)
              ]).nice();

          scales.count = { x: countX, y: countY };

          d3.select('.legend-top')
           .remove()

           const legends = svg
             .append('text')
             .attr('class', 'legend-top')
             .attr("x", 0)
             .attr("y", 20)
              .text('Miles de M €')

          updateChart(data);
        }
      });
    });

  window.addEventListener('resize', resize);

  loadData();
  radioUpdate()
};

const pibCsv = 'simulation-pib-all'

checkValues()
