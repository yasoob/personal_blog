---
title: ":herb: Greenhouse Part 2: Measuring Temperature & Light Intensity"
date: 2019-04-20T20:12:17-04:00
draft: false
categories: ["arduino", "electronics", "sensor"]
---

Hi lovely people! :wave: In the [last article]({{< ref "yl-69-soil-sensor-arduino.md" >}}) we talked about the soil moisture sensor. In this article, we will take a look at how to measure temperature using DS18b20 and measure light intensity using a photocell.

**Step 1: Wiring up the Circuit**

We will be using:

- Arduino UNO
- Breadboard
- DS18B20 Temperature Sensor
- Photocell (any typical one)
- 4.7KΩ resistor
- 10KΩ resistor
- Jumper Wires

Wire up the circuit like this:

[![Temp Light Sensor](/images/raspberry/green-house/temp-light-sensor_bb.png)](/images/raspberry/green-house/temp-light-sensor_bb.png)
**Note:** Click on the image to view a larger version

I have wired up the 4.7KΩ resistor in parallel with the positive terminal and the digital input wire coming out of DS18B20. The 10KΩ resistor is connected between the photocell and the 5V input.

The reading of the photocell increases with a decrease in brightness and decreases with an increase in brightness. It ranges from 0 to 1023. 

The DS18B20 temp sensor gives readings in degree Celsius by default. You can convert it into Fahrenheit if you want though.

**Step 2: Coding the Arduino**

You need to install the Dallas Temperature library and the One Wire library for this code to work. You can download them using the library manager in the Arduino IDE. 

```c
// Include the libraries
#include <DallasTemperature.h>
#include <OneWire.h> 

// This is where the temp sensor is plugged in. 
// Change this to the analog input where your temp
// sensor is plugged in (if different)
#define ONE_WIRE_BUS 2 
OneWire oneWire(ONE_WIRE_BUS); 

int photoPin = A1;

// Pass the oneWire ref to Dallas Temperature Sensor
DallasTemperature sensors(&oneWire);

void setup(){
    // Set the photocell sensor pin to INPUT mode
    pinMode(photoPin, INPUT);
    
    // Setup the temp sensor and serial comm
    sensors.begin(); 
    Serial.begin(9600);
}

void loop() {
    // Get photocell reading
    int photoValue = analogRead(photoPin);
    Serial.print("Photocell reading: ");
    Serial.print(photoValue);

    // Get temperature reading
    sensors.requestTemperatures(); 
    Serial.print(" - Temperature: "); 

    // We input 0 as index because we can have more than 
    // 1 IC attached to the same bus
    int tempVal = sensors.getTempCByIndex(0);
    Serial.println(tempVal);

    delay(1000);
}
```

The code is straightforward. We include the libraries we will be using. We define analog input 2 as `ONE_WIRE_BUS` and tell `DallasTemperature` that the sensor is attached on input 2. 

In `setup` we simply set pin modes and setup temperature sensor and serial communication.

In `loop`, we take readings from photocell and DS18B20 and send them over serial to the laptop. 

Now save the code and upload it to Arduino. Open the serial monitor and you should start seeing readings like this:

[![Temp Light Sensor Readings](/images/raspberry/green-house/temp-light-readings.png)](/images/raspberry/green-house/temp-light-readings.png)

If everything is working then perfect! If not, go through the wiring steps again. If it still doesn't make any sense go through the references I have linked below. 

I will see you in the next article where we wire up an LCD with all of this! :heart:


<hr>

- [DS18B20 Temperature Sensor tutorial on Random Nerd Tutorials](https://randomnerdtutorials.com/guide-for-ds18b20-temperature-sensor-with-arduino/)
- [Complete photocell tutorial on AdaFruit website](https://learn.adafruit.com/photocells/using-a-photocell)
