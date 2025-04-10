
var gameChar_x;
var gameChar_y;
var floorPos_y;
var cameraPos_x;

// variables for the interaction code
var isLeft;
var isFalling;
var isRight;
var isPlummeting;

// variables for the objects
var clouds;
var smoke;
var swordPlatform;
var baseSmoke;
var sword;
var tree;
var moon;
var canyon;
var drippingLava;

// variables for the gradient of the background
var topLayerR;
var topLayerG
var topLayerB;
var bottomLayerR;
var bottomLayerG;
var bottomLayerB;

let ash = []; // array to hold the ashes objects

var game_score; 
var flagpole;
var lives; 

var platforms; // platforms for the character to jump on

// variables for the sound animation sounds
var jumpSound;
var deathSound;
var powerUp;
var gameOver;

var enemies;
var splashScreen;
var splashFont;
var selectScreen;

var gamelock;

function preload()
{
    soundFormats('mp3','wav');
    //load your sounds here
    jumpSound = loadSound('assets/jumping.wav');
    jumpSound.setVolume(0.2);
    deathSound = loadSound('assets/death.wav');
    deathSound.setVolume(0.1);
    powerUp = loadSound('assets/powerupSound.mp3');
    powerUp.setVolume(0.3);
    gameOver = loadSound('assets/gameOver.mp3');
    gameOver.setVolume(0.4);
    // loading of font, i have attached the ReadMe file from the author of the font.
    splashFont = loadFont('splashFont.ttf');
}

function setup()
{
    gamelock = false
	createCanvas(1024, 576);
     // for loop to enable the ashes falling
    for (let ashnum = 0; ashnum < 300; ashnum ++){
        let x = random(width);
        let y = random(100, height);
        ash.push({x,y})
    }
	// to indicate how much lives the game character has left
    lives = 3;

//underworld splashscreen
    splashScreen = false;

    // heaven splashscreen
    heavenScreen = false;

    // option to choose which theme screen
    selectScreen = 1;
      
    canSwitchScreen = true;

    // calling all the setup of the drawing from the function startGame
    startGame();

} // end of setup

