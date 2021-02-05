var dog,sadDog,happyDog ,database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var namer;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;

  namer = createInput("Name your dog");
  namer.position(890,95);
  
  feed=createButton("FEED DOG");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD FOOD");
  addFood.position(790,95);
  addFood.mousePressed(addFoods);

  
}

function draw() {
  
    update("Hungry");
    foodObj.display();
   
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}