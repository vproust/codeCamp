//Fonctions d'accÃ¨s aux diffÃ©rents Ã©lÃ©ments de la dataviz
function x(d) { return d.debut; }
function radius(d) { return d.nombreVictimes; }
function key(d) { return d.nomGuerre; }
 
var biggestFirst = true; //should largest circles be added first?
var padding = 4; //space in pixels between circles
 
// Dimensions du panneau svg
var margin = {top: 39, right: 39, bottom: 39, left: 79},
width = 1920 - margin.right,
height = 1000 - margin.top - margin.bottom,
totalwidth = width + margin.left + margin.right,
totalheight = height + margin.top + margin.bottom;
 
// CrÃ©e le panneau svg et le fait apparaitre
var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.attr("viewBox", "0 0 " + totalwidth + " " + totalheight)
.attr("preserveAspectRatio", "xMidYMid meet")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
var baselineHeight = height/2;
 
var bubbleLine = svg.append("g")
.attr("class", "bubbles")
.attr("transform", 
  "translate(0," + baselineHeight + ")");
 
 var dots = bubbleLine.append("g")
  .attr("class", "dots")

function drawAxis(remplacement){
  //Fonctions d'accÃ¨s aux informations sur le jeu de donnÃ©e
  var dataSize= remplacement.filter(function(d){ return d.nombreVictimes != ""; }).length;
  var nombreVictimesMin = d3.min(remplacement.filter(function(d){ return d.nombreVictimes != ""; }), function(d) { return +d.nombreVictimes;} );
  var nombreVictimesMax = d3.max(remplacement.filter(function(d){ return d.nombreVictimes != ""; }), function(d) { return +d.nombreVictimes;} );
  var debutMin = d3.min(remplacement.filter(function(d){ return d.debut != ""; }), function(d) { return +d.debut;} );
  var debutMax = d3.max(remplacement.filter(function(d){ return d.debut != ""; }), function(d) { return +d.debut;} );

 
 
  // DÃ©finition de l'Ã©chelle pour l'axe horizontal et le rayon des cercles
  var xScale = d3.scale.linear().domain([debutMin, debutMax]).range([0, width]),
  radiusScale = d3.scale.sqrt().domain([0, nombreVictimesMax]).range([8, 80]);
 
  // L'axe X
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks((debutMax-debutMin)/2, d3.format(",d"));
  var xAxis2 = d3.svg.axis().orient("bottom").scale(xScale).ticks((debutMax-debutMin)/2, d3.format(",d"));
 
  // Fait apparaitre l'axe X
  svg.append("g")
  .attr("class", "x axis")
  //.attr("transform", "translate(0," + height + ")")
  .call(xAxis);
 
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis2);
 
  // Ajoute la lÃ©gende pour l'axe X
  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .text("AnnÃ©e de remplacement");
  
}

