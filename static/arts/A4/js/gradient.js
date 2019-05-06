$(document).ready(function() {   

  var currentTemp;
  var currentLight;
  var currentMoisture;

  var currentData = [111,44,55];

  var pubnubDemo = new PubNub({
                subscribe_key : 'sub-c-56550f92-66fc-11e9-a1d1-12440c6cd251'
            });

  pubnubDemo.addListener({
            message: function(message) {
                console.log(message);
                // console.log(message.message.time);
                // console.log(message.message.y);
                //data[0].values.push({time: message.message.time, y: message.message.y});
                currentTemp = message.message[0];
                currentLight = message.message[1];
                currentMoisture = message.message[2];

                currentData[0] = currentTemp;
                currentData[1] = currentLight;
                currentData[2] = currentMoisture;

                // // Light Data
                // if (message.message[1].y > 700){
                //   $('.sun').hide();
                //   $('.moon').show();
                //   $('.container').css('background', 'linear-gradient(to top, #283E51, #061323)');

                // } else {
                //   $('.sun').show();
                //   $('.moon').hide();
                //   $('.container').css('background', 'white');
                // }

                // // Moisture data
                // if (message.message[2].y > 900){
                //   $('.water-tip').text('Plant needs water');
                //   $('.cancel').css('opacity', '0');
                //   $('#animation').css('opacity', '0');
                //   $('.wilting').css('opacity', '1');
                // } else{
                //   $('.water-tip').text('Plant doesn\'t need water');
                //   $('.cancel').css('opacity', '1');
                //   $('.wilting').css('opacity', '0');
                //   $('#animation').css('opacity', '1');
                // }
            }
        })

        pubnubDemo.subscribe({
            channels: ['epoch-pubnub', 'temp-pubnub']
        });




  /* ==================== Graph ==================== */
  var graph = {
    cont  : document.getElementById("graph-container"),
    table   : document.getElementById("graph"),
    stats   : document.getElementById("stats").tBodies[0],
    fills : document.getElementsByClassName("fill"),
    targets : document.getElementsByClassName("target-line"),
    cells : {
      currentColor : document.getElementsByClassName("current"),
      prevColor  : [],
      nextColor  : [],
      distance   : [],
      increment  : [],
    },
    getCells : function() {
      for (var j = 1; j < 4; j++) {
        graph.cells.prevColor.push(graph.stats.rows[0].cells[j]);
        graph.cells.nextColor.push(graph.stats.rows[1].cells[j]);
        graph.cells.distance.push(graph.stats.rows[2].cells[j]);
        graph.cells.increment.push(graph.stats.rows[3].cells[j]);
      }
    },
    visible : function() {
      var container = document.getElementById("graph-container");
      if (container && container.style.display != "none") {
        return true;
      }
      return false;
    },
    updateStats : function() {
      if (graph.visible()) {
        for (var i = 0; i < 3; i++) {
          graph.cells.prevColor[i].innerHTML    = currentColor[i];
          graph.cells.currentColor[i].innerHTML = currentColor[i];
          graph.cells.nextColor[i].innerHTML    = targetColor[i];
          graph.cells.distance[i].innerHTML   = distance[i];
          graph.cells.increment[i].innerHTML    = increment[i];
        }
      }
    },
    updateTargetLines : function() {
      if (graph.visible()) {
        for (var i = 0; i < graph.targets.length; i++) {
          var percent = Math.floor(targetColor[i] / 255 * 100);
          graph.targets[i].style.height = percent + "px";
        }
      }
    },
    updateCurrentColor : function() {
      if (graph.visible()) {
        for (var i = 0; i < currentColor.length; i++) {
          graph.cells.currentColor[i].innerHTML = currentColor[i];
        }
      }
    },
    updateFills : function() {
      if (graph.visible()) {
        for (var i = 0; i < graph.fills.length; i++) {
          var percent = Math.floor(currentColor[i] / 255 * 100);
          graph.fills[i].style.height = percent + "px";
        }
      }
    },
  };
  graph.getCells();

  /* ==================== Required Functions ==================== */
  // This is required to get the initial background-color of an element.
  // The element might have it's bg-color already set before the transition.
  // Transition should continue/start from this color.
  // This will be used only once.
  function getElementBG(elm) {
    var bg  = getComputedStyle(elm).backgroundColor;
    bg  = bg.match(/\((.*)\)/)[1];
    bg  = bg.split(",");
    for (var i = 0; i < bg.length; i++) {
      bg[i] = parseInt(bg[i], 10);
    }
    if (bg.length > 3) { bg.pop(); }
    return bg;
  }

  // A function to generate random numbers.
  // Will be needed to generate random RGB value between 0-255.
  function random() {
    if (arguments.length > 2) {
      return 0;
    }
    switch (arguments.length) {
      case 0:
        return Math.random();
      case 1:
        return Math.round(Math.random() * arguments[0]);
      case 2:
        var min = arguments[0];
        var max = arguments[1];
        return Math.round(Math.random() * (max - min) + min);
    }
  }

  // Generates a random RGB value.
  function generateRGB(min, max) {
    var min   = min || 0;
    var max   = min || 255;
    var color = [];
    for (var i = 0; i < 3; i++) {
      var num = random(min, max);
      color.push(num);
    }
    return color;
  }

  // Calculates the distance between the RGB values.
  // We need to know the distance between two colors
  // so that we can calculate the increment values for R, G, and B.
  function calculateDistance(colorArray1, colorArray2) {
    var distance = [];
    for (var i = 0; i < colorArray1.length; i++) {
      distance.push(Math.abs(colorArray1[i] - colorArray2[i]));
    }
    return distance;
  }

  // Calculates the increment values for R, G, and B using distance, fps, and duration.
  // This calculation can be made in many different ways.
  function calculateIncrement(distanceArray, fps, duration) {
    var fps     = fps || 30;
    var duration  = duration || 1;
    var increment = [];
    for (var i = 0; i < distanceArray.length; i++) {
      var incr = Math.abs(Math.floor(distanceArray[i] / (fps * duration)));
      if (incr == 0) {
        incr = 1;
      }
      increment.push(incr);
    }
    return increment;
  }

  // Converts RGB array [32,64,128] to HEX string #204080
  // It's easier to apply HEX color than RGB color.
  function rgb2hex(colorArray) {
    var color = [];
    for (var i = 0; i < colorArray.length; i++) {
      var hex = colorArray[i].toString(16);
      if (hex.length < 2) { hex = "0" + hex; }
      color.push(hex);
    }
    return "#" + color.join("");
  }

  /* ==================== Setup ==================== */
  // Duration is not what it says. It's a multiplier in the calculateIncrement() function.
  // duration = 1-4, fast-to-slow
  var fps       = 30;
  var duration    = 3;
  var transElement  = document.body;
  var currentColor  = getElementBG(transElement);
  var transHandler  = null;

  startTransition();

  /* ==================== Transition Initiator ==================== */
  function startTransition() {
    clearInterval(transHandler);

    //targetColor = generateRGB();
    targetColor = currentData;
    console.log(currentData);
    distance  = calculateDistance(currentColor, targetColor);
    increment = calculateIncrement(distance, fps, duration);

    graph.updateTargetLines();
    graph.updateStats();

    transHandler = setInterval(function() {
      transition();
    }, 1000/fps);
  }

  /* ==================== Transition Calculator ==================== */
  function transition() {
    // checking R
    if (currentColor[0] > targetColor[0]) {
      currentColor[0] -= increment[0];
      if (currentColor[0] <= targetColor[0]) {
        increment[0] = 0;
      }
    } else {
      currentColor[0] += increment[0];
      if (currentColor[0] >= targetColor[0]) {
        increment[0] = 0;
      }
    }

    // checking G
    if (currentColor[1] > targetColor[1]) {
      currentColor[1] -= increment[1];
      if (currentColor[1] <= targetColor[1]) {
        increment[1] = 0;
      }
    } else {
      currentColor[1] += increment[1];
      if (currentColor[1] >= targetColor[1]) {
        increment[1] = 0;
      }
    }

    // checking B
    if (currentColor[2] > targetColor[2]) {
      currentColor[2] -= increment[2];
      if (currentColor[2] <= targetColor[2]) {
        increment[2] = 0;
      }
    } else {
      currentColor[2] += increment[2];
      if (currentColor[2] >= targetColor[2]) {
        increment[2] = 0;
      }
    }

    // applying the new modified color
    transElement.style.backgroundColor = rgb2hex(currentColor);

    graph.updateFills();
    graph.updateCurrentColor();

    // transition ended. start a new one
    if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
      startTransition();
    }
  }

  document.getElementById("playPause").onclick = function() {
    switch (this.value) {
      case "Pause":
        clearInterval(transHandler);
        this.value = "Play";
        break;
      case "Play":
        transHandler = setInterval(function() {
          transition();
        }, 1000/fps);
        this.value = "Pause";
        break;
    }
  };
});