function draw()
{   
// to toggle between 4 screens
    if(selectScreen === 1)
    {
        drawSelectsplash(); // option to choose theme
    }
    else if(selectScreen === 2)
    {
        drawSplash(); // underworld instruction splashscreen
    }
    else if(selectScreen === 3)
    {
        drawSplashtwo(); // heaven instruction splashscreen
    }
    else if (selectScreen === 4) // to display underworld game
    {
  // start of underworld game   
    /// adding gradient to the background
    const topcolor = color(topLayerR, topLayerG, topLayerB);
    const bottomcolor = color(bottomLayerR, bottomLayerG, bottomLayerB);

    // for loop to enable the colour gradient for the background, and using the lerpcolor function to enable the colour gradient 
    for(let y = 0; y < height; y++)
    {
        const linecolor = lerpColor(topcolor, bottomcolor,y/height);
        stroke(linecolor);
        line(0, y, width, y);
    }
	noStroke();

    // drawing of ground
    drawGround();

    // moon
    drawMoon();

    // using the push function and translate to do the side scrolling of the background (taken from coursera)
    push();
    translate(-cameraPos_x, 0);
   
    // ashes falling from the sky
    // using the for loop function to create the continuous effect of the ashes falling from the sky in the area of the volcano
    for (let i = 0; i < ash.length; i++)
    {
        ash[i].y += 0.5;
        noStroke();
        // size of the ashes 
        fill(128, 128, 128);
        ellipse(ash[i].x, ash[i].y, 5, 6);
        
    if (ash[i].y > floorPos_y)
       {
        ash[i].x = random(width+5000)
        ash[i].y = random(80, floorPos_y);
       }
    }

	//1. a cloud in the sky
    drawClouds();

	//2. a mountain in the distance
    drawMountains();
    //smoke coming out from the volcano/mountain
    fill(192, 192, 192);
    quad(658, 243, 654, 219, 684, 220, 678, 243);
    ellipse(smoke.x+565, smoke.y+111, 50, 50); 
    ellipse(smoke.x+539, smoke.y+80, 60, 50);
    ellipse(smoke.x+571, smoke.y+68, 50, 50);
    ellipse(smoke.x+594, smoke.y+88, 60, 50);
    ellipse(smoke.x+610, smoke.y+58, 60, 50);
    ellipse(smoke.x+527, smoke.y+43, 60, 50);
    ellipse(smoke.x+626, smoke.y+87, 80, 40);
    // falling lava from volcano
    beginShape();
    fill(255, 69, 0);
    noStroke();
    vertex(drippingLava.x+6, drippingLava.y-3);
    bezierVertex(drippingLava.x+14, drippingLava.y+8, drippingLava.x+26, drippingLava.y+78, drippingLava.x+54, drippingLava.y+25);
    bezierVertex(drippingLava.x+59, drippingLava.y+26, drippingLava.x+68, drippingLava.y+78, drippingLava.x+76, drippingLava.y+29);
    vertex(drippingLava.x+44.4, drippingLava.y-29);
    vertex(drippingLava.x+23.4, drippingLava.y-29);
    vertex(drippingLava.x+6, drippingLava.y-3);
    endShape();
	noStroke();

	//3. a tree
    drawTree();
  
	//4. a canyon -> taken from coursera
    for(let h = 0; h < canyon.length; h++)
    {
        drawCanyon(canyon[h]);
        checkCanyon(canyon[h]);
    }

    // collectable == sword -> taken from coursera
    for(let i = 0; i < sword.length; i ++)
    {
        if(!sword[i].isFound) // if statement to indicate that the score counter will only go up if the character picks up the collectable
        {
        drawSword(sword[i]);
        checkSword(sword[i]);
        }
    }

    // to draw the platforms and to call from the function
    for(let i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

    // function to end the game when all lives have been used up
    if(lives < 1)
    {
        fill(255, 69, 0);
        textSize(50);
        text("YOUR MINE", gameChar_x-200, 200);
        return;
    }

    // function to end the game when character has reached the flagpole
    if(flagpole.isReached == true)
    {
        fill(255, 69, 0);
        textSize(100);
        text("WELCOME TO HELL", gameChar_x-320, 200);
    }
    noStroke();

    // enemy moving
    for(let i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

          if(isContact)
        {
            if(lives > 0)
            {
                lives -= 1;
                startGame();
            }
        }
    }
     
	//the game character
    // for the game character, I have decided to use majority of the bezierVertex function to create the shape of the character
	drawGamecharacter();

    // to draw the flagpole calling from function renderFlagpole
    renderFlagpole();

    //the link between the 'push' and 'pop function (taken from coursera)
    cameraPos_x = gameChar_x - width/2;
    pop();

    // score for the amount of collectables collected and how many lives left  
    drawgameScore();
    // icon for the life of character
    drawCollectablelive();

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    // conditional statements to get the character to jump and fall into canyon
    gameInteraction();
    
    // if statement to indicate when the flag will go up of the flagpole by calling from function(checkFlagpole)
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
} // end bracket for underworld theme game

///////////////////////////////////////////////////////////////////////////////////////////
else if(selectScreen === 5) // to display the heaven theme game
{
background(135, 206, 250);
noStroke();

// drawing of ground
drawGroundtwo();

// moon
drawMoon();

// using the push function and translate to do the side scrolling of the background (taken from coursera)
push();
translate(-cameraPos_x, 0);

// ashes falling from the sky
// using the for loop function to create the continuous effect of the ashes falling from the sky in the area of the volcano
for (let i = 0; i < ash.length; i++)
{
    ash[i].y += 0.5;
    noStroke();
    // size of the ashes 
    fill(255, 215, 0);
    ellipse(ash[i].x, ash[i].y, 5, 6);
    
if (ash[i].y > floorPos_y)
   {
    ash[i].x = random(width+5000)
    ash[i].y = random(80, floorPos_y);
   }
}

//1. a cloud in the sky
drawCloudstwo();

//2. a mountain in the distance
drawMountainstwo();
noStroke();

//3. a tree
drawTreetwo();

//4. a canyon -> taken from coursera
for(let h = 0; h < canyon.length; h++)
{
    drawCanyon(canyon[h]);
    checkCanyon(canyon[h]);
}

// collectable == sword -> taken from coursera
for(let i = 0; i < sword.length; i ++)
{
    if(!sword[i].isFound) // if statement to indicate that the score counter will only go up if the character picks up the collectable
    {
    drawSwordtwo(sword[i]);
    checkSword(sword[i]);
    }
}

// to draw the platforms and to call from the function
for(let i = 0; i < platforms.length; i++)
{
    platforms[i].draw();
}

// function to end the game when all lives have been used up
if(lives < 1)
{
    fill(255, 69, 0);
    textSize(50);
    text("YOUR MINE", gameChar_x-200, 200);
}

// function to end the game when character has reached the flagpole
if(flagpole.isReached == true)
{
    fill(255, 69, 0);
    textSize(100);
    text("WELCOME TO HELL", gameChar_x-320, 200);
}
noStroke();

// enemy moving
for(let i = 0; i < enemies.length; i++)
{
    enemies[i].draw();
    var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

      if(isContact)
    {
        if(lives > 0)
        {
            lives -= 1;
            startGame();
        }
    }
}
 
//the game character
drawGamecharactertwo();

// to draw the flagpole calling from function renderFlagpole
renderFlagpole();

//the link between the 'push' and 'pop function (taken from coursera)
cameraPos_x = gameChar_x - width/2;
pop();

// score for the amount of collectables collected and how many lives left  
drawgameScoretwo();

// icon for the life of character
drawCollectablelive();

///////////INTERACTION CODE//////////
//Put conditional statements to move the game character below here
// conditional statements to get the character to jump and fall into canyon
gameInteraction();

// if statement to indicate when the flag will go up of the flagpole by calling from function(checkFlagpole)
if(flagpole.isReached == false)
{
    checkFlagpole();
}

}  // end of heaven theme draw function

} // end draw function

function drawSplash() // splashscreen for fire theme
{
    // appearance of splash
    createCanvas(1024, 576);
    background(178, 34, 34); 

    // title on the screen
    textFont(splashFont);
    fill(255, 69, 0);
    stroke(0);
    strokeWeight(10);
    textSize(100);
    text("UNDERWORLD ", width/3.5, 150);

    textSize(50);
    text("! PRESS SPACEBAR TO PLAY !", width/3.5, 530);

    // instructions on how to play
    textSize(30);
    text("How to play:", width/25, 280);
    textSize(25);
    text("use arrow keys to move left, right, jump", width/25, 350);

    // instructions on how to win
    textSize(30);
    text("Objective of the game:", width/2, 280);
    textSize(25);
    text("avoid the enemy, collect all collectables", width/2, 350);
    text("and reach the flag unscathed", width/2, 400);

// https://www.dafont.com/theme.php?cat=803 -> this is the website where I took the font for my game, October Crow by Sinister Fonts
}

function drawSplashtwo() // splashscreen for "heaven/light" theme
{
    // appearance of splash
    createCanvas(1024, 576);
    background(176, 196, 222);

    // title 
    textSize(100);
    text("heaven", width/3, 150);

    textSize(50);
    text("! PRESS 'S' TO PLAY !", width/3.5, 530);

    // instructions on how to play
    textSize(40);
    text("How to play:", width/25, 280);
    textSize(28);
    text("use arrow keys to move left, right, jump", width/25, 350);

    // instructions on how to win
    textSize(40);
    text("Objective of the game:", width/2, 280);
    textSize(30);
    text("avoid the enemy, collect all collectables", width/2, 350);
    text("and reach the flag unscathed", width/2, 400);
}

function drawSelectsplash() // splashscreen for option to choose between light or fire theme
{
    // design of splash
    createCanvas(1024, 576);
    background(50, 0, 50);

    // title
    textFont(splashFont);
    fill(0, 0, 128);
    stroke(0);
    strokeWeight(10);
    textSize(50);
    text("Which path do you want to go? ", width/6, 150);

    // light theme
    fill(240, 255, 240);
    text("come to the light", width/20, 300);
    text("Press 'A' to enter", width/20, 400);

    // dark/fire theme
    fill(255, 69, 0);
    text("come to the dark", 600, 300);
    text("press 'b' to enter", 600, 400);
}

function drawGround() // underworld
{
    fill(205,133,63);
	rect(0, 432, 1024, 144); 
}
function drawGroundtwo() // heaven
{
    fill(238, 232, 170);
	rect(0, 432, 1024, 144);
}

function drawGamecharacter() // underworld
{
    // for the game character, I have decided to use majority of the bezierVertex function to create the shape of the character
    if(isLeft && isFalling)
	{
    // add your jumping-left code
    fill(255, 69, 0);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4);
    bezierVertex(gameChar_x-16, gameChar_y-80.4, gameChar_x-7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x+4, gameChar_y-60, gameChar_x+4, gameChar_y-50, gameChar_x-2, gameChar_y-41);
    bezierVertex(gameChar_x-3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x+2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x+3, gameChar_y-32);
    vertex(gameChar_x+1, gameChar_y-29);
    vertex(gameChar_x+5, gameChar_y-27);
    vertex(gameChar_x+3, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-21);

    //tail
    bezierVertex(gameChar_x+13, gameChar_y-21.25, gameChar_x+16, gameChar_y-20.25, gameChar_x+35, gameChar_y+3);
    bezierVertex(gameChar_x+23, gameChar_y-2.25, gameChar_x+15, gameChar_y-11, gameChar_x+5, gameChar_y-12);
    vertex(gameChar_x-1, gameChar_y-6);
    vertex(gameChar_x-1, gameChar_y-3);
    vertex(gameChar_x-9, gameChar_y-2);
    bezierVertex(gameChar_x-9, gameChar_y-4, gameChar_x-10, gameChar_y-4, gameChar_x-12, gameChar_y-6); 

    // toes
    vertex(gameChar_x-8, gameChar_y-9);
    bezierVertex(gameChar_x-9, gameChar_y-13, gameChar_x-12, gameChar_y-15, gameChar_x-7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x-12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4)
    bezierVertex(gameChar_x-23, gameChar_y-52, gameChar_x-27, gameChar_y-49, gameChar_x-25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(255,69,0);
    vertex(gameChar_x-21, gameChar_y-54);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-23, gameChar_y-44.74, gameChar_x-19, gameChar_y-43, gameChar_x-15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-21, gameChar_y-44, gameChar_x-17, gameChar_y-41, gameChar_x-12, gameChar_y-40);
    bezierVertex(gameChar_x-11, gameChar_y-39, gameChar_x-16, gameChar_y-34, gameChar_x-13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(255, 69, 0);
    noStroke();
    vertex(gameChar_x-12.8, gameChar_y-36);
    bezierVertex(gameChar_x-14, gameChar_y-33, gameChar_x-14, gameChar_y-31, gameChar_x-13, gameChar_y-27);
    vertex(gameChar_x-8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(255, 69, 0);
    vertex(gameChar_x-13, gameChar_y-27);
    bezierVertex(gameChar_x-16, gameChar_y-25, gameChar_x-17, gameChar_y-26, gameChar_x-22, gameChar_y-18);
    vertex(gameChar_x-20, gameChar_y-18);
    vertex(gameChar_x-19, gameChar_y-15);
    vertex(gameChar_x-18, gameChar_y-17);
    vertex(gameChar_x-17, gameChar_y-16);
    bezierVertex(gameChar_x-13, gameChar_y-18, gameChar_x-9, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x-9, gameChar_y-2);
    vertex(gameChar_x-12, gameChar_y-1);
    vertex(gameChar_x-10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x-11, gameChar_y-3);
    vertex(gameChar_x-14, gameChar_y-2);
    vertex(gameChar_x-11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x-13, gameChar_y-3);
    vertex(gameChar_x-15, gameChar_y-3);
    vertex(gameChar_x-12, gameChar_y-6);
    endShape();
    fill(255, 69, 0);

    //back leg
    beginShape();
    vertex(gameChar_x-10.8, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-15, gameChar_y-11.2);
    bezierVertex(gameChar_x-16, gameChar_y-13.1, gameChar_x-17, gameChar_y-15.2, gameChar_x-15, gameChar_y-17.2);
    bezierVertex(gameChar_x-14, gameChar_y-19, gameChar_x-11, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    bezierVertex(gameChar_x-10, gameChar_y-17, gameChar_x-10, gameChar_y-14, gameChar_x-8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-21, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    endShape();
    
    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x+36, gameChar_y-0.86);
    bezierVertex(gameChar_x+40, gameChar_y-1.86, gameChar_x+42, gameChar_y-8.86, gameChar_x+39, gameChar_y-2.86);
    bezierVertex(gameChar_x+41, gameChar_y-8.61, gameChar_x+37, gameChar_y-11.61, gameChar_x+40, gameChar_y-16.61);
    bezierVertex(gameChar_x+36, gameChar_y-15.61, gameChar_x+34, gameChar_y-10.61, gameChar_x+33, gameChar_y-5.61);
    bezierVertex(gameChar_x+33, gameChar_y-3.61, gameChar_x+34, gameChar_y-2.61, gameChar_x+36, gameChar_y-0.86);
    endShape();
    
    //mouth
    beginShape();
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-25, gameChar_y-48.25);
    vertex(gameChar_x-19, gameChar_y-47.25);
    vertex(gameChar_x-23, gameChar_y-45.25);
    bezierVertex(gameChar_x-25.5, gameChar_y-46.11, gameChar_x-25.5, gameChar_y-48.11, gameChar_x-25.5, gameChar_y-48.11);
    endShape();
    
    // breathing fire from mouth
    beginShape();
    fill(255, 215, 0);
    stroke(255, 0, 0);
    strokeWeight(1.5);
    vertex(gameChar_x-27, gameChar_y-48.2);
    vertex(gameChar_x-33, gameChar_y-49.2);
    bezierVertex(gameChar_x-34.4, gameChar_y-51.2, gameChar_x-28, gameChar_y-53.2, gameChar_x-34, gameChar_y-55.2); 
    bezierVertex(gameChar_x-37, gameChar_y-57.2, gameChar_x-44, gameChar_y-56.2, gameChar_x-39, gameChar_y-52.2);
    bezierVertex(gameChar_x-38, gameChar_y-51.2, gameChar_x-42, gameChar_y-50.2, gameChar_x-47, gameChar_y-55.2);
    bezierVertex(gameChar_x-50, gameChar_y-58.2, gameChar_x-53, gameChar_y-55.2, gameChar_x-49, gameChar_y-47);
    bezierVertex(gameChar_x-44, gameChar_y-45.2, gameChar_x-39, gameChar_y-44.2, gameChar_x-42, gameChar_y-48.2);
    bezierVertex(gameChar_x-36, gameChar_y-45.2, gameChar_x-31, gameChar_y-44.2, gameChar_x-27, gameChar_y-48.2);
    endShape();

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
          
    fill(255, 69, 0);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4);
    bezierVertex(gameChar_x+16, gameChar_y-80.4, gameChar_x+7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x-4, gameChar_y-60, gameChar_x-4, gameChar_y-50, gameChar_x+2, gameChar_y-41);
    bezierVertex(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x-2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x-3, gameChar_y-32);
    vertex(gameChar_x-1, gameChar_y-29);
    vertex(gameChar_x-5, gameChar_y-27);
    vertex(gameChar_x-3, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-21);
    bezierVertex(gameChar_x-13, gameChar_y-21.25, gameChar_x-16, gameChar_y-20.25, gameChar_x-35, gameChar_y+3);
    bezierVertex(gameChar_x-23, gameChar_y-2.25, gameChar_x-15, gameChar_y-11, gameChar_x-5, gameChar_y-12);
    vertex(gameChar_x+1, gameChar_y-6);
    vertex(gameChar_x+1, gameChar_y-3);
    vertex(gameChar_x+9, gameChar_y-2);
    bezierVertex(gameChar_x+9, gameChar_y-4, gameChar_x+10, gameChar_y-4, gameChar_x+12, gameChar_y-6); 

    // toes
    vertex(gameChar_x+8, gameChar_y-9);
    bezierVertex(gameChar_x+9, gameChar_y-13, gameChar_x+12, gameChar_y-15, gameChar_x+7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x+12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4)
    bezierVertex(gameChar_x+23, gameChar_y-52, gameChar_x+27, gameChar_y-49, gameChar_x+25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(255,69,0);
    vertex(gameChar_x+21, gameChar_y-54);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+23, gameChar_y-44.74, gameChar_x+19, gameChar_y-43, gameChar_x+15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    //vertex(21, 291.5);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+21, gameChar_y-44, gameChar_x+17, gameChar_y-41, gameChar_x+12, gameChar_y-40);
    bezierVertex(gameChar_x+11, gameChar_y-39, gameChar_x+16, gameChar_y-34, gameChar_x+13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(255, 69, 0);
    noStroke();
    vertex(gameChar_x+12.8, gameChar_y-36);
    bezierVertex(gameChar_x+14, gameChar_y-33, gameChar_x+14, gameChar_y-31, gameChar_x+13, gameChar_y-27);
    vertex(gameChar_x+8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(255, 69, 0);
    vertex(gameChar_x+13, gameChar_y-27);
    bezierVertex(gameChar_x+16, gameChar_y-25, gameChar_x+17, gameChar_y-26, gameChar_x+22, gameChar_y-18);
    vertex(gameChar_x+20, gameChar_y-18);
    vertex(gameChar_x+19, gameChar_y-15);
    vertex(gameChar_x+18, gameChar_y-17);
    vertex(gameChar_x+17, gameChar_y-16);
    bezierVertex(gameChar_x+13, gameChar_y-18, gameChar_x+9, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x+9, gameChar_y-2);
    vertex(gameChar_x+12, gameChar_y-1);
    vertex(gameChar_x+10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x+11, gameChar_y-3);
    vertex(gameChar_x+14, gameChar_y-2);
    vertex(gameChar_x+11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x+13, gameChar_y-3);
    vertex(gameChar_x+15, gameChar_y-3);
    vertex(gameChar_x+12, gameChar_y-6);
    endShape();
    fill(255, 69, 0);

    //back leg
    beginShape();
    vertex(gameChar_x+10.8, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+15, gameChar_y-11.2);
    bezierVertex(gameChar_x+16, gameChar_y-13.1, gameChar_x+17, gameChar_y-15.2, gameChar_x+15, gameChar_y-17.2);
    bezierVertex(gameChar_x+14, gameChar_y-19, gameChar_x+11, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    bezierVertex(gameChar_x+10, gameChar_y-17, gameChar_x+10, gameChar_y-14, gameChar_x+8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+21, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    endShape();

    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x-36, gameChar_y-0.86);
    bezierVertex(gameChar_x-40, gameChar_y-1.86, gameChar_x-42, gameChar_y-8.86, gameChar_x-39, gameChar_y-2.86);
    bezierVertex(gameChar_x-41, gameChar_y-8.61, gameChar_x-37, gameChar_y-11.61, gameChar_x-40, gameChar_y-16.61);
    bezierVertex(gameChar_x-36, gameChar_y-15.61, gameChar_x-34, gameChar_y-10.61, gameChar_x-33, gameChar_y-5.61);
    bezierVertex(gameChar_x-33, gameChar_y-3.61, gameChar_x-34, gameChar_y-2.61, gameChar_x-36, gameChar_y-0.86);
    endShape();
    
    // mouth
    beginShape();
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x+25, gameChar_y-48.25);
    vertex(gameChar_x+19, gameChar_y-47.25);
    vertex(gameChar_x+23, gameChar_y-45.25);
    bezierVertex(gameChar_x+25.5, gameChar_y-46.11, gameChar_x+25.5, gameChar_y-48.11, gameChar_x+25.5, gameChar_y-48.11);
    endShape();
    
    // breathing fire from mouth
    beginShape();
    fill(255, 215, 0);
    stroke(255, 0, 0);
    strokeWeight(1.5);
    vertex(gameChar_x+27, gameChar_y-48.2);
    vertex(gameChar_x+33, gameChar_y-49.2);
    bezierVertex(gameChar_x+34.4, gameChar_y-51.2, gameChar_x+28, gameChar_y-53.2, gameChar_x+34, gameChar_y-55.2); 
    bezierVertex(gameChar_x+37, gameChar_y-57.2, gameChar_x+44, gameChar_y-56.2, gameChar_x+39, gameChar_y-52.2);
    bezierVertex(gameChar_x+38, gameChar_y-51.2, gameChar_x+42, gameChar_y-50.2, gameChar_x+47, gameChar_y-55.2);
    bezierVertex(gameChar_x+50, gameChar_y-58.2, gameChar_x+53, gameChar_y-55.2, gameChar_x+49, gameChar_y-47);
    bezierVertex(gameChar_x+44, gameChar_y-45.2, gameChar_x+39, gameChar_y-44.2, gameChar_x+42, gameChar_y-48.2);
    bezierVertex(gameChar_x+36, gameChar_y-45.2, gameChar_x+31, gameChar_y-44.2, gameChar_x+27, gameChar_y-48.2);
    endShape();
        
	}
	else if(isLeft)
	{
    // add your walking left code
        
    fill(255, 69, 0);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4);
    bezierVertex(gameChar_x-16, gameChar_y-80.4, gameChar_x-7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x+4, gameChar_y-60, gameChar_x+4, gameChar_y-50, gameChar_x-2, gameChar_y-41);
    bezierVertex(gameChar_x-3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x+2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x+3, gameChar_y-32);
    vertex(gameChar_x+1, gameChar_y-29);
    vertex(gameChar_x+5, gameChar_y-27);
    vertex(gameChar_x+3, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-21);
    bezierVertex(gameChar_x+12, gameChar_y-22, gameChar_x+22, gameChar_y-27, gameChar_x+27, gameChar_y-36);
    bezierVertex(gameChar_x+25, gameChar_y-29, gameChar_x+20, gameChar_y-17, gameChar_x+2, gameChar_y-10);
    vertex(gameChar_x-1, gameChar_y-6);
    vertex(gameChar_x-1, gameChar_y-3);
    vertex(gameChar_x-9, gameChar_y-2);
    bezierVertex(gameChar_x-9, gameChar_y-4, gameChar_x-10, gameChar_y-4, gameChar_x-12, gameChar_y-6); // toes
    vertex(gameChar_x-8, gameChar_y-9);
    bezierVertex(gameChar_x-9, gameChar_y-13, gameChar_x-12, gameChar_y-15, gameChar_x-7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x-12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4)
    bezierVertex(gameChar_x-23, gameChar_y-52, gameChar_x-27, gameChar_y-49, gameChar_x-25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(255,69,0);
    vertex(gameChar_x-21, gameChar_y-54);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-23, gameChar_y-44.74, gameChar_x-19, gameChar_y-43, gameChar_x-15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-21, gameChar_y-44, gameChar_x-17, gameChar_y-41, gameChar_x-12, gameChar_y-40);
    bezierVertex(gameChar_x-11, gameChar_y-39, gameChar_x-16, gameChar_y-34, gameChar_x-13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(255, 69, 0);
    noStroke();
    vertex(gameChar_x-12.8, gameChar_y-36);
    bezierVertex(gameChar_x-14, gameChar_y-33, gameChar_x-14, gameChar_y-31, gameChar_x-13, gameChar_y-27);
    vertex(gameChar_x-8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(255, 69, 0);
    vertex(gameChar_x-13, gameChar_y-27);
    bezierVertex(gameChar_x-16, gameChar_y-25, gameChar_x-17, gameChar_y-26, gameChar_x-22, gameChar_y-18);
    vertex(gameChar_x-20, gameChar_y-18);
    vertex(gameChar_x-19, gameChar_y-15);
    vertex(gameChar_x-18, gameChar_y-17);
    vertex(gameChar_x-17, gameChar_y-16);
    bezierVertex(gameChar_x-13, gameChar_y-18, gameChar_x-9, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x-9, gameChar_y-2);
    vertex(gameChar_x-12, gameChar_y-1);
    vertex(gameChar_x-10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x-11, gameChar_y-3);
    vertex(gameChar_x-14, gameChar_y-2);
    vertex(gameChar_x-11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x-13, gameChar_y-3);
    vertex(gameChar_x-15, gameChar_y-3);
    vertex(gameChar_x-12, gameChar_y-6);
    endShape();
    fill(255, 69, 0);

    //back leg
    beginShape();
    vertex(gameChar_x-10.8, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-15, gameChar_y-11.2);
    bezierVertex(gameChar_x-16, gameChar_y-13.1, gameChar_x-17, gameChar_y-15.2, gameChar_x-15, gameChar_y-17.2);
    bezierVertex(gameChar_x-14, gameChar_y-19, gameChar_x-11, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    bezierVertex(gameChar_x-10, gameChar_y-17, gameChar_x-10, gameChar_y-14, gameChar_x-8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-21, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    endShape();
    
     // FIRE ON THE TAIL
    fill(220,20,60);
    beginShape();
    vertex(gameChar_x+25, gameChar_y-38.2);
    bezierVertex(gameChar_x+24, gameChar_y-44.2, gameChar_x+24, gameChar_y-46.2, gameChar_x+27, gameChar_y-48.2);
    bezierVertex(gameChar_x+28, gameChar_y-51.2, gameChar_x+29, gameChar_y-54.2, gameChar_x+26, gameChar_y-57.2);
    bezierVertex(gameChar_x+31, gameChar_y-55.2, gameChar_x+32, gameChar_y-49.2, gameChar_x+31, gameChar_y-41.2);
    bezierVertex(gameChar_x+30, gameChar_y-39.2, gameChar_x+29, gameChar_y-37.2, gameChar_x+25, gameChar_y-38.2);
    endShape();
    noFill();
    
    // mouth
    beginShape();
    noFill();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-25, gameChar_y-46.25);
    vertex(gameChar_x-14, gameChar_y-45.25);
    endShape();

	}
	else if(isRight)
	{
		// add your walking right code
    
    fill(255, 69, 0);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4);
    bezierVertex(gameChar_x+16, gameChar_y-80.4, gameChar_x+7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x-4, gameChar_y-60, gameChar_x-4, gameChar_y-50, gameChar_x+2, gameChar_y-41);
    bezierVertex(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x-2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x-3, gameChar_y-32);
    vertex(gameChar_x-1, gameChar_y-29);
    vertex(gameChar_x-5, gameChar_y-27);
    vertex(gameChar_x-3, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-21);
    bezierVertex(gameChar_x-12, gameChar_y-22, gameChar_x-22, gameChar_y-27, gameChar_x-27, gameChar_y-36);
    bezierVertex(gameChar_x-25, gameChar_y-29, gameChar_x-20, gameChar_y-17, gameChar_x-2, gameChar_y-10);
    vertex(gameChar_x+1, gameChar_y-6);
    vertex(gameChar_x+1, gameChar_y-3);
    vertex(gameChar_x+9, gameChar_y-2);
    bezierVertex(gameChar_x+9, gameChar_y-4, gameChar_x+10, gameChar_y-4, gameChar_x+12, gameChar_y-6); 

    // toes
    vertex(gameChar_x+8, gameChar_y-9);
    bezierVertex(gameChar_x+9, gameChar_y-13, gameChar_x+12, gameChar_y-15, gameChar_x+7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x+12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4)
    bezierVertex(gameChar_x+23, gameChar_y-52, gameChar_x+27, gameChar_y-49, gameChar_x+25, gameChar_y-46);
    endShape();
    
    // cover the missing shape
    beginShape();
    noStroke();
    fill(255,69,0);
    vertex(gameChar_x+21, gameChar_y-54);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+23, gameChar_y-44.74, gameChar_x+19, gameChar_y-43, gameChar_x+15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+21, gameChar_y-44, gameChar_x+17, gameChar_y-41, gameChar_x+12, gameChar_y-40);
    bezierVertex(gameChar_x+11, gameChar_y-39, gameChar_x+16, gameChar_y-34, gameChar_x+13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(255, 69, 0);
    noStroke();
    vertex(gameChar_x+12.8, gameChar_y-36);
    bezierVertex(gameChar_x+14, gameChar_y-33, gameChar_x+14, gameChar_y-31, gameChar_x+13, gameChar_y-27);
    vertex(gameChar_x+8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(255, 69, 0);
    vertex(gameChar_x+13, gameChar_y-27);
    bezierVertex(gameChar_x+16, gameChar_y-25, gameChar_x+17, gameChar_y-26, gameChar_x+22, gameChar_y-18);
    vertex(gameChar_x+20, gameChar_y-18);
    vertex(gameChar_x+19, gameChar_y-15);
    vertex(gameChar_x+18, gameChar_y-17);
    vertex(gameChar_x+17, gameChar_y-16);
    bezierVertex(gameChar_x+13, gameChar_y-18, gameChar_x+9, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x+9, gameChar_y-2);
    vertex(gameChar_x+12, gameChar_y-1);
    vertex(gameChar_x+10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x+11, gameChar_y-3);
    vertex(gameChar_x+14, gameChar_y-2);
    vertex(gameChar_x+11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x+13, gameChar_y-3);
    vertex(gameChar_x+15, gameChar_y-3);
    vertex(gameChar_x+12, gameChar_y-6);
    endShape();
    fill(255, 69, 0);

    //back leg
    beginShape();
    vertex(gameChar_x+10.8, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+15, gameChar_y-11.2);
    bezierVertex(gameChar_x+16, gameChar_y-13.1, gameChar_x+17, gameChar_y-15.2, gameChar_x+15, gameChar_y-17.2);
    bezierVertex(gameChar_x+14, gameChar_y-19, gameChar_x+11, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    bezierVertex(gameChar_x+10, gameChar_y-17, gameChar_x+10, gameChar_y-14, gameChar_x+8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+21, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    endShape();
    
     // FIRE ON THE TAIL
    fill(220,20,60);
    beginShape();
    vertex(gameChar_x-25, gameChar_y-38.2);
    bezierVertex(gameChar_x-24, gameChar_y-44.2, gameChar_x-24, gameChar_y-46.2, gameChar_x-27, gameChar_y-48.2);
    bezierVertex(gameChar_x-28, gameChar_y-51.2, gameChar_x-29, gameChar_y-54.2, gameChar_x-26, gameChar_y-57.2);
    bezierVertex(gameChar_x-31, gameChar_y-55.2, gameChar_x-32, gameChar_y-49.2, gameChar_x-31, gameChar_y-41.2);
    bezierVertex(gameChar_x-30, gameChar_y-39.2, gameChar_x-29, gameChar_y-37.2, gameChar_x-25, gameChar_y-38.2);
    endShape();
    noFill();
    
     // mouth
    beginShape();
    noFill();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x+25, gameChar_y-46.25);
    vertex(gameChar_x+14, gameChar_y-45.25);
    endShape();

	}
	else if(isFalling || isPlummeting)
	{
	// add your jumping facing forwards code
    
     // tail
    beginShape();
    fill(255, 69, 0);
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-15, gameChar_y-18);
    bezierVertex(gameChar_x-27, gameChar_y-19, gameChar_x-23, gameChar_y-25, gameChar_x-34, gameChar_y-44);
    bezierVertex(gameChar_x-37, gameChar_y-36, gameChar_x-33, gameChar_y-19, gameChar_x-25, gameChar_y-12);
    bezierVertex(gameChar_x-22, gameChar_y-10, gameChar_x-18, gameChar_y-7, gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-16, gameChar_y-12, gameChar_x-17, gameChar_y-23, gameChar_x-15, gameChar_y-18);
    endShape();
    
    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x-35, gameChar_y-46);
    bezierVertex(gameChar_x-38, gameChar_y-48, gameChar_x-39, gameChar_y-51, gameChar_x-37, gameChar_y-56);
    bezierVertex(gameChar_x-36, gameChar_y-59, gameChar_x-34, gameChar_y-63, gameChar_x-37, gameChar_y-65);
    bezierVertex(gameChar_x-32, gameChar_y-62, gameChar_x-31, gameChar_y-57, gameChar_x-30, gameChar_y-51);
    bezierVertex(gameChar_x-30, gameChar_y-48, gameChar_x-30, gameChar_y-45, gameChar_x-35, gameChar_y-46);
    endShape();
    
    // left side of body
    beginShape();
    fill(255, 69, 0); 
    stroke(10);
    strokeWeight(0.5);
    vertex(gameChar_x-6.5, gameChar_y-48);
    bezierVertex(gameChar_x-13, gameChar_y-46, gameChar_x-15, gameChar_y-37, gameChar_x-21, gameChar_y-27);
    vertex(gameChar_x-21,gameChar_y-27);
    vertex(gameChar_x-21.5, gameChar_y-23);
    vertex(gameChar_x-20, gameChar_y-25);
    vertex(gameChar_x-19, gameChar_y-24);
    vertex(gameChar_x-18, gameChar_y-26);
    vertex(gameChar_x-16, gameChar_y-24);
    vertex(gameChar_x-16, gameChar_y-27);
    vertex(gameChar_x-13, gameChar_y-28);
    vertex(gameChar_x-13, gameChar_y-22);
    bezierVertex(gameChar_x-17, gameChar_y-20, gameChar_x-17, gameChar_y-12, gameChar_x-14, gameChar_y-10);
    vertex(gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-12, gameChar_y-8, gameChar_x-22, gameChar_y-4, gameChar_x-8, gameChar_y-6);
    bezierVertex(gameChar_x-3, gameChar_y-8, gameChar_x-5, gameChar_y-12, gameChar_x-5, gameChar_y-11);
    vertex(gameChar_x, gameChar_y-48);
    endShape();
    
    // right side of body
    beginShape();
    stroke(10);
    strokeWeight(0.5);
    vertex(gameChar_x+9, gameChar_y-48);
    bezierVertex(gameChar_x+13, gameChar_y-47, gameChar_x+20, gameChar_y-33, gameChar_x+20, gameChar_y-29);
    vertex(gameChar_x+20, gameChar_y-24);
    vertex(gameChar_x+18, gameChar_y-26);
    vertex(gameChar_x+17, gameChar_y-24);
    vertex(gameChar_x+15, gameChar_y-27);
    vertex(gameChar_x+15, gameChar_y-24);
    vertex(gameChar_x+13, gameChar_y-28);
    vertex(gameChar_x+11, gameChar_y-29);
    vertex(gameChar_x+11, gameChar_y-23);
    bezierVertex(gameChar_x+13, gameChar_y-20, gameChar_x+17, gameChar_y-19, gameChar_x+11, gameChar_y-11);
    bezierVertex(gameChar_x+13, gameChar_y-10, gameChar_x+19, gameChar_y-5, gameChar_x+8, gameChar_y-6);
    bezierVertex(gameChar_x+5, gameChar_y-8, gameChar_x+3, gameChar_y-10, gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+1, gameChar_y-48);
    endShape();

    // eggbody -> top half
    beginShape();
    fill(240, 230, 140);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-5, gameChar_y-42, gameChar_x+1, gameChar_y-64, gameChar_x+8, gameChar_y-23);
    endShape();
    //eggbody -> bottom half
    fill(240, 230, 140);
    beginShape();
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-12, gameChar_y-7, gameChar_x+9, gameChar_y-7, gameChar_x+8, gameChar_y-23);
    endShape();
  
    // head
    beginShape();
    fill(255, 69, 0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-63.4);
    bezierVertex(gameChar_x-7, gameChar_y-72.4, gameChar_x+8, gameChar_y-72.4, gameChar_x+11, gameChar_y-64);
    vertex(gameChar_x+12, gameChar_y-53);
    bezierVertex(gameChar_x+8, gameChar_y-42, gameChar_x-8, gameChar_y-42, gameChar_x-12, gameChar_y-53);
    vertex(gameChar_x-9.7, gameChar_y-64);
    endShape();
    
    //eyes
    fill(0);
    ellipse(gameChar_x+7, gameChar_y-59.61, 2, 5);
    ellipse(gameChar_x-6, gameChar_y-60, 2, 5);
    noFill();
   
    //mouth
    noFill();
    beginShape();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-7, gameChar_y-54);
    vertex(gameChar_x-7, gameChar_y-52);
    vertex(gameChar_x, gameChar_y-50);
    vertex(gameChar_x+7, gameChar_y-52);
    vertex(gameChar_x+7, gameChar_y-54);
    endShape();
    line(gameChar_x-2, gameChar_y-53.5, gameChar_x-1, gameChar_y-53);
    line(gameChar_x+2, gameChar_y-53, gameChar_x+3.3, gameChar_y-54);
    
	}
	else
	{
		// add your standing front facing code
        
    // fire
    fill(255, 69, 0);
    stroke(0);
    strokeWeight(0.5);
    beginShape();
    vertex(gameChar_x-11, gameChar_y-44);
    bezierVertex(gameChar_x-12, gameChar_y-52, gameChar_x-14, gameChar_y-50, gameChar_x-14, gameChar_y-47);
    bezierVertex(gameChar_x-15, gameChar_y-49, gameChar_x-15, gameChar_y-52, gameChar_x-18, gameChar_y-53);
    bezierVertex(gameChar_x-18, gameChar_y-51, gameChar_x-17, gameChar_y-48, gameChar_x-18, gameChar_y-46);
    bezierVertex(gameChar_x-20, gameChar_y-49, gameChar_x-21, gameChar_y-50, gameChar_x-25, gameChar_y-52);
    bezierVertex(gameChar_x-25, gameChar_y-50, gameChar_x-26, gameChar_y-47, gameChar_x-23, gameChar_y-43);
    bezierVertex(gameChar_x-26, gameChar_y-45, gameChar_x-28, gameChar_y-46, gameChar_x-23, gameChar_y-36);
    bezierVertex(gameChar_x-24, gameChar_y-38, gameChar_x-26, gameChar_y-35, gameChar_x-19, gameChar_y-31);
    endShape();

    // inside the fire
    fill(218, 165, 32);
    noStroke();
    beginShape();
    vertex(gameChar_x-17, gameChar_y-35);
    bezierVertex(gameChar_x-20, gameChar_y-40, gameChar_x-19, gameChar_y-39, gameChar_x-20, gameChar_y-44);
    bezierVertex(gameChar_x-18, gameChar_y-44, gameChar_x-19, gameChar_y-47, gameChar_x-12, gameChar_y-44);
    endShape();

    // outerbody 
    fill(255, 69, 0); 
    stroke(10);

    // left side of body
    beginShape();
    vertex(gameChar_x-6.5, gameChar_y-48);
    bezierVertex(gameChar_x-13, gameChar_y-46, gameChar_x-15, gameChar_y-37, gameChar_x-21, gameChar_y-27);
    vertex(gameChar_x-21,gameChar_y-27);
    vertex(gameChar_x-21.5, gameChar_y-23);
    vertex(gameChar_x-20, gameChar_y-25);
    vertex(gameChar_x-19, gameChar_y-24);
    vertex(gameChar_x-18, gameChar_y-26);
    vertex(gameChar_x-16, gameChar_y-24);
    vertex(gameChar_x-16, gameChar_y-27);
    vertex(gameChar_x-13, gameChar_y-28);
    vertex(gameChar_x-13, gameChar_y-22);
    bezierVertex(gameChar_x-17, gameChar_y-20, gameChar_x-17, gameChar_y-12, gameChar_x-14, gameChar_y-10);
    vertex(gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-12, gameChar_y-8, gameChar_x-22, gameChar_y-4, gameChar_x-8, gameChar_y-6);
    bezierVertex(gameChar_x-3, gameChar_y-8, gameChar_x-5, gameChar_y-12, gameChar_x-5, gameChar_y-11);
    vertex(gameChar_x, gameChar_y-48);
    endShape();

    // right side of body
    beginShape();
    vertex(gameChar_x+9, gameChar_y-48);
    bezierVertex(gameChar_x+13, gameChar_y-47, gameChar_x+20, gameChar_y-33, gameChar_x+20, gameChar_y-29);
    vertex(gameChar_x+20, gameChar_y-24);
    vertex(gameChar_x+18, gameChar_y-26);
    vertex(gameChar_x+17, gameChar_y-24);
    vertex(gameChar_x+15, gameChar_y-27);
    vertex(gameChar_x+15, gameChar_y-24);
    vertex(gameChar_x+13, gameChar_y-28);
    vertex(gameChar_x+11, gameChar_y-29);
    vertex(gameChar_x+11, gameChar_y-23);
    bezierVertex(gameChar_x+13, gameChar_y-20, gameChar_x+17, gameChar_y-19, gameChar_x+11, gameChar_y-11);
    bezierVertex(gameChar_x+13, gameChar_y-10, gameChar_x+19, gameChar_y-5, gameChar_x+8, gameChar_y-6);
    bezierVertex(gameChar_x+5, gameChar_y-8, gameChar_x+3, gameChar_y-10, gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+1, gameChar_y-48);
    endShape();

    // eggbody
    beginShape();
    fill(240, 230, 140);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-5, gameChar_y-42, gameChar_x+1, gameChar_y-64, gameChar_x+8, gameChar_y-23);
    endShape();
    fill(240, 230, 140);
    beginShape();
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-12, gameChar_y-7, gameChar_x+9, gameChar_y-7, gameChar_x+8, gameChar_y-23);
    endShape();
    
    // head
    beginShape();
    fill(255, 69, 0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-63.4);
    bezierVertex(gameChar_x-7, gameChar_y-72.4, gameChar_x+8, gameChar_y-72.4, gameChar_x+11, gameChar_y-64);
    vertex(gameChar_x+12, gameChar_y-53);
    bezierVertex(gameChar_x+8, gameChar_y-42, gameChar_x-8, gameChar_y-42, gameChar_x-12, gameChar_y-53);
    vertex(gameChar_x-9.7, gameChar_y-64);
    endShape();
    
    // eyes
    fill(0);
    ellipse(gameChar_x+7, gameChar_y-59.61, 2, 5);
    ellipse(gameChar_x-6, gameChar_y-60, 2, 5);
    noFill();
   
    //mouth
    noFill();
    beginShape();
    vertex(gameChar_x-7, gameChar_y-54);
    vertex(gameChar_x-7, gameChar_y-52);
    vertex(gameChar_x, gameChar_y-50);
    vertex(gameChar_x+7, gameChar_y-52);
    vertex(gameChar_x+7, gameChar_y-54);
    endShape();
    line(gameChar_x-2, gameChar_y-53.5, gameChar_x-1, gameChar_y-53);
    line(gameChar_x+2, gameChar_y-53, gameChar_x+3.3, gameChar_y-54);
	}

}
function drawGamecharactertwo() // heaven
{
    // for the game character, I have decided to use majority of the bezierVertex function to create the shape of the character
    if(isLeft && isFalling)
	{
    // add your jumping-left code
    
    fill(135, 206, 250);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4);
    bezierVertex(gameChar_x-16, gameChar_y-80.4, gameChar_x-7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x+4, gameChar_y-60, gameChar_x+4, gameChar_y-50, gameChar_x-2, gameChar_y-41);
    bezierVertex(gameChar_x-3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x+2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x+3, gameChar_y-32);
    vertex(gameChar_x+1, gameChar_y-29);
    vertex(gameChar_x+5, gameChar_y-27);
    vertex(gameChar_x+3, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-21);

    //tail
    bezierVertex(gameChar_x+13, gameChar_y-21.25, gameChar_x+16, gameChar_y-20.25, gameChar_x+35, gameChar_y+3);
    bezierVertex(gameChar_x+23, gameChar_y-2.25, gameChar_x+15, gameChar_y-11, gameChar_x+5, gameChar_y-12);
    vertex(gameChar_x-1, gameChar_y-6);
    vertex(gameChar_x-1, gameChar_y-3);
    vertex(gameChar_x-9, gameChar_y-2);
    bezierVertex(gameChar_x-9, gameChar_y-4, gameChar_x-10, gameChar_y-4, gameChar_x-12, gameChar_y-6); 

    // toes
    vertex(gameChar_x-8, gameChar_y-9);
    bezierVertex(gameChar_x-9, gameChar_y-13, gameChar_x-12, gameChar_y-15, gameChar_x-7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x-12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4)
    bezierVertex(gameChar_x-23, gameChar_y-52, gameChar_x-27, gameChar_y-49, gameChar_x-25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(135, 206, 250);
    vertex(gameChar_x-21, gameChar_y-54);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-23, gameChar_y-44.74, gameChar_x-19, gameChar_y-43, gameChar_x-15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-21, gameChar_y-44, gameChar_x-17, gameChar_y-41, gameChar_x-12, gameChar_y-40);
    bezierVertex(gameChar_x-11, gameChar_y-39, gameChar_x-16, gameChar_y-34, gameChar_x-13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(135, 206, 250);
    noStroke();
    vertex(gameChar_x-12.8, gameChar_y-36);
    bezierVertex(gameChar_x-14, gameChar_y-33, gameChar_x-14, gameChar_y-31, gameChar_x-13, gameChar_y-27);
    vertex(gameChar_x-8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(135, 206, 250);
    vertex(gameChar_x-13, gameChar_y-27);
    bezierVertex(gameChar_x-16, gameChar_y-25, gameChar_x-17, gameChar_y-26, gameChar_x-22, gameChar_y-18);
    vertex(gameChar_x-20, gameChar_y-18);
    vertex(gameChar_x-19, gameChar_y-15);
    vertex(gameChar_x-18, gameChar_y-17);
    vertex(gameChar_x-17, gameChar_y-16);
    bezierVertex(gameChar_x-13, gameChar_y-18, gameChar_x-9, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x-9, gameChar_y-2);
    vertex(gameChar_x-12, gameChar_y-1);
    vertex(gameChar_x-10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x-11, gameChar_y-3);
    vertex(gameChar_x-14, gameChar_y-2);
    vertex(gameChar_x-11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x-13, gameChar_y-3);
    vertex(gameChar_x-15, gameChar_y-3);
    vertex(gameChar_x-12, gameChar_y-6);
    endShape();
    fill(135, 206, 250);

    //back leg
    beginShape();
    vertex(gameChar_x-10.8, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-15, gameChar_y-11.2);
    bezierVertex(gameChar_x-16, gameChar_y-13.1, gameChar_x-17, gameChar_y-15.2, gameChar_x-15, gameChar_y-17.2);
    bezierVertex(gameChar_x-14, gameChar_y-19, gameChar_x-11, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    bezierVertex(gameChar_x-10, gameChar_y-17, gameChar_x-10, gameChar_y-14, gameChar_x-8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-21, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    endShape();
    
    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x+36, gameChar_y-0.86);
    bezierVertex(gameChar_x+40, gameChar_y-1.86, gameChar_x+42, gameChar_y-8.86, gameChar_x+39, gameChar_y-2.86);
    bezierVertex(gameChar_x+41, gameChar_y-8.61, gameChar_x+37, gameChar_y-11.61, gameChar_x+40, gameChar_y-16.61);
    bezierVertex(gameChar_x+36, gameChar_y-15.61, gameChar_x+34, gameChar_y-10.61, gameChar_x+33, gameChar_y-5.61);
    bezierVertex(gameChar_x+33, gameChar_y-3.61, gameChar_x+34, gameChar_y-2.61, gameChar_x+36, gameChar_y-0.86);
    endShape();
    
    //mouth
    beginShape();
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-25, gameChar_y-48.25);
    vertex(gameChar_x-19, gameChar_y-47.25);
    vertex(gameChar_x-23, gameChar_y-45.25);
    bezierVertex(gameChar_x-25.5, gameChar_y-46.11, gameChar_x-25.5, gameChar_y-48.11, gameChar_x-25.5, gameChar_y-48.11);
    endShape();
    
    // breathing fire from mouth
    beginShape();
    fill(255, 215, 0);
    stroke(255, 0, 0);
    strokeWeight(1.5);
    vertex(gameChar_x-27, gameChar_y-48.2);
    vertex(gameChar_x-33, gameChar_y-49.2);
    bezierVertex(gameChar_x-34.4, gameChar_y-51.2, gameChar_x-28, gameChar_y-53.2, gameChar_x-34, gameChar_y-55.2); 
    bezierVertex(gameChar_x-37, gameChar_y-57.2, gameChar_x-44, gameChar_y-56.2, gameChar_x-39, gameChar_y-52.2);
    bezierVertex(gameChar_x-38, gameChar_y-51.2, gameChar_x-42, gameChar_y-50.2, gameChar_x-47, gameChar_y-55.2);
    bezierVertex(gameChar_x-50, gameChar_y-58.2, gameChar_x-53, gameChar_y-55.2, gameChar_x-49, gameChar_y-47);
    bezierVertex(gameChar_x-44, gameChar_y-45.2, gameChar_x-39, gameChar_y-44.2, gameChar_x-42, gameChar_y-48.2);
    bezierVertex(gameChar_x-36, gameChar_y-45.2, gameChar_x-31, gameChar_y-44.2, gameChar_x-27, gameChar_y-48.2);
    endShape();

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
          
    fill(135, 206, 250);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4);
    bezierVertex(gameChar_x+16, gameChar_y-80.4, gameChar_x+7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x-4, gameChar_y-60, gameChar_x-4, gameChar_y-50, gameChar_x+2, gameChar_y-41);
    bezierVertex(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x-2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x-3, gameChar_y-32);
    vertex(gameChar_x-1, gameChar_y-29);
    vertex(gameChar_x-5, gameChar_y-27);
    vertex(gameChar_x-3, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-21);
    bezierVertex(gameChar_x-13, gameChar_y-21.25, gameChar_x-16, gameChar_y-20.25, gameChar_x-35, gameChar_y+3);
    bezierVertex(gameChar_x-23, gameChar_y-2.25, gameChar_x-15, gameChar_y-11, gameChar_x-5, gameChar_y-12);
    vertex(gameChar_x+1, gameChar_y-6);
    vertex(gameChar_x+1, gameChar_y-3);
    vertex(gameChar_x+9, gameChar_y-2);
    bezierVertex(gameChar_x+9, gameChar_y-4, gameChar_x+10, gameChar_y-4, gameChar_x+12, gameChar_y-6); 

    // toes
    vertex(gameChar_x+8, gameChar_y-9);
    bezierVertex(gameChar_x+9, gameChar_y-13, gameChar_x+12, gameChar_y-15, gameChar_x+7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x+12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4)
    bezierVertex(gameChar_x+23, gameChar_y-52, gameChar_x+27, gameChar_y-49, gameChar_x+25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(135, 206, 250);
    vertex(gameChar_x+21, gameChar_y-54);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+23, gameChar_y-44.74, gameChar_x+19, gameChar_y-43, gameChar_x+15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    //vertex(21, 291.5);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+21, gameChar_y-44, gameChar_x+17, gameChar_y-41, gameChar_x+12, gameChar_y-40);
    bezierVertex(gameChar_x+11, gameChar_y-39, gameChar_x+16, gameChar_y-34, gameChar_x+13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(135, 206, 250);
    noStroke();
    vertex(gameChar_x+12.8, gameChar_y-36);
    bezierVertex(gameChar_x+14, gameChar_y-33, gameChar_x+14, gameChar_y-31, gameChar_x+13, gameChar_y-27);
    vertex(gameChar_x+8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(135, 206, 250);
    vertex(gameChar_x+13, gameChar_y-27);
    bezierVertex(gameChar_x+16, gameChar_y-25, gameChar_x+17, gameChar_y-26, gameChar_x+22, gameChar_y-18);
    vertex(gameChar_x+20, gameChar_y-18);
    vertex(gameChar_x+19, gameChar_y-15);
    vertex(gameChar_x+18, gameChar_y-17);
    vertex(gameChar_x+17, gameChar_y-16);
    bezierVertex(gameChar_x+13, gameChar_y-18, gameChar_x+9, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x+9, gameChar_y-2);
    vertex(gameChar_x+12, gameChar_y-1);
    vertex(gameChar_x+10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x+11, gameChar_y-3);
    vertex(gameChar_x+14, gameChar_y-2);
    vertex(gameChar_x+11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x+13, gameChar_y-3);
    vertex(gameChar_x+15, gameChar_y-3);
    vertex(gameChar_x+12, gameChar_y-6);
    endShape();
    fill(255, 69, 0);

    //back leg
    beginShape();
    vertex(gameChar_x+10.8, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+15, gameChar_y-11.2);
    bezierVertex(gameChar_x+16, gameChar_y-13.1, gameChar_x+17, gameChar_y-15.2, gameChar_x+15, gameChar_y-17.2);
    bezierVertex(gameChar_x+14, gameChar_y-19, gameChar_x+11, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    bezierVertex(gameChar_x+10, gameChar_y-17, gameChar_x+10, gameChar_y-14, gameChar_x+8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+21, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    endShape();

    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x-36, gameChar_y-0.86);
    bezierVertex(gameChar_x-40, gameChar_y-1.86, gameChar_x-42, gameChar_y-8.86, gameChar_x-39, gameChar_y-2.86);
    bezierVertex(gameChar_x-41, gameChar_y-8.61, gameChar_x-37, gameChar_y-11.61, gameChar_x-40, gameChar_y-16.61);
    bezierVertex(gameChar_x-36, gameChar_y-15.61, gameChar_x-34, gameChar_y-10.61, gameChar_x-33, gameChar_y-5.61);
    bezierVertex(gameChar_x-33, gameChar_y-3.61, gameChar_x-34, gameChar_y-2.61, gameChar_x-36, gameChar_y-0.86);
    endShape();
    
    // mouth
    beginShape();
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x+25, gameChar_y-48.25);
    vertex(gameChar_x+19, gameChar_y-47.25);
    vertex(gameChar_x+23, gameChar_y-45.25);
    bezierVertex(gameChar_x+25.5, gameChar_y-46.11, gameChar_x+25.5, gameChar_y-48.11, gameChar_x+25.5, gameChar_y-48.11);
    endShape();
    
    // breathing fire from mouth
    beginShape();
    fill(255, 215, 0);
    stroke(255, 0, 0);
    strokeWeight(1.5);
    vertex(gameChar_x+27, gameChar_y-48.2);
    vertex(gameChar_x+33, gameChar_y-49.2);
    bezierVertex(gameChar_x+34.4, gameChar_y-51.2, gameChar_x+28, gameChar_y-53.2, gameChar_x+34, gameChar_y-55.2); 
    bezierVertex(gameChar_x+37, gameChar_y-57.2, gameChar_x+44, gameChar_y-56.2, gameChar_x+39, gameChar_y-52.2);
    bezierVertex(gameChar_x+38, gameChar_y-51.2, gameChar_x+42, gameChar_y-50.2, gameChar_x+47, gameChar_y-55.2);
    bezierVertex(gameChar_x+50, gameChar_y-58.2, gameChar_x+53, gameChar_y-55.2, gameChar_x+49, gameChar_y-47);
    bezierVertex(gameChar_x+44, gameChar_y-45.2, gameChar_x+39, gameChar_y-44.2, gameChar_x+42, gameChar_y-48.2);
    bezierVertex(gameChar_x+36, gameChar_y-45.2, gameChar_x+31, gameChar_y-44.2, gameChar_x+27, gameChar_y-48.2);
    endShape();
        
	}
	else if(isLeft)
	{
    // add your walking left code
        
    fill(135, 206, 250);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4);
    bezierVertex(gameChar_x-16, gameChar_y-80.4, gameChar_x-7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x+4, gameChar_y-60, gameChar_x+4, gameChar_y-50, gameChar_x-2, gameChar_y-41);
    bezierVertex(gameChar_x-3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x+2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x+3, gameChar_y-32);
    vertex(gameChar_x+1, gameChar_y-29);
    vertex(gameChar_x+5, gameChar_y-27);
    vertex(gameChar_x+3, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-21);
    bezierVertex(gameChar_x+12, gameChar_y-22, gameChar_x+22, gameChar_y-27, gameChar_x+27, gameChar_y-36);
    bezierVertex(gameChar_x+25, gameChar_y-29, gameChar_x+20, gameChar_y-17, gameChar_x+2, gameChar_y-10);
    vertex(gameChar_x-1, gameChar_y-6);
    vertex(gameChar_x-1, gameChar_y-3);
    vertex(gameChar_x-9, gameChar_y-2);
    bezierVertex(gameChar_x-9, gameChar_y-4, gameChar_x-10, gameChar_y-4, gameChar_x-12, gameChar_y-6); // toes
    vertex(gameChar_x-8, gameChar_y-9);
    bezierVertex(gameChar_x-9, gameChar_y-13, gameChar_x-12, gameChar_y-15, gameChar_x-7, gameChar_y-20);
    endShape();

     //eyes
    fill(0);
    ellipse(gameChar_x-12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x-21, gameChar_y-53.4)
    bezierVertex(gameChar_x-23, gameChar_y-52, gameChar_x-27, gameChar_y-49, gameChar_x-25, gameChar_y-46);
    endShape();
    beginShape();
    noStroke();
    fill(135, 206, 250);
    vertex(gameChar_x-21, gameChar_y-54);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-23, gameChar_y-44.74, gameChar_x-19, gameChar_y-43, gameChar_x-15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x-25, gameChar_y-46);
    bezierVertex(gameChar_x-21, gameChar_y-44, gameChar_x-17, gameChar_y-41, gameChar_x-12, gameChar_y-40);
    bezierVertex(gameChar_x-11, gameChar_y-39, gameChar_x-16, gameChar_y-34, gameChar_x-13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(135, 206, 250);
    noStroke();
    vertex(gameChar_x-12.8, gameChar_y-36);
    bezierVertex(gameChar_x-14, gameChar_y-33, gameChar_x-14, gameChar_y-31, gameChar_x-13, gameChar_y-27);
    vertex(gameChar_x-8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(135, 206, 250);
    vertex(gameChar_x-13, gameChar_y-27);
    bezierVertex(gameChar_x-16, gameChar_y-25, gameChar_x-17, gameChar_y-26, gameChar_x-22, gameChar_y-18);
    vertex(gameChar_x-20, gameChar_y-18);
    vertex(gameChar_x-19, gameChar_y-15);
    vertex(gameChar_x-18, gameChar_y-17);
    vertex(gameChar_x-17, gameChar_y-16);
    bezierVertex(gameChar_x-13, gameChar_y-18, gameChar_x-9, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x-9, gameChar_y-2);
    vertex(gameChar_x-12, gameChar_y-1);
    vertex(gameChar_x-10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x-11, gameChar_y-3);
    vertex(gameChar_x-14, gameChar_y-2);
    vertex(gameChar_x-11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x-13, gameChar_y-3);
    vertex(gameChar_x-15, gameChar_y-3);
    vertex(gameChar_x-12, gameChar_y-6);
    endShape();
    fill(135, 206, 250);

    //back leg
    beginShape();
    vertex(gameChar_x-10.8, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-15, gameChar_y-11.2);
    bezierVertex(gameChar_x-16, gameChar_y-13.1, gameChar_x-17, gameChar_y-15.2, gameChar_x-15, gameChar_y-17.2);
    bezierVertex(gameChar_x-14, gameChar_y-19, gameChar_x-11, gameChar_y-21, gameChar_x-8, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-20);
    bezierVertex(gameChar_x-10, gameChar_y-17, gameChar_x-10, gameChar_y-14, gameChar_x-8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x-19, gameChar_y-9.2);
    vertex(gameChar_x-21, gameChar_y-7.2);
    vertex(gameChar_x-18, gameChar_y-7.2);
    endShape();
    
     // FIRE ON THE TAIL
    fill(220,20,60);
    beginShape();
    vertex(gameChar_x+25, gameChar_y-38.2);
    bezierVertex(gameChar_x+24, gameChar_y-44.2, gameChar_x+24, gameChar_y-46.2, gameChar_x+27, gameChar_y-48.2);
    bezierVertex(gameChar_x+28, gameChar_y-51.2, gameChar_x+29, gameChar_y-54.2, gameChar_x+26, gameChar_y-57.2);
    bezierVertex(gameChar_x+31, gameChar_y-55.2, gameChar_x+32, gameChar_y-49.2, gameChar_x+31, gameChar_y-41.2);
    bezierVertex(gameChar_x+30, gameChar_y-39.2, gameChar_x+29, gameChar_y-37.2, gameChar_x+25, gameChar_y-38.2);
    endShape();
    noFill();
    
    // mouth
    beginShape();
    noFill();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-25, gameChar_y-46.25);
    vertex(gameChar_x-14, gameChar_y-45.25);
    endShape();

	}
	else if(isRight)
	{
		// add your walking right code
    
    fill(135, 206, 250);
    //noFill();
    stroke(5);
    strokeWeight(0.5);
    //head
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4);
    bezierVertex(gameChar_x+16, gameChar_y-80.4, gameChar_x+7, gameChar_y-72.4, gameChar_x, gameChar_y-66.4);
    bezierVertex(gameChar_x-4, gameChar_y-60, gameChar_x-4, gameChar_y-50, gameChar_x+2, gameChar_y-41);
    bezierVertex(gameChar_x+3, gameChar_y-40, gameChar_x, gameChar_y-39, gameChar_x-2, gameChar_y-38);
    vertex(gameChar_x, gameChar_y-34);
    vertex(gameChar_x-3, gameChar_y-32);
    vertex(gameChar_x-1, gameChar_y-29);
    vertex(gameChar_x-5, gameChar_y-27);
    vertex(gameChar_x-3, gameChar_y-24);
    vertex(gameChar_x-7, gameChar_y-21);
    bezierVertex(gameChar_x-12, gameChar_y-22, gameChar_x-22, gameChar_y-27, gameChar_x-27, gameChar_y-36);
    bezierVertex(gameChar_x-25, gameChar_y-29, gameChar_x-20, gameChar_y-17, gameChar_x-2, gameChar_y-10);
    vertex(gameChar_x+1, gameChar_y-6);
    vertex(gameChar_x+1, gameChar_y-3);
    vertex(gameChar_x+9, gameChar_y-2);
    bezierVertex(gameChar_x+9, gameChar_y-4, gameChar_x+10, gameChar_y-4, gameChar_x+12, gameChar_y-6); 

    // toes
    vertex(gameChar_x+8, gameChar_y-9);
    bezierVertex(gameChar_x+9, gameChar_y-13, gameChar_x+12, gameChar_y-15, gameChar_x+7, gameChar_y-20);
    endShape();

    //eyes
    fill(0);
    ellipse(gameChar_x+12, gameChar_y-61, 4, 8);
    noFill();
    fill(255, 69, 0);

    // mouth
    beginShape();
    vertex(gameChar_x+21, gameChar_y-53.4)
    bezierVertex(gameChar_x+23, gameChar_y-52, gameChar_x+27, gameChar_y-49, gameChar_x+25, gameChar_y-46);
    endShape();
    
    // cover the missing shape
    beginShape();
    noStroke();
    fill(135, 206, 250);
    vertex(gameChar_x+21, gameChar_y-54);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+23, gameChar_y-44.74, gameChar_x+19, gameChar_y-43, gameChar_x+15.5, gameChar_y-41);
    endShape();

    // mouth -> down
    beginShape();
    fill(255);
    stroke(0);
    vertex(gameChar_x+25, gameChar_y-46);
    bezierVertex(gameChar_x+21, gameChar_y-44, gameChar_x+17, gameChar_y-41, gameChar_x+12, gameChar_y-40);
    bezierVertex(gameChar_x+11, gameChar_y-39, gameChar_x+16, gameChar_y-34, gameChar_x+13, gameChar_y-27);
    endShape();

    // cover the shape
    beginShape();
    fill(135, 206, 250);
    noStroke();
    vertex(gameChar_x+12.8, gameChar_y-36);
    bezierVertex(gameChar_x+14, gameChar_y-33, gameChar_x+14, gameChar_y-31, gameChar_x+13, gameChar_y-27);
    vertex(gameChar_x+8.5, gameChar_y-24.1);
    endShape();
    
    // hand
    beginShape();
    stroke(0);
    fill(135, 206, 250);
    vertex(gameChar_x+13, gameChar_y-27);
    bezierVertex(gameChar_x+16, gameChar_y-25, gameChar_x+17, gameChar_y-26, gameChar_x+22, gameChar_y-18);
    vertex(gameChar_x+20, gameChar_y-18);
    vertex(gameChar_x+19, gameChar_y-15);
    vertex(gameChar_x+18, gameChar_y-17);
    vertex(gameChar_x+17, gameChar_y-16);
    bezierVertex(gameChar_x+13, gameChar_y-18, gameChar_x+9, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    endShape();

    // connnector from hand to leg
    beginShape();
    vertex(gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    endShape();
    noFill();

    // nails (1st nail)
    beginShape();
    vertex(gameChar_x+9, gameChar_y-2);
    vertex(gameChar_x+12, gameChar_y-1);
    vertex(gameChar_x+10, gameChar_y-4);
    endShape();
    // second nail
    beginShape();
    vertex(gameChar_x+11, gameChar_y-3);
    vertex(gameChar_x+14, gameChar_y-2);
    vertex(gameChar_x+11, gameChar_y-5);
    endShape();
    // third nail
    beginShape();
    vertex(gameChar_x+13, gameChar_y-3);
    vertex(gameChar_x+15, gameChar_y-3);
    vertex(gameChar_x+12, gameChar_y-6);
    endShape();
    fill(135, 206, 250);

    //back leg
    beginShape();
    vertex(gameChar_x+10.8, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+15, gameChar_y-11.2);
    bezierVertex(gameChar_x+16, gameChar_y-13.1, gameChar_x+17, gameChar_y-15.2, gameChar_x+15, gameChar_y-17.2);
    bezierVertex(gameChar_x+14, gameChar_y-19, gameChar_x+11, gameChar_y-21, gameChar_x+8, gameChar_y-24);
    vertex(gameChar_x+7, gameChar_y-20);
    bezierVertex(gameChar_x+10, gameChar_y-17, gameChar_x+10, gameChar_y-14, gameChar_x+8.1, gameChar_y-9);
    endShape();
    noFill();
    //back leg nail
    beginShape();
    vertex(gameChar_x+19, gameChar_y-9.2);
    vertex(gameChar_x+21, gameChar_y-7.2);
    vertex(gameChar_x+18, gameChar_y-7.2);
    endShape();
    
     // FIRE ON THE TAIL
    fill(220,20,60);
    beginShape();
    vertex(gameChar_x-25, gameChar_y-38.2);
    bezierVertex(gameChar_x-24, gameChar_y-44.2, gameChar_x-24, gameChar_y-46.2, gameChar_x-27, gameChar_y-48.2);
    bezierVertex(gameChar_x-28, gameChar_y-51.2, gameChar_x-29, gameChar_y-54.2, gameChar_x-26, gameChar_y-57.2);
    bezierVertex(gameChar_x-31, gameChar_y-55.2, gameChar_x-32, gameChar_y-49.2, gameChar_x-31, gameChar_y-41.2);
    bezierVertex(gameChar_x-30, gameChar_y-39.2, gameChar_x-29, gameChar_y-37.2, gameChar_x-25, gameChar_y-38.2);
    endShape();
    noFill();
    
     // mouth
    beginShape();
    noFill();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x+25, gameChar_y-46.25);
    vertex(gameChar_x+14, gameChar_y-45.25);
    endShape();

	}
	else if(isFalling || isPlummeting)
	{
	// add your jumping facing forwards code
    
     // tail
    beginShape();
    fill(135, 206, 250);
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-15, gameChar_y-18);
    bezierVertex(gameChar_x-27, gameChar_y-19, gameChar_x-23, gameChar_y-25, gameChar_x-34, gameChar_y-44);
    bezierVertex(gameChar_x-37, gameChar_y-36, gameChar_x-33, gameChar_y-19, gameChar_x-25, gameChar_y-12);
    bezierVertex(gameChar_x-22, gameChar_y-10, gameChar_x-18, gameChar_y-7, gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-16, gameChar_y-12, gameChar_x-17, gameChar_y-23, gameChar_x-15, gameChar_y-18);
    endShape();
    
    // fire on the tail
    beginShape();
    fill(255, 215, 0);
    stroke(255, 69, 0);
    strokeWeight(1);
    vertex(gameChar_x-35, gameChar_y-46);
    bezierVertex(gameChar_x-38, gameChar_y-48, gameChar_x-39, gameChar_y-51, gameChar_x-37, gameChar_y-56);
    bezierVertex(gameChar_x-36, gameChar_y-59, gameChar_x-34, gameChar_y-63, gameChar_x-37, gameChar_y-65);
    bezierVertex(gameChar_x-32, gameChar_y-62, gameChar_x-31, gameChar_y-57, gameChar_x-30, gameChar_y-51);
    bezierVertex(gameChar_x-30, gameChar_y-48, gameChar_x-30, gameChar_y-45, gameChar_x-35, gameChar_y-46);
    endShape();
    
    // left side of body
    beginShape();
    fill(135, 206, 250); 
    stroke(10);
    strokeWeight(0.5);
    vertex(gameChar_x-6.5, gameChar_y-48);
    bezierVertex(gameChar_x-13, gameChar_y-46, gameChar_x-15, gameChar_y-37, gameChar_x-21, gameChar_y-27);
    vertex(gameChar_x-21,gameChar_y-27);
    vertex(gameChar_x-21.5, gameChar_y-23);
    vertex(gameChar_x-20, gameChar_y-25);
    vertex(gameChar_x-19, gameChar_y-24);
    vertex(gameChar_x-18, gameChar_y-26);
    vertex(gameChar_x-16, gameChar_y-24);
    vertex(gameChar_x-16, gameChar_y-27);
    vertex(gameChar_x-13, gameChar_y-28);
    vertex(gameChar_x-13, gameChar_y-22);
    bezierVertex(gameChar_x-17, gameChar_y-20, gameChar_x-17, gameChar_y-12, gameChar_x-14, gameChar_y-10);
    vertex(gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-12, gameChar_y-8, gameChar_x-22, gameChar_y-4, gameChar_x-8, gameChar_y-6);
    bezierVertex(gameChar_x-3, gameChar_y-8, gameChar_x-5, gameChar_y-12, gameChar_x-5, gameChar_y-11);
    vertex(gameChar_x, gameChar_y-48);
    endShape();
    
    // right side of body
    beginShape();
    stroke(10);
    strokeWeight(0.5);
    vertex(gameChar_x+9, gameChar_y-48);
    bezierVertex(gameChar_x+13, gameChar_y-47, gameChar_x+20, gameChar_y-33, gameChar_x+20, gameChar_y-29);
    vertex(gameChar_x+20, gameChar_y-24);
    vertex(gameChar_x+18, gameChar_y-26);
    vertex(gameChar_x+17, gameChar_y-24);
    vertex(gameChar_x+15, gameChar_y-27);
    vertex(gameChar_x+15, gameChar_y-24);
    vertex(gameChar_x+13, gameChar_y-28);
    vertex(gameChar_x+11, gameChar_y-29);
    vertex(gameChar_x+11, gameChar_y-23);
    bezierVertex(gameChar_x+13, gameChar_y-20, gameChar_x+17, gameChar_y-19, gameChar_x+11, gameChar_y-11);
    bezierVertex(gameChar_x+13, gameChar_y-10, gameChar_x+19, gameChar_y-5, gameChar_x+8, gameChar_y-6);
    bezierVertex(gameChar_x+5, gameChar_y-8, gameChar_x+3, gameChar_y-10, gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+1, gameChar_y-48);
    endShape();

    // eggbody -> top half
    beginShape();
    fill(240, 230, 140);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-5, gameChar_y-42, gameChar_x+1, gameChar_y-64, gameChar_x+8, gameChar_y-23);
    endShape();
    //eggbody -> bottom half
    fill(240, 230, 140);
    beginShape();
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-12, gameChar_y-7, gameChar_x+9, gameChar_y-7, gameChar_x+8, gameChar_y-23);
    endShape();
  
    // head
    beginShape();
    fill(135, 206, 250);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-63.4);
    bezierVertex(gameChar_x-7, gameChar_y-72.4, gameChar_x+8, gameChar_y-72.4, gameChar_x+11, gameChar_y-64);
    vertex(gameChar_x+12, gameChar_y-53);
    bezierVertex(gameChar_x+8, gameChar_y-42, gameChar_x-8, gameChar_y-42, gameChar_x-12, gameChar_y-53);
    vertex(gameChar_x-9.7, gameChar_y-64);
    endShape();
    
    //eyes
    fill(0);
    ellipse(gameChar_x+7, gameChar_y-59.61, 2, 5);
    ellipse(gameChar_x-6, gameChar_y-60, 2, 5);
    noFill();
   
    //mouth
    noFill();
    beginShape();
    stroke(1);
    strokeWeight(0.5);
    vertex(gameChar_x-7, gameChar_y-54);
    vertex(gameChar_x-7, gameChar_y-52);
    vertex(gameChar_x, gameChar_y-50);
    vertex(gameChar_x+7, gameChar_y-52);
    vertex(gameChar_x+7, gameChar_y-54);
    endShape();
    line(gameChar_x-2, gameChar_y-53.5, gameChar_x-1, gameChar_y-53);
    line(gameChar_x+2, gameChar_y-53, gameChar_x+3.3, gameChar_y-54);
    
	}
	else
	{
		// add your standing front facing code
        
    // fire
    fill(255, 69, 0);
    stroke(0);
    strokeWeight(0.5);
    beginShape();
    vertex(gameChar_x-11, gameChar_y-44);
    bezierVertex(gameChar_x-12, gameChar_y-52, gameChar_x-14, gameChar_y-50, gameChar_x-14, gameChar_y-47);
    bezierVertex(gameChar_x-15, gameChar_y-49, gameChar_x-15, gameChar_y-52, gameChar_x-18, gameChar_y-53);
    bezierVertex(gameChar_x-18, gameChar_y-51, gameChar_x-17, gameChar_y-48, gameChar_x-18, gameChar_y-46);
    bezierVertex(gameChar_x-20, gameChar_y-49, gameChar_x-21, gameChar_y-50, gameChar_x-25, gameChar_y-52);
    bezierVertex(gameChar_x-25, gameChar_y-50, gameChar_x-26, gameChar_y-47, gameChar_x-23, gameChar_y-43);
    bezierVertex(gameChar_x-26, gameChar_y-45, gameChar_x-28, gameChar_y-46, gameChar_x-23, gameChar_y-36);
    bezierVertex(gameChar_x-24, gameChar_y-38, gameChar_x-26, gameChar_y-35, gameChar_x-19, gameChar_y-31);
    endShape();

    // inside the fire
    fill(218, 165, 32);
    noStroke();
    beginShape();
    vertex(gameChar_x-17, gameChar_y-35);
    bezierVertex(gameChar_x-20, gameChar_y-40, gameChar_x-19, gameChar_y-39, gameChar_x-20, gameChar_y-44);
    bezierVertex(gameChar_x-18, gameChar_y-44, gameChar_x-19, gameChar_y-47, gameChar_x-12, gameChar_y-44);
    endShape();

    // outerbody 
    fill(135, 206, 250); 
    stroke(10);

    // left side of body
    beginShape();
    vertex(gameChar_x-6.5, gameChar_y-48);
    bezierVertex(gameChar_x-13, gameChar_y-46, gameChar_x-15, gameChar_y-37, gameChar_x-21, gameChar_y-27);
    vertex(gameChar_x-21,gameChar_y-27);
    vertex(gameChar_x-21.5, gameChar_y-23);
    vertex(gameChar_x-20, gameChar_y-25);
    vertex(gameChar_x-19, gameChar_y-24);
    vertex(gameChar_x-18, gameChar_y-26);
    vertex(gameChar_x-16, gameChar_y-24);
    vertex(gameChar_x-16, gameChar_y-27);
    vertex(gameChar_x-13, gameChar_y-28);
    vertex(gameChar_x-13, gameChar_y-22);
    bezierVertex(gameChar_x-17, gameChar_y-20, gameChar_x-17, gameChar_y-12, gameChar_x-14, gameChar_y-10);
    vertex(gameChar_x-14, gameChar_y-10);
    bezierVertex(gameChar_x-12, gameChar_y-8, gameChar_x-22, gameChar_y-4, gameChar_x-8, gameChar_y-6);
    bezierVertex(gameChar_x-3, gameChar_y-8, gameChar_x-5, gameChar_y-12, gameChar_x-5, gameChar_y-11);
    vertex(gameChar_x, gameChar_y-48);
    endShape();

    // right side of body
    beginShape();
    vertex(gameChar_x+9, gameChar_y-48);
    bezierVertex(gameChar_x+13, gameChar_y-47, gameChar_x+20, gameChar_y-33, gameChar_x+20, gameChar_y-29);
    vertex(gameChar_x+20, gameChar_y-24);
    vertex(gameChar_x+18, gameChar_y-26);
    vertex(gameChar_x+17, gameChar_y-24);
    vertex(gameChar_x+15, gameChar_y-27);
    vertex(gameChar_x+15, gameChar_y-24);
    vertex(gameChar_x+13, gameChar_y-28);
    vertex(gameChar_x+11, gameChar_y-29);
    vertex(gameChar_x+11, gameChar_y-23);
    bezierVertex(gameChar_x+13, gameChar_y-20, gameChar_x+17, gameChar_y-19, gameChar_x+11, gameChar_y-11);
    bezierVertex(gameChar_x+13, gameChar_y-10, gameChar_x+19, gameChar_y-5, gameChar_x+8, gameChar_y-6);
    bezierVertex(gameChar_x+5, gameChar_y-8, gameChar_x+3, gameChar_y-10, gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+4, gameChar_y-13);
    vertex(gameChar_x+1, gameChar_y-48);
    endShape();

    // eggbody
    beginShape();
    fill(240, 230, 140);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-5, gameChar_y-42, gameChar_x+1, gameChar_y-64, gameChar_x+8, gameChar_y-23);
    endShape();
    fill(240, 230, 140);
    beginShape();
    vertex(gameChar_x-10, gameChar_y-23);
    bezierVertex(gameChar_x-12, gameChar_y-7, gameChar_x+9, gameChar_y-7, gameChar_x+8, gameChar_y-23);
    endShape();
    
    // head
    beginShape();
    fill(135, 206, 250);
    stroke(0);
    strokeWeight(0.5);
    vertex(gameChar_x-10, gameChar_y-63.4);
    bezierVertex(gameChar_x-7, gameChar_y-72.4, gameChar_x+8, gameChar_y-72.4, gameChar_x+11, gameChar_y-64);
    vertex(gameChar_x+12, gameChar_y-53);
    bezierVertex(gameChar_x+8, gameChar_y-42, gameChar_x-8, gameChar_y-42, gameChar_x-12, gameChar_y-53);
    vertex(gameChar_x-9.7, gameChar_y-64);
    endShape();
    
    // eyes
    fill(0);
    ellipse(gameChar_x+7, gameChar_y-59.61, 2, 5);
    ellipse(gameChar_x-6, gameChar_y-60, 2, 5);
    noFill();
   
    //mouth
    noFill();
    beginShape();
    vertex(gameChar_x-7, gameChar_y-54);
    vertex(gameChar_x-7, gameChar_y-52);
    vertex(gameChar_x, gameChar_y-50);
    vertex(gameChar_x+7, gameChar_y-52);
    vertex(gameChar_x+7, gameChar_y-54);
    endShape();
    line(gameChar_x-2, gameChar_y-53.5, gameChar_x-1, gameChar_y-53);
    line(gameChar_x+2, gameChar_y-53, gameChar_x+3.3, gameChar_y-54);
	}
}