function drawSVG(remplacement){ 
  
    //Fonctions d'accÃ¨s aux informations sur le jeu de donnÃ©e
  var dataSize= remplacement.filter(function(d){ return d.nombreVictimes != ""; }).length;
  var nombreVictimesMin = d3.min(remplacement.filter(function(d){ return d.nombreVictimes != ""; }), function(d) { return +d.nombreVictimes;} );
  var nombreVictimesMax = d3.max(remplacement.filter(function(d){ return d.nombreVictimes != ""; }), function(d) { return +d.nombreVictimes;} );
  var debutMin = d3.min(remplacement.filter(function(d){ return d.debut != ""; }), function(d) { return +d.debut;} );
  var debutMax = d3.max(remplacement.filter(function(d){ return d.debut != ""; }), function(d) { return +d.debut;} );
  
    // DÃ©finition de l'Ã©chelle pour l'axe horizontal et le rayon des cercles
  var xScale = d3.scale.linear().domain([debutMin, debutMax]).range([0, width]),
  radiusScale = d3.scale.sqrt().domain([0, nombreVictimesMax]).range([8, 80]);
 
  // L'axe X
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks((debutMax-debutMin)/2, d3.format(",d"));
  var xAxis2 = d3.svg.axis().orient("bottom").scale(xScale).ticks((debutMax-debutMin)/2, d3.format(",d"));
 
  //Create Quadtree to manage data conflicts & define functions//
 
  var quadtree = d3.geom.quadtree()
  .x(function(d) { return xScale(x(d)); }) 
        .y(0) //constant, they are all on the same line
        .extent([[xScale(debutMin),0],[xScale(debutMax),0]]);
    //extent sets the domain for the tree
    //using the format [[minX,minY],[maxX, maxY]]
    //optional if you're adding all the data at once
 
    var quadroot = quadtree([]);
          //create an empty adjacency tree; 
          //the function returns the root node.
 
// Find the all nodes in the tree that overlap a given circle.
// quadroot is the root node of the tree, scaledX and scaledR
//are the position and dimensions of the circle on screen
//maxR is the (scaled) maximum radius of dots that have
//already been positioned.
//This will be most efficient if you add the circles
//starting with the smallest.  
function findNeighbours(root, scaledX, scaledR, maxR) {
 
  var neighbours = [];
    //console.log("Neighbours of " + scaledX + ", radius " + scaledR);
    
    root.visit(function(node, x1, y1, x2, y2) {
      //console.log("visiting (" + x1 + "," +x2+")");
      var p = node.point; 
    if (p) {  //this node stores a data point value
      var overlap, x2=xScale(x(p)), r2=radiusScale(radius(p));        
      if (x2 < scaledX) {
            //the point is to the left of x
            overlap = (x2+r2 + padding >= scaledX-scaledR);
            /*console.log("left:" + x2 + ", radius " + r2 
              + (overlap?" overlap": " clear"));//*/
  }      
  else {
            //the point is to the right
            overlap = (scaledX + scaledR + padding >= x2-r2);
            /*console.log("right:" + x2 + ", radius " + r2 
              + (overlap?" overlap": " clear"));//*/
  }
  if (overlap) neighbours.push(p);
}
 
return (x1-maxR > scaledX + scaledR + padding) 
&& (x2+maxR < scaledX - scaledR - padding) ;
      //Returns true if none of the points in this 
      //section of the tree can overlap the point being
      //compared; a true return value tells the `visit()` method
      //not to bother searching the child sections of this tree
    });
 
return neighbours;
}
 
function calculateOffset(maxR){
  return function(d) {
    neighbours = findNeighbours(quadroot, 
     xScale(x(d)),
     radiusScale(radius(d)),
     maxR);
        //console.log(neighbours);
        var n=neighbours.length;
        //console.log(n + " neighbours");
        var upperEnd = 0, lowerEnd = 0;      
        
        if (n){
            //for every circle in the neighbour array
            // calculate how much farther above
            //or below this one has to be to not overlap;
            //keep track of the max values
            var j=n, occupied=new Array(n);
            while (j--) { 
              var p = neighbours[j];
              var hypoteneuse = radiusScale(radius(d))+radiusScale(radius(p))+padding; 
                //length of line between center points, if only 
                // "padding" space in between circles
                
                var base = xScale(x(d)) - xScale(x(p)); 
                // horizontal offset between centres
                
                var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
                  Math.pow(base, 2));
                //Pythagorean theorem
                
                occupied[j]=[p.offset+vertical, 
                p.offset-vertical];
                //max and min of the zone occupied
                //by this circle at x=xScale(x(d))
              }
              occupied = occupied.sort(
                function(a,b){
                  return a[0] - b[0];
                });
            //sort by the max value of the occupied block
            //console.log(occupied);
            lowerEnd = upperEnd = 1/0;//infinity
 
            j=n;
            while (j--){
                //working from the end of the "occupied" array,
                //i.e. the circle with highest positive blocking
                //value:
                
                if (lowerEnd > occupied[j][0]) {  
                    //then there is space beyond this neighbour  
                    //inside of all previous compared neighbours
                    upperEnd = Math.min(lowerEnd,
                      occupied[j][0]);
                    lowerEnd = occupied[j][1];
                  }
                  else {
                    lowerEnd = Math.min(lowerEnd,
                      occupied[j][1]);
                  }
            //console.log("at " + formatPercent(d.x) + ": "
              //          + upperEnd + "," + lowerEnd);
}
}
 
            //assign this circle the offset that is smaller
            //in magnitude:
            return d.offset = 
            (Math.abs(upperEnd)<Math.abs(lowerEnd))?
            upperEnd : lowerEnd;
          };
        }
  
  
  var maxR = 0;
  var dot = dots
  .selectAll(".dot")
  .data(remplacement.filter(function(d){ return d.nombreVictimes != "" && d.debut != ""; }).sort(
    biggestFirst?
    function(a,b){return b.nombreVictimes - a.nombreVictimes;} :
    function(a,b){return a.nombreVictimes - b.nombreVictimes;}
    ),function(d){return d.nombreVictimes})
    
  dot.attr('style','');
  
  dot.enter()
  .append("circle")
  .attr("class", "dot")
  .style("fill","992627ff")
  .attr("r", function(d){
    var r=radiusScale(radius(d));
    maxR = Math.max(r,maxR);
    return r;})
  .each(function(d, i) {
            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.
            
            //console.log("Bubble " + i);
            var scaledX = xScale(x(d));            
            d3.select(this)
            .attr("cx", scaledX)
            .attr("cy", 0)
            .transition().delay(10*i).duration(300)
            .attr("cy", calculateOffset(maxR));
            quadroot.add(d);
          })
  .append("title").text(function(d){return d.nomGuerre});
          
    //dot.exit().remove();
    dot.exit().attr('style','visibility: hidden');
    console.log(dot);

     // Ajoute une lÃ©gende pour les cercles
     //dot.append("title")
     //.text(function(d) { return d.nomGuerre; });
 
     dot.attr("title",function(d) { return d.nomGuerre; })

     dot.on("click", function(d) { 
    displayID(d);
    });
    
    
  
