function changeValue(elementName, newValue){
  document.getElementsByName(elementName)[0].value=newValue;
  window.location.hash = "#comment-form";
};