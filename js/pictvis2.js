// NOTE: Comments are not included in this file.
// This file and pictvis.js are similar except for the data used and the pictures drawn. The only difference between this file and pictvis.js is the SVG that is drawn as a picture, its color, and its legend.
// Please read the comments in pictvis.js if you are curious about our code.

PictVis2 = function(_parentElement, _deaths, _milex, _eventHandler)
{
    this.parentElement = _parentElement;
    this.deaths = _deaths;
    this.milex = _milex;
    this.eventHandler = _eventHandler;

    this.deathsdisp = 0;
    this.milexdisp = 0;
    this.year1 = 1946;
    this.year2 = 2007;

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.initVis();
    this.updateVis();
}


/**
 * Method that sets up the SVG and the variables
 */
PictVis2.prototype.initVis = function()
{
    var thatp = this;
    this.wrangleData(this.year1, this.year2);

    this.svg = this.parentElement.append("svg")
                                .attr("viewBox", "0 0 250 65")

    this.svg.append("defs")
            .append("g")
            .attr("id","iconCustom2")
            .append("path")
            .attr("d", "M4.529,1.669c0.131,0,0.238,0.107,0.238,0.238c0,0.132-0.106,0.239-0.238,0.239H2.146c-0.131,0-0.238-0.107-0.238-0.239 c0-0.131,0.107-0.238,0.238-0.238H4.529z M4.667,2.385h-2.66C0.827,3.247,0,5.071,0,6.231C0,7.79,1.495,7.625,3.337,7.625 c1.844,0,3.338,0.166,3.338-1.394C6.675,5.071,5.848,3.247,4.667,2.385z M2.007,1.431h2.66c0,0,1.055-0.919,0.577-1.322 S3.71,0.556,3.337,0.526c-0.372,0.03-1.43-0.82-1.907-0.418C0.955,0.511,2.007,1.431,2.007,1.431z");


            // Clip Art from: http://simpleicon.com/wp-content/uploads/money-bag-2.svg

    var numRows = 3;
    var numCols = 35;
    var pictIndex = d3.range(numCols * numRows);
    this.moneyperpict = 29170479345000 / (numCols * numRows);

    this.svg.append("g")
            .attr("id", "pictoLayer2")
            .selectAll("use")
            .data(pictIndex)
            .enter()
            .append("use")
                .attr("xlink:href","#iconCustom2")
                .attr("id", function(d) {
                    return "icon" + d;
                })
                .attr("x", function(d) {
                    return (d % numCols) * 7;
                })
                .attr("y", function(d) {
                    return (Math.floor(d / numCols)) * 15;
                })
                .attr("width", 20)
                .attr("height", 40)
                .classed("iconPlain", true);

    this.legend = this.svg.append("g")
            .attr("id", "pictLegend");
    this.legend.append("use")
            .attr("xlink:href","#iconCustom2")
            .attr("x", 0)
            .attr("y", 40)
            .classed("iconSelectedMoney", true);
    this.legend.append("text")
            .attr("x", 7)
            .attr("y", 40 + 5.5)
            .style("text-anchor", "left")
            .style("font-size", "5px")
            .text(" = $280 billion");
            // .text(" = $" + Math.floor(thatp.moneyperpict / 1000000) / 1000 + " billion");
    this.legend.append("use")
            .attr("xlink:href","#iconCustom2")
            .attr("x", 0)
            .attr("y", 55)
            .classed("iconSelectedMoney", true);
    this.legend.append("rect")
            .attr("x", 1)
            .attr("y", 55)
            .attr("width", 20)
            .attr("height", 15)
            .attr("fill", "white");
    this.legend.append("text")
            .attr("x", 7)
            .attr("y", 55 + 5.5)
            .style("text-anchor", "left")
            .style("font-size", "5px")
            .text(" = Cost of distributing a malaria net to everyone in danger of malaria");

}


PictVis2.prototype.wrangleData = function(_year1, _year2)
{
    var thatp = this;
    this.year1 = _year1;
    this.year2 = _year2;

    this.deathsdisp = 0;
    this.milexdisp = 0;

    deaths_data.forEach(function(d) {
        if (d.year >= _year1 && d.year <= _year2)
        {
            thatp.deathsdisp = thatp.deathsdisp + parseInt(d.deaths);
        }
    });
    mil_ex.forEach(function(d) {
        if (d.index >= _year1 && d.index <= _year2)
            thatp.milexdisp += d.milex;
    });

    this.updateVis();
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
PictVis2.prototype.updateVis = function()
{
    var thatp = this;
    d3.select("#pictoLayer2").selectAll("use").attr("class",function(d,i){
       if (d * thatp.moneyperpict < thatp.milexdisp) 
       {
           return "iconSelectedMoney";
       }
       else
       {
           return "iconPlain";
       }
    });
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PictVis2.prototype.onSelectionChange = function ()
{
}


var getInnerWidth = function(element)
{
    return 1200;
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}
