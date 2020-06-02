function changeValue(elementName, newValue){
  document.getElementsByName(elementName)[0].value=newValue;
  window.location.hash = "#comment-form";
};

function nav_display() {
  var element = document.getElementById("nav");
  element.classList.toggle("hide-nav");
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.addEventListener('DOMContentLoaded', (event) => {
  //the event occurred
  hljs.initHighlightingOnLoad();
  var ModeToggler = document.getElementById('darkModeToggle');

  ModeToggler.addEventListener("click", function () {
    var date = new Date();
    var days = 10;
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var element = document.body;
    element.classList.toggle("darkmode");
    console.log(getCookie("darkmode") == "true");
    if (getCookie("darkmode") != "true") {
      document.getElementById("dark").rel="stylesheet";
      document.getElementById("light").rel="alternate stylesheet";
      console.log("setting darkmode");
      // Updating cookies will help prevent this from showing up again soon
      // http://www.quirksmode.org/js/cookies.html
      document.cookie =
      "darkmode=true; expires=" + date.toGMTString() + "; path=/";
    }
    else {
      document.getElementById("light").rel="stylesheet";
      document.getElementById("dark").rel="alternate stylesheet";
      document.cookie =
      "darkmode=false; expires=" + date.toGMTString() + "; path=/";
      console.log("removing darkmode");
    }
  });

  if (getCookie("darkmode") == "true") {
    var element = document.body;
    element.classList.toggle("darkmode");
    document.getElementById("dark").rel="stylesheet";
    document.getElementById("light").rel="alternate stylesheet";
  }
});
