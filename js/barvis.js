/**
 * BarVis object
 * @constructor
 */

BarVis = function(_parentElement, _powerdata, _eventHandler)
{
    this.parentElement = _parentElement;
    this.allData = _powerdata;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.texts = [];
    this.bars = [];

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
BarVis.prototype.initVis = function()
{
    var thatb = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("text")
        .attr("x", 5)
        .attr("y", 35)
        .style("text-anchor", "left")
        .text("Percent of World's Warpower");

    for (var i = 0; i < 20; i++)
    {
        var newText = this.svg.append("text")
                          .attr("x", 0)
                          .attr("y", i * 15 + 50)
                          .style("text-anchor", "end")
                          .text("Country " + i);

        var newBar = this.svg.append("rect")
                         .attr("x", 5)
                         .attr("y", i * 15 + 50 - 10)
                         .attr("height", 10)
                         .attr("width", 200)
                         .style("fill", "lightcoral");

        this.texts.push(newText);
        this.bars.push(newBar);
    };
}


BarVis.prototype.wrangleData = function(_year)
{
    this.displayData = this.allData.filter(function(d,i) {
        return d.year == _year;
    })[0].countries.sort(function(a,b) {
        return d3.descending(a.cinc, b.cinc);
    }).filter(function(d,i) {
        // Select top 20
        return i < 20;
    });

    this.updateVis();
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
BarVis.prototype.updateVis = function()
{
    thatb = this;

    for (var i = 0; i < 20; i++)
    {
        this.texts[i].text(this.displayData[i].stateabb);
        this.bars[i].transition().attr("width", 250 * this.displayData[i].cinc / 0.4)
    }    
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
BarVis.prototype.onSelectionChange = function ()
{
}

/**
 * Helper function thatb gets the width of a D3 element
 */
 /*
var getInnerWidth = function(element)
{
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}
*/