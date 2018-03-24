//NOTES TO SELF —— 6 control points with a margin multiplier of .46 or so makes nice biological blobby things. ns = 0.02 and step is 1.0 & 3 closest points
//NEW ideal is 10 control points, 0.2 margin multiplier, 3 closest points, ns 0.02, step 1.0 (or width/200);

var largePoints;

var numControlPoints,margin,marginMultiplier;
var minDist,maxDist;

var bgColor;

var controlColor;

var blobJump,numClosest;
var crossSize, crossColor, crossWeight;

var ns, step, counter, speed, ff;

///////////////////////////////////////////////////SETUP////////////////////////////////////////////////
function setup() {
	largePoints = [];
	counter = 0;
	speed = 1;

    createCanvas(200,200);
    frameRate(12);

    //GLOBAL / SKETCH VARIABLES
    bgColor = color(230);
    strokeCap(SQUARE);

    //CONTROL POINTS VARIABLES
    numControlPoints = 10;
    margin = width/5;
    minDist = width/3; 
    maxDist = width/2;
    marginMultiplier = 0.20; //very delicate, even 0.05 chance makes significant difference

    //CONTROL POINT RENDER VARIABLES
    controlColor = color(230); //lines 195
    controlColorLight = color(195);
    controlColorDark = color(230);

    //BLOB BODY VARIABLES
    blobJump = width/100 //30; //25
    numClosest = 3;

    // crossColor = color(0,255,205);
    crossColor = color(50);
    crossWeight = 0.5;
    crossSize = blobJump/1.5;

    // MISC VARIABLES
    ns = 0.0005; //noise scale
    step = width/200;
    speed = 10;
    ff = speed*60;

    // THIS CREATES THE FIRST POINT THEN MOVES ON TO RECURSIVELY GENERATING NEW ONES
    for (var i=0;i<numControlPoints;i++){ 
        if (i==0){
            // console.log("created first point");
            var p = createVector(
                        random(margin,width-margin),
                        random(margin,width-margin));
            largePoints.push(p)
        }
        else { createNextPointLarge(largePoints,minDist,maxDist); }
    }//end of creation loop

}//end setup /////////////////////////////////////////////////////////////////////////////////

function draw() {
    background(bgColor);

    ///////////////////////HOVER REVEALS LINES////////////////////////////////
    if (mouseX > 1 && mouseX < width-1 && mouseY > 1 && mouseY < height-1){
        controlColor = controlColorLight
    }
    else{ controlColor = controlColorDark;} 

    //////////////////////////DRAW CONTROL POINT LINES///////////////////////////
    incrementPoints(speed);

	//////////////////////////DRAW CONTROL POINT LINES///////////////////////////
    stroke(controlColor);
    strokeWeight(1);
    for (i=0;i<largePoints.length;i++){
        line(largePoints[i].x,largePoints[i].y,largePoints[(i+1)%largePoints.length].x,largePoints[(i+1)%largePoints.length].y);
    }

    //////////////////////////BLOB RENDER FUNCTIONS//////////////////////////////
    //THIS IS THE PIXEL LOOP THAT ITERATES OVER, FINDING 2 CLOSEST POINTS 
    //THEN CALCULATING IF YOU ARE DRAWN BY AVERAGE DISTANCE TO THOSE POINTS
    for (var pixx=0;pixx<width;pixx+=blobJump){
        for (var pixy=0;pixy<height;pixy+=blobJump){ 
            var totalDist = 0.0;
            var closestPoints=[];

            //FINDS CLOSEST POINTS
            for (var clo = 0; clo < largePoints.length; clo++){
                    closestPoints.push( [ dist(pixx,pixy,largePoints[clo].x,largePoints[clo].y) , clo ] );
                } //creates an array of [ [distance,index],[distance,index],[etc]  ]

            closestPoints.sort(function(a, b){return a[0]-b[0]}); //sorting by distance
            closestPoints = closestPoints.slice(0, numClosest); //cut it down to 2

            for (var center=0; center < closestPoints.length; center++){ //change this so that it's only the two closest points
                 totalDist += closestPoints[center][0];
            }

            var averageDist = totalDist/largePoints.length;

            if (averageDist <= margin*marginMultiplier){
                stroke(crossColor);
                strokeWeight(crossWeight);
                // point(pixx,pixy); //normal dots
                line(pixx,pixy-crossSize/2,pixx,pixy+crossSize/2); //DRAWS CROSSES
                line(pixx-crossSize/2,pixy,pixx+crossSize/2,pixy);
            }
        }
    }//end pixel loop

    ////OTHER STUFF AND DEBUG
    // console.log(frameRate())
}//end draw


//Increment Points
//////////////////////////INCREMENT POINTS///////////////////////////
function incrementPoints(s){
    for (i=0;i<largePoints.length;i++){
    	
    	//RANDOM OFFSETS AT THE END ARE TO COUNTERACT GRADUAL TOP LEFT DRIFT, USE FF TO IDENTIFY
    	for (var j=0;j<s;j++){
    		counter +=1;
        	largePoints[i].x+=map(noise(largePoints[i].x,counter*ns),0.00,1.00,-step,step)+random(0.095,0.12)-0.05;
        	largePoints[i].y+=map(noise(largePoints[i].y,counter*ns),0.00,1.00,-step,step)+random(0.095,0.12)-0.05;
        }

        //KEEPS POINTS INSIDE MARGIN
        if (largePoints[i].x > width-margin) {largePoints[i].x = width-margin};
        if (largePoints[i].x < margin) {largePoints[i].x = margin};
        if (largePoints[i].y > height-margin) {largePoints[i].y = height-margin};
        if (largePoints[i].y < margin) {largePoints[i].y = margin};
    }
}

//Other Function
function createNextPointLarge(array, min, max){
    var acceptable = true;
    var p = createVector(
                    random(margin,width-margin),
                    random(margin,width-margin));

    //THIS COMPARES NEW POINT DISTANCE TO ALL OTHERS, NOT TO ONLY PREVIOUS
    // for (var i=0;i<array.length;i++){
    //     if ( dist(p.x,p.y,array[i].x,array[i].y) < min || dist(p.x,p.y,array[i].x,array[i].y) > max ) {
    //         acceptable = false;
    //     }
    // }//end of distance loop

    if ( dist(p.x,p.y,array[array.length-1].x,array[array.length-1].y) < min || dist(p.x,p.y,array[array.length-1].x,array[array.length-1].y) > max ) {
            acceptable = false;
         }//THIS COMPARES ONLY TO PREVIOUS ONE

    //After checking ALL points
    if (acceptable == true){
            largePoints.push(p);
        }
    if (acceptable == false) {
            return createNextPointLarge(largePoints,min,max); //RECURSION BE CAREFUL
        }
}

//CURRENTLY BROKEN
function keyPressed() {
  if (value) {
  	setup();
  }
}


function mousePressed() {
	speed = ff;
}
function mouseReleased() {
	speed = 20;
}