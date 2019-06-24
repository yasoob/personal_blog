function changeValue(elementName, newValue){
  document.getElementsByName(elementName)[0].value=newValue;
  window.location.hash = "#comment-form";
};

function nav_display() {
  var element = document.getElementById("nav");
  element.classList.toggle("hide-nav");
}