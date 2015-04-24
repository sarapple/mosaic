// Build svg equilateral triangles, based on Trianglify @qrohlf.
// Needs d3.js

function Triangles(options) {

    if (typeof options === 'undefined') {
        options = {};
    }

    function defaults(opt, def) {
        return (typeof opt !== 'undefined') ?  opt : def;
    }
    // defaults

    this.options = {
        side: defaults(options.side, 50),
        transition: defaults(options.transition, null),
        viewBox: defaults(options.viewBox, "50 50 600 400")
    };

}

Triangles.prototype.generate = function (x,y) {

    var options, svg, data;

    options = this.options;
    svg     = this.buildTemplate(x,y);              //svg element is returned from buildTemplate
    data    = this.buildData(x,y,options);          //return data set to be used for triangle points and colors
    this.displayTriangles(data,svg);

    if(options.transition !== null) {               //if transition is not null, set it
        this.setTransition(options.transition, svg);
    }

    return data;

};

Triangles.prototype.generateFromJSArray = function (x,y,JSONData) {

    var jsArray, options, svg;

    jsArray = JSON.parse(JSONData);
    options = this.options;
    svg     = this.buildTemplate(x,y);              //svg element is returned from buildTemplate
    this.displayTriangles(jsArray,svg);

    if(options.transition !== null) {               //if transition is not null, set it
        this.setTransition(options.transition, svg)
    }

};

Triangles.prototype.buildTemplate = function(x,y){

    var wrapper, svgWrapper, svg;

    wrapper     = d3.select(".triangle-wrapper");   //element class named triangle wrapper must exist
    svgWrapper  = wrapper                           //create an svg wrapper
        .append("div")
        .attr("class", "svg-wrapper");
    svg         = svgWrapper                        //build the svg, and return it
        .append("svg")
        .attr("viewBox",this.options.viewBox)
        .attr("version","1.1")
        .attr("xmlns","http://www.w3.org/2000/svg");

    return svg;

};

Triangles.prototype.buildData = function(x,y,options){

    var columns, fillY, height, data, runnerX, runnerY;

    columns = Math.ceil(x/(options.side*2)),        //number of chevron columns that fit in grid
    fillY   = Math.ceil(y/(options.side*1.5)),     //number of chevron triangle groups that will fit in 1 column
    height  = (options.side/2)*Math.sqrt(3),         //calculate the height of the equilateral triangle
    data    = [],                                   //data will be built in the following structure:
    runnerX = 0,
    runnerY = 0;

    //Reproduce image on Canvas.
    var cvs = document.createElement("canvas"),
        img = document.getElementsByTagName("img")[0];   // your image goes here
    cvs.width = img.width;
    cvs.height = img.height;
    var ctx = cvs.getContext("2d");
    ctx.drawImage(img,0,0,cvs.width,cvs.height);

    //Set up variables for canvas here.
    var canvasRunnerX, canvasRunnerY,
        canvasColumnWidth, canvasRowHeight,
        triHeight, triSide,
        pixelData, canvasString,
        outerLeft, outerRight, innerLeft, innerRight;


    canvasRunnerX        = 0,
    canvasRunnerY        = 0,
    canvasColumnWidth    = cvs.width/columns,
    canvasRowHeight      = cvs.height/fillY,
    triHeight            = canvasColumnWidth/2,
    triSide              = canvasRowHeight/1.5,
    pixelData = ctx.getImageData(canvasRunnerX,canvasRunnerY,1,1).data;

    // End IMG Canvas variables

    for(var i=0; i<columns; i++){
        canvasRunnerY = 0;
        runnerY = -25;                      //set runnerY to -25, so the top row aligns with the top of the svg

        for(var j=0; j<fillY; j++) {

            pixelData = ctx.getImageData((canvasRunnerX+(triHeight/2)),(canvasRunnerY+(triSide/2)),1,1).data;
            canvasString = 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] +')';

            if(j===0){                      //if on first row, make sure the top side is flat
                var topY = runnerY + (options.side / 2);
            }
            else {
                topY = runnerY
            }
            if(j===(fillY-1)){             //if on bottom row, make sure the bottom side is flat
                var bottomY = runnerY + options.side;
            }
            else {
                bottomY = runnerY + options.side*1.5;
            }

            outerLeft = {
                point1x: runnerX,
                point1y: topY,
                point2x: runnerX + height,
                point2y: runnerY + (options.side / 2),
                point3x: runnerX,
                point3y: runnerY + options.side,
                color: canvasString,
                column: i,
                chevron: j
            };

            pixelData = ctx.getImageData((canvasRunnerX+(triHeight*1.5)),(canvasRunnerY+(triSide/2)),1,1).data;
            canvasString = 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] +')';

            outerRight = {
                point1x: runnerX + height*2,
                point1y: topY,
                point2x: runnerX + height,
                point2y: runnerY + (options.side / 2),
                point3x: runnerX + height*2,
                point3y: runnerY + options.side,
                color: canvasString,
                column: i,
                chevron: j
            };

            pixelData = ctx.getImageData(canvasRunnerX+(triHeight/2),(canvasRunnerY+(triSide)),1,1).data;
            canvasString = 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] +')';

            innerLeft = {
                point1x: runnerX + height,
                point1y: runnerY + (options.side / 2),
                point2x: runnerX + height,
                point2y: bottomY,
                point3x: runnerX,
                point3y: runnerY + options.side,
                color: canvasString,
                column: i,
                chevron: j
            };

            pixelData = ctx.getImageData(canvasRunnerX+(triHeight*1.5),(canvasRunnerY+triSide),1,1).data;
            canvasString = 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] +')';

            innerRight = {
                point1x: runnerX + height,
                point1y: runnerY + (options.side / 2),
                point2x: runnerX + height,
                point2y: bottomY,
                point3x: runnerX + height*2,
                point3y: runnerY + options.side,
                color: canvasString,
                column: i,
                chevron: j
            };

            data.push(outerLeft);           //push triangles (that make up the chevron) into the dataset
            data.push(outerRight);
            data.push(innerLeft);
            data.push(innerRight);

            runnerY += options.side;        //increment runner on y-axis, new chevron
            canvasRunnerY += canvasRowHeight;
        }

        runnerX += height*2;                //increment runner on x-axis, new column
        canvasRunnerX += canvasColumnWidth;

    }

    return this.nestData(data);

};

