const stat = document.getElementById("dogstat");
console.log(stat.getAttribute("name"));
if (stat.getAttribute("name") == "On farm") {
  stat.classList.add("on-farm");
} else if (stat.getAttribute("name") == "Sold") {
  stat.classList.add("sold");
} else if (stat.getAttribute("name") == "Deceased") {
  stat.classList.add("deceased");
}