/**
  //Ajoute les cercles au graphique
  var maxR = 0;
  var dot = bubbleLine.append("g")
  .attr("class", "dots")
  .selectAll(".dot")
  .data(remplacement.sort(
    biggestFirst?
    function(a,b){return b.nombreVictimes - a.nombreVictimes;} :
    function(a,b){return a.nombreVictimes - b.nombreVictimes;}
    ))
  .data(remplacement.filter(function(d){ return d.nombreVictimes != "" && d.debut != ""; }))
  .enter().append("circle")
  .attr("class", "dot")
  .style("fill","992627ff")
  .attr("r", function(d){
    var r=radiusScale(radius(d));
    maxR = Math.max(r,maxR);
    return r;})
  .each(function(d, i) {
            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.
            
            //console.log("Bubble " + i);
            var scaledX = xScale(x(d));            
            d3.select(this)
            .attr("cx", scaledX)
            .attr("cy", 0)
            .transition().delay(10*i).duration(300)
            .attr("cy", calculateOffset(maxR));
            quadroot.add(d);
          });
          

     // Ajoute une lÃ©gende pour les cercles
     //dot.append("title")
     //.text(function(d) { return d.nomGuerre; });
 
     dot.attr("title",function(d) { return d.nomGuerre; })

     dot.append("title").text(function(d){return d.nomGuerre})
 
     dot.on("click", function(d) { 
    displayID(d);
    });
    **/

  //On active l'intÃ©raction de la souris avec les objets du graphique
  function enableInteraction() {
 
    function mouseover() {
      label.classed("active", true);
    }
 
    function mouseout() {
      label.classed("active", false);
    }
  }
}

//Chargement d'un fichier csv dÃ©limitÃ© par des points virgules
var dsv = d3.dsv(";", "text/plain");
dsv("./data/guerresModernes.csv", function(error, remplacement) {
  for(i in remplacement){
    if(remplacement[i].debut!=""){
      //console.log(parseInt(remplacement[i].debut)+'.'+Math.floor(Math.random()*100));
      remplacement[i].debut=parseInt(remplacement[i].debut)+'.'+Math.floor(Math.random()*100);
    } 
  }
  drawAxis(remplacement);
  drawSVG(remplacement);
  appendFilter(d3.select("#filter1"),"checkBoxFilter", remplacement, "moment");
  appendFilter(d3.select("#filter2"),"rangeFilter", remplacement, "debut");
});