function drawClouds() // underworld
{
    for(let i = 0; i < clouds.length; i++)
    // added in the "*clouds[i].size to enable the adjustabality of the size of the clouds in the setup function 
    {
        fill(95, 158, 160);
        rect(clouds[i].x-56*clouds[i].size, clouds[i].y-20*clouds[i].size, 170*clouds[i].size, 80*clouds[i].size, 50);
        ellipse(clouds[i].x+35*clouds[i].size, clouds[i].y-20*clouds[i].size, 100*clouds[i].size, 100*clouds[i].size);
        noStroke;
    }
}
function drawCloudstwo() // heaven
{
    for(let i = 0; i < clouds.length; i++)
    // added in the "*clouds[i].size to enable the adjustabality of the size of the clouds in the setup function 
    {
        fill(224, 255, 255);
        rect(clouds[i].x-56*clouds[i].size, clouds[i].y-20*clouds[i].size, 170*clouds[i].size, 80*clouds[i].size, 50);
        ellipse(clouds[i].x+35*clouds[i].size, clouds[i].y-20*clouds[i].size, 100*clouds[i].size, 100*clouds[i].size);
        noStroke;
    }
}

function drawMountains() // underworld
{
     // created a mountain to look like in a 3D effect by creating two separate triangles side by side of each other and adjusting the gradient of each triangle to give it that shadow effect
     for(let i = 0; i < mountains.length; i++)
     {
        fill(112, 128, 144, 300);
        triangle(mountains[i].x+137, mountains[i].y-202*mountains[i].size, mountains[i].x, mountains[i].y, mountains[i].x+260, mountains[i].y);
        // shadow triangle to give it that 3D effect
        fill(119, 136, 153, 250);
        triangle(mountains[i].x+137, mountains[i].y-202*mountains[i].size, mountains[i].x+136, mountains[i].y, mountains[i].x+260, mountains[i].y);
        noStroke();
    }
}
function drawMountainstwo() // heaven
{
      // created a mountain to look like in a 3D effect by creating two separate triangles side by side of each other and adjusting the gradient of each triangle to give it that shadow effect
      for(let i = 0; i < mountains.length; i++)
      {
         fill(245,222, 179, 300);
         triangle(mountains[i].x+137, mountains[i].y-202*mountains[i].size, mountains[i].x, mountains[i].y, mountains[i].x+260, mountains[i].y);
         // shadow triangle to give it that 3D effect
         fill(255, 248, 220, 200);
         triangle(mountains[i].x+137, mountains[i].y-202*mountains[i].size, mountains[i].x+136, mountains[i].y, mountains[i].x+260, mountains[i].y);
         noStroke();
     }
}

