const status = document.getElementById("status");
console.log(status);
const div = document.getElementById("container");

status.addEventListener("change", function () {
  const one = status.value;

  if (one == "Deceased") {
    let label = document.createElement("label");
    label.htmlFor = "yearOfDeath";
    label.classList = "form-label";
    label.textContent = "Year of death:";
    div.appendChild(label);
    let input = document.createElement("input");
    input.type = "number";
    input.name = "dog[yearOfDeath]";
    input.id = "yearOfDeath";
    input.classList = "form-control mb-3 editorial-div";
    input.min = "1500";
    input.max = "9999";
    div.appendChild(input);
    console.log(input);
  } else {
    while (div.hasChildNodes()) {
      div.removeChild(div.lastChild);
    }
  }
});
