/**
 * BarVis object
 * @constructor
 */

LineVis = function(_parentElement, _mydata, _maxVal, _type, _latlong, _eventHandler)
{
    this.parentElement = _parentElement;
    this.mydata = _mydata;
    this.maxVal = _maxVal;
    this.mytype = _type;
    this.latLong = _latlong;
    this.countryNames = this.latLong.map(function(d, i) { return d.name; });
    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.margin = {top: 20, right: 50, bottom: 30, left: 50},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 250 - this.margin.top - this.margin.bottom;

    this.texts = [];
    this.bars = [];

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
LineVis.prototype.initVis = function()
{
    var thatl = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + thatl.margin.left + "," + thatl.margin.top + ")");

    this.setupAxes();
    this.drawLines();
}

LineVis.prototype.setupAxes = function()
{
    
    var thatl = this;
    this.x = d3.scale.linear()
        .range([0, thatl.width]);

    this.y = d3.scale.linear()
        .range([thatl.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(thatl.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(thatl.y)
        .orient("left");

    this.x.domain([1946, 2007]);
    this.y.domain([0, thatl.maxVal]);

    this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + thatl.height + ")")
          .call(thatl.xAxis);

    this.svg.append("g")
          .attr("class", "y axis")
          .call(thatl.yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(function() {
                if (thatl.mytype == 1)
                    return "% Population";
                if (thatl.mytype == 2)
                    return "% GDP";
                if (thatl.mytype == 3)
                    return "Thousands of tons / person";
          });
}

LineVis.prototype.drawLines = function()
{
    var thatl = this;
    this.countryNames.forEach(function(na)
    {
        if (thatl.mydata[0][na] != null)
        {
            var line = d3.svg.line()
                            .x(function(d) { return thatl.x(d.x); })
                            .y(function(d) { return thatl.y(d.y); });

            for (var i = 0; i < thatl.mydata[0][na].x.length - 1; i++)
            {
                thatl.svg.append("line")
                    .attr("class", "line")
                    .attr("x1", thatl.x(thatl.mydata[0][na].x[i]))
                    .attr("x2", thatl.x(thatl.mydata[0][na].x[i + 1]))
                    .attr("y1", thatl.y(thatl.mydata[0][na].y[i]))
                    .attr("y2", thatl.y(thatl.mydata[0][na].y[i + 1]))
            };

            /* thatl.svg.append("path")
                .datum(thatl.mydata[0][na])
                .attr("class", "line")
                .attr("d", line); */

            console.log(thatl.mydata[0][na]);
        }
    });
}

LineVis.prototype.wrangleData = function(_year)
{
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
LineVis.prototype.updateVis = function()
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
LineVis.prototype.onSelectionChange = function (_name)
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