function drawTree() // underworld
{
    for (let i = 0; i < tree_x.length; i++ )
    { // created a for loop to loop over the trees and display the number of trees indicated
        fill(139,69,19);
        rect(tree_x[i]-50, tree_y-50, 33, 103);
        fill(85, 107, 47);
        ellipse(tree_x[i]-33, tree_y-70, 100, 100);
        ellipse(tree_x[i]-73, tree_y-96, 50, 50);
        ellipse(tree_x[i]-40, tree_y-117, 50, 50);
        ellipse(tree_x[i]+2, tree_y-107, 50, 50);
        ellipse(tree_x[i]-75, tree_y-51, 50, 50);
        ellipse(tree_x[i]+15, tree_y-67, 50, 50);
        ellipse(tree_x[i]-8, tree_y-37, 50, 50);
        noStroke();
        fill(255);
    }
}
function drawTreetwo() // heaven
{
    for (let i = 0; i < tree_x.length; i++ )
    { // created a for loop to loop over the trees and display the number of trees indicated
        fill(222, 184, 135);
        rect(tree_x[i]-50, tree_y-50, 33, 103);
        fill(240, 255, 240);
        ellipse(tree_x[i]-33, tree_y-70, 100, 100);
        ellipse(tree_x[i]-73, tree_y-96, 50, 50);
        ellipse(tree_x[i]-40, tree_y-117, 50, 50);
        ellipse(tree_x[i]+2, tree_y-107, 50, 50);
        ellipse(tree_x[i]-75, tree_y-51, 50, 50);
        ellipse(tree_x[i]+15, tree_y-67, 50, 50);
        ellipse(tree_x[i]-8, tree_y-37, 50, 50);
        noStroke();
        fill(255);
    }
}

