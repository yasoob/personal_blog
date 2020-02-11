PImage img;
PGraphics helpBox;
int drawLength = 1550;
int iterationCount = 0;
float noiseScale = 5;
float strokeLength = 10;
int saveFrameCount = 1;

void setup() {
  size(1024, 1024);
  img = loadImage("test2.jpg");
  pixelDensity(2);
  //img = loadImage("http://twilio-test-sms.herokuapp.com/image", "jpg");
  //float img_ratio = (float)img.width/img.height;
  //img.resize(1120, 630);
  helpBox = createGraphics(600, 600);
}

void helpMsg() {
  helpBox.beginDraw();
  helpBox.clear();
  helpBox.noStroke();
  helpBox.fill(0, 80, 80, 10);
  helpBox.rect(10, 10, 250, 115);
  
  helpBox.fill(255);
  helpBox.rect(10, 10, 10.2, 115);

  
  helpBox.textSize(15);
  helpBox.text("Can you tell which portraits \n" +
       "are of real people and which \n"+
       "ones are fake? \n"+
       "                            ~ Yasoob", 
       32, 35);
  helpBox.endDraw();
}

void draw() {
  if (keyPressed) {
    if (key == 'n' || key == 'N') {
      println("B pressed");
      img = loadImage("http://twilio-test-sms.herokuapp.com/image", "jpg");
      background(0);
      iterationCount=0;
    }
    if (key == 's' || key == 'S'){
      saveFrame("output-"+millis()+".png");
    }
  } 

  if (iterationCount >= drawLength) {
    println("done");
    return;
  }

  float count = map(iterationCount, 0, drawLength, 2, 80);

  for (int i=0; i<count; i++) {
    int x = (int) random(img.width);
    int y = (int) random(img.height);

    int loc = x + y * img.width;

    float r = red(img.pixels[loc]);
    float g = green(img.pixels[loc]);
    float b = blue(img.pixels[loc]);
    float a = random(255);//alpha(img.pixels[loc]);

    stroke(color(r, g, b, a));

    float strokeThickness = map(iterationCount, 0, drawLength, 40, 0);
    strokeWeight(strokeThickness);

    push();

    translate(x, y);
    float n = noise(x*noiseScale, y*noiseScale);
    rotate(radians(map(n, 0, 1, -180, 180)));
    float lengthVariation = random(0.75, 1.25);
    line(0, 0, strokeLength, lengthVariation);

    //stroke(min(r * 3, 255), min(g * 3, 255), min(b * 3, 255), random(100));
    //strokeWeight(strokeThickness * 0.8);
    //line(0, -strokeThickness*0.15, strokeLength*lengthVariation, -strokeThickness*0.15);

    pop();

    //if (frameCount % 1550 == 0){
    //saveFrame("####.jpg");
    //saveFrameCount++;
    //}
  }
  //helpBox.clear();
  helpMsg();
  image(helpBox, 0, 0); 
  //noLoop();
  iterationCount++;
}
