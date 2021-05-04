var Width = innerWidth - 1;
var Height = innerHeight;

var Grass;

var gameState = "start";
var howToPlay = "no";


var bullet;
var enemy1, enemy2, enemy3, enemy4;

var buttons;
var enemy1PowerBar, enemy2PowerBar, enemy3PowerBar, enemy4PowerBar, soilderPowerBar;

var badge1, badge2, badge3, badge4;

var bulletSound, enemySound, loserSound;

var winner;

function preload(){
  Grass = loadImage("Image/Grass.jpg");

  bulletSound = loadSound("Sound/0437.mp3");
  enemySound = loadSound("Sound/2109.mp3");
  loserSound = loadSound("Sound/0433.mp3");
}

function setup() {
  createCanvas(Width, Height);

    buttons = new SpawnButton();

    enemy1PowerBar = new EnemyPower(Width - 110, 20, 100, 25, 100, 1);
    enemy2PowerBar = new EnemyPower(Width - 110, 20 + 25 + 25/2, 100, 25, 100, 1);
    enemy3PowerBar = new EnemyPower(Width - 110, 20 + 25 + 25 + 25/2 + 25/2, 100, 25, 100, 1);
    enemy4PowerBar = new EnemyPower(Width - 110 - 25 - 25/2, 20, 25, 100, 100, 0);

    soilderPowerBar = new SoilderPower(100, Height - 20 - 25, 200, 25, 200, 1);

    soilder = new Soilder(100, -100);
    treatment = new Treatment(0, -100);

    bullet = new Bullet(soilder.x, soilder.y);

    enemy1 = new Enemy(75, 100);
    enemy2 = new Enemy(75, 100);
    enemy3 = new Enemy(75, 100);
    enemy4 = new Enemy(150, 200);

    badge1 = new Badges(500);
    badge2 = new Badges(1000);
    badge3 = new Badges(1500);
    badge4 = new Badges(2000);
    }

function draw() {
  
  background(Grass);
  
  for(var a = 0; a <= Height; a = a + 30){ 
    line(-200 + Width/2, a, -200 + Width/2, a + 10);
  }

  enemy1PowerBar.display(enemy1);
  enemy2PowerBar.display(enemy2);
  enemy3PowerBar.display(enemy3);
  enemy4PowerBar.display(enemy4);
  soilderPowerBar.display(soilder);

  if(howToPlay === "show"){
    background(255);

    HowDoIPlay();
  }

  if(soilder.Status === "spawnSoilder"){
    soilder.spawnSoilder();  
  }
  
  if(treatment.Status === "spawntreatment"){
    treatment.spawntreatment();
  }

  if(treatment.Status === "spawnedtreatment"){
    gameState = "showTreatment";
  }
  if(gameState === "showTreatment" && howToPlay === "no"){
    treatment.display();
  }

  if(soilder.Status === "spawnedSoilder" && howToPlay === "no"){
    gameState = "play";
  }

  if(gameState === "play" && howToPlay === "no"){
    if(soilder.Status === "spawnedSoilder"){
      soilder.display();
    }
    treatment.display();
    bullet.display();

    enemy1.displayAndMove(500, 500, 200);
    enemy2.displayAndMove(1000, 800, 200);
    enemy3.displayAndMove(1500, 800, 200);
    enemy4.displayAndMove(2000, 800, 200);

    enemy1.attack(40, 800);
    enemy2.attack(70, 1200);
    enemy3.attack(120, 3600);
    enemy4.attack(170, 4500);

    if(bullet.Status === "shootSetup" && bullet.speed === 0){
      bullet.shootSetup();
    }
    else{
      bullet.Status = "shoot";
    }
  
    if(bullet.Status === "shoot"){
      bullet.shoot();
    }
  
    if(bullet.speed === 0){
      soilder.dierection = soilder.tDierection;
    }

    bullet.damage();

    soilder.death();
  
    enemy1.rebornAndDeath(enemy1PowerBar); 
    enemy2.rebornAndDeath(enemy2PowerBar); 
    enemy3.rebornAndDeath(enemy3PowerBar); 
    enemy4.rebornAndDeath(enemy4PowerBar); 

    badge1.display();
    badge2.display();
    badge3.display();
    badge4.display();
  }

  buttons.display();

  if(soilder.living === "died" && gameState === "play"){
    winner = "enemy";
    gameState = "end";
  }
  if(enemy1.living === "died" && enemy2.living === "died" && enemy3.living === "died" && enemy4.living === "died" && gameState === "play"){
    if(badge1.collected === "yes" && badge2.collected === "yes" && badge3.collected === "yes" && badge4.collected === "yes"){
      winner = "soilder";
      gameState = "end";
    }
  }
  if(isTouching(enemy1, treatment, 50, 50) || isTouching(enemy2, treatment, 50, 50) || isTouching(enemy3, treatment, 50, 50) || isTouching(enemy4, treatment, 50, 50)){
    gameState = "end";
    winner = "enemy";
  }

  if(gameState === "end"){
    clear();

    // if(winner === "enemy"){
    //   var Sound = "yes"

    //   if(Sound === "yes"){
    //     loserSound.play();
    //     Sound = "no";
    //   }
    // }

    background(0);
  }
}