function drawMoon()
{
    // used ellipse to create the shape of the moon and used additional ellipses to create the inner effect on the moon
    fill(169, 169, 169);
    ellipse(moon.x, moon.y+11, 90, 90); // main ellipse for the moon
    fill(105, 105, 105);
    ellipse(moon.x-10, moon.y-20, 10, 10); // additional ellipse for the moon to give that flickering effect
    ellipse(moon.x-10, moon.y, 10, 10);
    // shining on the moon, gives the flickering effect on the moon by creating numerous ellipses around the main ellipse in a random order to give that flickering effect
    fill(192, 192, 192, 50);
    r = random(80, 120);
    ellipse(moon.x, moon.y+11, r, r);
}

function drawSword(t_sword)// underworld
{
    if (t_sword.isFound == false)
    {
     // sword
    fill(176, 196, 222);
    rect(t_sword.x+10, t_sword.y+10, 10, 80);
    triangle(t_sword.x+9, t_sword.y+90, t_sword.x+15, t_sword.y+102, t_sword.x+20.5, t_sword.y+90);
    quad(t_sword.x-5, t_sword.y+38, t_sword.x+15, t_sword.y+45, t_sword.x+35, t_sword.y+38, t_sword.x+15, t_sword.y+28);
    ellipse(t_sword.x+15, t_sword.y+9, 15, 15);

    // platform for the sword
    fill(188, 143, 143);
    rect(t_sword.x-36, t_sword.y+102, 100, 30);
    rect(t_sword.x-15, t_sword.y+82, 100-40, 30);
    rect(t_sword.x-1, t_sword.y+63, 100-68, 30);
    };
}
function drawSwordtwo(t_sword)// heaven
{
    if (t_sword.isFound == false)
    {
     // sword
    fill(255, 250, 250);
    rect(t_sword.x+10, t_sword.y+10, 10, 80);
    triangle(t_sword.x+9, t_sword.y+90, t_sword.x+15, t_sword.y+102, t_sword.x+20.5, t_sword.y+90);
    quad(t_sword.x-5, t_sword.y+38, t_sword.x+15, t_sword.y+45, t_sword.x+35, t_sword.y+38, t_sword.x+15, t_sword.y+28);
    ellipse(t_sword.x+15, t_sword.y+9, 15, 15);

    // platform for the sword
    fill(188, 143, 143);
    rect(t_sword.x-36, t_sword.y+102, 100, 30);
    rect(t_sword.x-15, t_sword.y+82, 100-40, 30);
    rect(t_sword.x-1, t_sword.y+63, 100-68, 30);
    };
}

