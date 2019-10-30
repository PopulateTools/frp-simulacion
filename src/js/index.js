
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



document.addEventListener('DOMContentLoaded', function(){

    new Tooltip(document.getElementById("tooltip-pf"), {
        placement: "top",
        title: "La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ",
    });
    new Tooltip(document.getElementById("tooltip-idc"), {
        placement: "top",
        title: "La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ",
    });
    new Tooltip(document.getElementById("tooltip-vdc"), {
        placement: "top",
        title: "La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. La velocidad de consolidación es la velocidad en la que wadus wadus wadus. ",
    });

});