function Move(Obj, xs, ys){
  var x = Obj.x;
  x = x + xs;
  Obj.x = x;
  var y = Obj.y;
  y = y + ys;
  Obj.y = y;
}

function keyPressed(){
  if(soilder.x > 0 && soilder.x < Width && soilder.y > 0 && soilder.y < Height){
    if(keyCode ===  37){
      soilder.MoveSoilderLeft();
      soilder.tDierection = "left";
    }
    if(keyCode ===  38){
      soilder.MoveSoilderUp();
      soilder.tDierection = "up";
    }
    if(keyCode ===  39){
      soilder.MoveSoilderRight();
      soilder.tDierection = "right";
    }
    if(keyCode ===  40){
      soilder.MoveSoilderDown();
      soilder.tDierection = "down";
    }
    if(keyCode ===  32){
      bullet.Status = "shootSetup";
    }
  }
  
  if(soilder.Status === "spawnSoilder" && keyCode === 13){
    var posX = mouseX;
    var posY = mouseY;
    soilder.x = posX;
    soilder.y = posY;
    
    soilder.Status = "spawnedSoilder";
  }
}

function findC(obj1, obj2){
  if(obj1.x > obj2.x && obj1.y > obj2.y){
    var Xdifferance = obj1.x - obj2.x;
    var Ydifferance = obj1.y - obj2.y;
    var XYdifferance = (Xdifferance * Xdifferance) + (Ydifferance * Ydifferance);
    var c = Math.sqrt(XYdifferance);
    return c;
  }
  if(obj1.x < obj2.x && obj1.y > obj2.y){
    var Xdifferance = obj2.x - obj1.x;
    var Ydifferance = obj1.y - obj2.y;
    var XYdifferance = (Xdifferance * Xdifferance) + (Ydifferance * Ydifferance);
    var c = Math.sqrt(XYdifferance);
    return c;
  }
  if(obj1.x < obj2.x && obj1.y < obj2.y){
    var Xdifferance = obj2.x - obj1.x;
    var Ydifferance = obj2.y - obj1.y;
    var XYdifferance = (Xdifferance * Xdifferance) + (Ydifferance * Ydifferance);
    var c = Math.sqrt(XYdifferance);
    return c;
  }
  if(obj1.x > obj2.x && obj1.y < obj2.y){
    var Xdifferance = obj1.x - obj2.x;
    var Ydifferance = obj2.y - obj1.y;
    var XYdifferance = (Xdifferance * Xdifferance) + (Ydifferance * Ydifferance);
    var c = Math.sqrt(XYdifferance);
    return c;
  }
}

function isTouching(obj1, obj2, rangeX, rangeY){
  if(obj1.x > obj2.x - rangeX &&
    obj1.x < obj2.x + rangeX &&
    obj1.y > obj2.y - rangeY &&
    obj1.y < obj2.y + rangeY){
    return true;
  }
  else{
    return false;
  }
}
function HowDoIPlay(){
  createCanvas(500, 400);

  text("To start click on Treatment to spawn treatment", 50, 100);
  text("Then click on soilder and click on Enter to spawn soilder", 50, 120);
  
  text("Then Wait for sometime and then there will be Enemies spawning", 50, 160);
  text("You will have to shoot enemies by clicking on SPACE", 50, 180);
  text("When the Enemies spawn any of the Badges will become white", 50, 220);
  
  text("Then you will have to move there and make the badge green", 50, 240);
  text("If you don't collect within the limit you lose", 50, 260);
  text("You will win when you collect all the Badges and also kill al the Enemies", 50, 300)
  text("There are also many other features you will have to explore", 50, 340);
  
  text("Click on reset to Play", 50, 380);
}