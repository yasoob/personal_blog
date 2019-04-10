function scrollView(){
  document.querySelector('#profile').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
  console.log(JSON.stringify(data, null, 2));
  $(".ipaddr").text(data.geoplugin_request);
  $(".location").text(data.geoplugin_city + ", "+ data.geoplugin_regionCode);
});


var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: .15em solid orange; animation: blink-caret .75s step-end infinite; }";
  document.body.appendChild(css);
};


var nodes = new vis.DataSet([
    {id: 1, label: 'Pakistan', title:"Birth Place"},
    {id: 2, label: 'UK', title:"2015"},
    {id: 3, label: 'USA', title:"2016"},
    {id: 4, label: 'Bahrain', title:"2015"},
    {id: 5, label: 'UAE', title:"2011"},
    {id: 6, label: 'Korea', title:"2012"},
    {id: 7, label: 'Canada', title:"2013"},
    {id: 8, label: 'Germany', title:"2014"},
    {id: 9, label: 'Mexico', title:"2019"},
    {id: 10, label: 'Saudi Arabia', title:"2011"}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 1, to: 4},
    {from: 1, to: 5},
    {from: 1, to: 6},
    {from: 1, to: 7},
    {from: 1, to: 8},
    {from: 1, to: 9},
    {from: 1, to: 10}
]);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);