function checkSword(t_sword)
{
 // using the 'dist' function to get the character to pick up collectable item (taken from coursera)
 // game_score (taken from coursera)
 if (dist (gameChar_x, gameChar_y-50, t_sword.x, t_sword.y) < 100)
 {
     t_sword.isFound = true;
     game_score += 1;
     powerUp.play();
 }   
}

function drawCanyon(t_canyon)
{
    fill(119,136,153);
    // shape for the canyon
    rect(t_canyon.x, t_canyon.y-145, 20+(t_canyon.width/2), 150);
    fill(0);
    // drawings of the spikes inside the canyon using triangles
    triangle(t_canyon.x, t_canyon.y-65, t_canyon.x+33, t_canyon.y-72, t_canyon.x, t_canyon.y-49);
    triangle(t_canyon.x, t_canyon.y-22, t_canyon.x+45, t_canyon.y-41, t_canyon.x, t_canyon.y-11);
    triangle(t_canyon.x+20+(t_canyon.width/2), t_canyon.y-62, t_canyon.x+165-(t_canyon.width/2), t_canyon.y-78, t_canyon.x+20+(t_canyon.width/2), t_canyon.y-37);
    triangle(t_canyon.x+20+(t_canyon.width/2), t_canyon.y-27, t_canyon.x+166-(t_canyon.width/2), t_canyon.y-34, t_canyon.x+20+(t_canyon.width/2), t_canyon.y-6);
	noStroke();
	fill(255);
}

