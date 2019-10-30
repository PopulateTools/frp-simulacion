
document.querySelectorAll(".input-radio").forEach(input => input.addEventListener('click', getName));

function getName() {
  const targetElement = event.target;
  const inputName = targetElement.getAttribute('name');
  getActive(inputName)
}

function getActive(name){
 const inputs = document.querySelectorAll(`input[name='${name}']`);
  for(let i = 0; i < inputs.length; i++) {
      const element = inputs[i].parentNode
      if(inputs[i].checked === false) {
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


document.addEventListener('DOMContentLoaded', function(){
    for (const args of tooltipInfo) tooltips(...args);
});