Triangles.prototype.nestData = function(data){
    // nest the data by column
    var nest, nested;

    nest = d3.nest()
        .key(function(d) { return d.column; });

    nested = nest.entries(data);

    return nested;

};

Triangles.prototype.displayTriangles = function(data,svg){

    var group = svg
                .selectAll("g")
                .data(data)
                .enter()
                .append("g");
    var path = group.selectAll("path")
                .data(function(d) { return d.values; })
                .enter()
                .append("path")
                .attr("d", function(d){
                    return  "M " + d.point1x + " " + d.point1y +
                            " L " + d.point2x + " " + d.point2y +
                            " L " + d.point3x + " " + d.point3y + " z";
                })
                .attr("column", function(d){
                    return d.column;
                })
                .style("fill", function(d){
                    return d.color;
                })
                .style("stroke", function(d){
                    return d.color;
                })
                .style("stroke-width", function(d){
                    return 1;
                });
};

Triangles.prototype.setTransition = function(transition, svg){

    var column, paths, transformed;

    svg
        .on("mouseover", function() {
            d3
                .selectAll("g")
                .each(function () {
                    column = d3.select(this);
                    transformed = column[0][0].getAttribute("transformed");
                    paths = column.selectAll("path");
                    if(transformed == "null" || transformed == "false"){
                        paths
                            .transition()
                            .delay(function (d, i) {
                                return i * 50 + (d.column * 50);
                            })
                            .attr("transform", function (d) {
                                return transition;
                            });
                        column
                            .attr("transformed", function (d) {
                                return "true";
                            });
                    }
                    else {
                        paths
                            .transition()
                            .delay(function (d, i) {
                                return i * 50 + (d.column * 50);
                            })
                            .attr("transform", function (d) {
                                return "";
                            });
                        column
                            .attr("transformed", function (d) {
                                return "false";
                            });
                    }
                });
        });
    svg
        .on("mouseleave", function() {
            d3
                .selectAll("g")
                .each(function () {
                    column = d3.select(this);
                    transformed = column[0][0].getAttribute("transformed");
                    paths = column.selectAll("path");
                    paths
                        .transition()
                        .delay(function (d, i) {
                            return i * 50 + (d.column * 50);
                        })
                        .attr("transform", function (d) {
                            return "";
                        });
                    column
                        .attr("transformed", function (d) {
                            return "false";
                        });
                });
        });
};