function checkCanyon(t_canyon)
{
    // code to get character to fall into canyon using collision detection method (taken from coursera)
    if (gameChar_x > t_canyon.x && gameChar_x < t_canyon.x + (t_canyon.width/2) && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
        deathSound.play();
    }
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    // drawing of flagpole
    line(flagpole.x_pos+300, floorPos_y, flagpole.x_pos+300, floorPos_y - 250);

    noStroke();
    // if character reached the flagpole, the flag will go up 

    if (flagpole.isReached)
    {
    fill(255);
    rect(flagpole.x_pos+300, floorPos_y - 250, 100, 50);
    }
    else
    {
    fill(255);
    rect(flagpole.x_pos+300, floorPos_y - 55, 100, 50);
    }
    pop();
}

function checkFlagpole()
{
    // used the 'abs' function to ensure that the result will always come out in a positive value
    var d = abs(gameChar_x - (flagpole.x_pos+300));
    if(d < 15)
    {
        flagpole.isReached = true;
        gameOver.play();
    }
}

function drawgameScore() // underworld
{
     // drawing of the game score (taken from coursera)
     fill(255);
     noStroke();
     textSize(40);
     text("score: " + game_score, 50, 50);
 
     fill(255);
     noStroke();
     text("lives: " + lives, 50, 90);
}
function drawgameScoretwo() // heaven
{
     // drawing of the game score (taken from coursera)
     fill(255, 215, 0);
     noStroke();
     textSize(40);
     text("score: " + game_score, 50, 50);
 
     fill(255, 215, 0);
     noStroke();
     text("lives: " + lives, 50, 90);
}

