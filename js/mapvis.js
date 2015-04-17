/**
 * MapVis object
 * @constructor
 */

MapVis = function(_parentElement, _countriesData, _eventHandler)
{
    this.parentElement = _parentElement;
    this.topo = _countriesData;
    this.eventHandler = _eventHandler;

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.graticule = d3.geo.graticule();
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");

    this.offsetL = 430;
    this.offsetT = 80;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
MapVis.prototype.initVis = function()
{
    var that = this;

    this.projection = d3.geo.mercator()
        .translate([that.width / 2, that.height / 2])
        .center([0, 45])
        .scale(that.width / 2 / Math.PI);

    this.path = d3.geo.path().projection(that.projection);

    this.parentElement
        .attr("transform", "translate(" + -500 + "," + 0 + ")")

    this.svg = this.parentElement.append("svg")
        .attr("width", that.width)
        .attr("height", that.height)
        .attr("class", "mapSvg")
        // .on("click", click)
        .append("g");

    this.g = this.svg.append("g");

    this.wrangleData();
    this.updateVis();
}


MapVis.prototype.wrangleData = function()
{
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
MapVis.prototype.updateVis = function()
{
    that = this;

    this.svg.append("path")
        .datum(that.graticule)
        .attr("class", "graticule")
        .attr("d", that.path);

    this.g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("class", "equator")
        .attr("d", that.path);

    this.country = this.g.selectAll(".country").data(that.topo);

    this.country.enter().insert("path")
      .attr("class", "country")
      .attr("d", that.path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { return d.properties.color; });

    this.country.on("mousemove", function(d,i) {
        var mouse = d3.mouse(that.svg.node()).map(function(d) { return parseInt(d); });

        that.tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+that.offsetL)+"px;top:"+(mouse[1]+that.offsetT)+"px")
            .html(d.properties.name);
    })
    .on("mouseout", function(d,i) {
        that.tooltip.classed("hidden", true);
    })
    .on("click", function(d,i) {
        console.log(d.properties.name);
    });

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange = function ()
{
}

/**
 * Helper function that gets the width of a D3 element
 */
var getInnerWidth = function(element)
{
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}