function drawCollectablelive()
{
    for(i=0; i < lives; i++)
    {
        beginShape();
        stroke(2);
        strokeWeight(3);
        fill(30, 144, 255);
        vertex(230+i*40, 18);
        bezierVertex(255+i*40, 36, 244+i*40, 48, 242+i*40, 52);
        bezierVertex(230+i*40, 55, 235+i*40, 60, 223+i*40, 55);
        bezierVertex(220+i*40, 55, 210+i*40, 45, 220+i*40, 38);
        bezierVertex(225+i*40, 32, 223+i*40, 26, 230+i*40, 18);
        endShape();
        noFill();
    }
}

function checkPlayerDie()
{
    // if you lose a life, it will return to the start of the game 
    if(gameChar_y > height)
    {
        lives -= 1;
        startGame();
        if(lives > 0)
        {
            startGame();
        }
    }  
}

function createPlatforms(x, y, length)
{
    // 
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            stroke(0);
            strokeWeight(3);
            fill(210, 105, 30);
            rect(this.x+50, this.y, this.length-70, 20);
        },
        checkContact: function(gameChar_x, gameChar_y)
        {
            if(gameChar_x > this.x && gameChar_x < this.x + this.length)
            {
                var d = this.y - gameChar_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function gameInteraction()
{
    if(isPlummeting)
    {
        gameChar_y+= 10;
        checkPlayerDie();
        return;
    }
    if(gameChar_y<floorPos_y)
    {
        var isContact = false;
        for(let i=0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_x, gameChar_y) == true)
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {
        gameChar_y+= 4;
        isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    if(isLeft == true)
    {
        gameChar_x-=5;
    }
    else if(isRight == true)
    {
        gameChar_x+= 5;
    }

}

function startGame()
{
    floorPos_y = height * 3/4;
    // anchor point for my game character is at the centre
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    isPlummeting = false;
    cameraPos_x = 0;
    // created an array to store the clouds to create multiple clouds and able to adjust the location and the size of the clouds respectively
    // anchor point for the clouds are in the centre
        clouds = [{
            x: 100,
            y: 100,
            size: 1, // left cloud
        },{
            x: 350,
            y: 100,
            size: 0.8, // middle cloud
        },{
            x: 650,
            y: 100,
            size: 0.6, // right cloud
    
        },{
            x: 100+800,
            y: 100,
            size: 1, // left cloud
        },{
            x: 350+800,
            y: 100,
            size: 0.8, // middle cloud
        },{
            x: 650+800,
            y: 100,
            size: 0.6, // right cloud
    
        },{
            x: 100+1500,
            y: 100,
            size: 1, // left cloud
        },{
            x: 350+1500,
            y: 100,
            size: 0.8, // middle cloud
        },{
            x: 650+1500,
            y: 100,
            size: 0.6, // right cloud
    
        }
    ];
    
    // created an array to store the mountains and able to create multiple mountains just by calling it from the setup function and able to adjust the location and the size of each of the mountain
    // the anchor point for the mountains is at the bottom left 
        mountains = [
            {
            x: 600,
            y: 432,
            size: 0.8, // right mountain
        },{
            x: 400,
            y: 432,
            size: 0.6, // left mountain
        },{
            x: 530,
            y: 432,
            size: 1,// middle mountain
        },{
            x: 600+500,
            y: 432,
            size: 0.8, // right mountain
        },{
            x: 400+500,
            y: 432,
            size: 0.6, // left mountain
        },{
            x: 530+500,
            y: 432,
            size: 1,// middle mountain
        },{
            x: 600+1500,
            y: 432,
            size: 0.8, // right mountain
        },{
            x: 400+1500,
            y: 432,
            size: 0.6, // left mountain
        },{
            x: 530+1500,
            y: 432,
            size: 1,// middle mountain
        }
    ];
        smoke = {
            x: 105,
            y: 95,
        };
        // anchor point for my collectable item which is the sword is at the top left
        sword = [{
            x: 300,
            y: 300, 
            isFound: false,
        }, {
            x: -20,
            y: 300, 
            isFound: false,
        }, {
            x: 1200,
            y: 300, 
            isFound: false,
        }, {
            x: 800,
            y: 150, 
            isFound: false, // collectable on the platform
        }, {
            x: 1800,
            y: 300, 
            isFound: false, 
        }];

        swordPlatform = {
            x: 100,
            y: 100,
        };
        // anchor point for the tree is at the the centre of the drawing
        tree_y = 379
        tree_x = [473, 800, 1000, 1400, 1600] // creating an array to store multiple tree location
        // anchor point for the moon is at the centre
        moon = {
            x: 885,
            y: 81,
        };
        // anchor point for the canyon is at the bottom left of the canyon
        canyon = [{
            x: 77,
            y: 577,
            width: 190,                    
        }, {
            x: 777,
            y: 577,
            width: 190,                    
        }, {
            x: 1420,
            y: 577,
            width: 190,                    
        }, {
            x: 1920,
            y: 577,
            width: 190,                    
        }];
    
        drippingLava = {
            x: 635,
            y: 272,
        };
       
        backgroundmount1 = {
            posX:0,
            posY:140
        };
        
        // RGB colour code for top layer
        topLayerR = 139;
        topLayerG = 0;
        topLayerB = 0;
    
        // RGB colour code for bottom layer
        bottomLayerR = 250;
        bottomLayerG = 128;
        bottomLayerB = 114;
    
        // to calculate the game score when character picks up the collectable (taken from coursera)
        game_score = 0;

        // an array to hold the platforms for the character to jump on
        platforms = [];
        platforms.push(createPlatforms(700, floorPos_y-150, 200));
        platforms.push(createPlatforms(500, floorPos_y-70, 200));
        platforms.push(createPlatforms(gameChar_x+900, floorPos_y-80, 200));
        platforms.push(createPlatforms(100, floorPos_y-100, 200));
        platforms.push(createPlatforms(1550, floorPos_y-150, 200));

        // enemies
        enemies = [];
        enemies.push(new enemy(600, floorPos_y - 10, 100));
        enemies.push(new enemy(1000, floorPos_y- 10, 100));
        enemies.push(new enemy(1700, floorPos_y- 10, 100));

        // taken from coursera
        flagpole = {isReached: false, x_pos: 2000}; 
}

function enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1; // increment

    this.update = function()
    {
        this.currentX += this.inc; // to move the enemy across the screen

        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }

    // drawing of enemy
    this.draw = function()
    {
        this.update();
        fill(255, 0, 0);
        rect(this.currentX, this.y-20, 40, -40);
        fill(0);
        rect(this.currentX+10, this.y-80, 20, 20);
        fill(255);
        rect(this.currentX+5, this.y-20, 10, 30);
        rect(this.currentX+25, this.y-20, 10, 30);

    }

    this.checkContact = function(gameChar_x, gameChar_y)
    {
        var d = dist(gameChar_x, gameChar_y, this.currentX, this.y)
        
        if(d < 20)
        {
            return true;
        }
        return false;
    
    };
}

function keyPressed()
{
    // control keys to move the character left, right and jump
    if(keyCode == 37 && flagpole.isReached == false)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39 && flagpole.isReached == false)
    {
        console.log("right arrow");
        isRight = true;
    }
    else if(keyCode == 38 && flagpole.isReached == false) 
    {
        if(gameChar_y >= floorPos_y ||  jumpOnPlatform())
        {
            console.log("up arrow");
            gameChar_y -= 150;
            jumpSound.play();
        }
    }

    // keybinds when toggling between splashscreens to enter the game
    if(keyCode == 32)
    {
        console.log("spacebar")
        selectScreen = 4;
        gamelock = true;
        drawSelectsplash();
    } 
    else if(keyCode == 13)
    {
        if(lives < 1 || flagpole.isReached == true)
        {
            selectScreen = 1;
            lives = 3;
            gamelock = false;
            startGame();
        }
    }
    else if(keyCode == 66 && !gamelock) // underworld splashscreen
    {
        console.log("b")
        selectScreen = 2;
    }
    else if(keyCode == 65 && !gamelock) 
    {
        console.log("a")
        selectScreen = 3; // heaven splashscreen
    }
    else if(keyCode == 83 && !gamelock)
    {
        console.log("s")
        selectScreen = 5; // heaven game
       gamelock = true;
    }
}

function keyReleased()
{
	// if statements to control the animation of the character when keys are released. (taken from coursera)
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = false;
    };
}

function jumpOnPlatform(){
    // to get the character to be able to jump off the platform
    for(var i = 0; i < platforms.length; i++)
    {
        if(platforms[i].checkContact(gameChar_x, gameChar_y) == true)
    {
        return true;
    }
} 
  return false;
}
