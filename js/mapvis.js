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
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.graticule = d3.geo.graticule();
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");

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
        .scale(that.width / 2 / Math.PI);

    this.path = d3.geo.path().projection(that.projection);

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

    this.offsetL = 120;
    this.offsetT = 10;

    this.country.on("mousemove", function(d,i) {
        var mouse = d3.mouse(that.svg.node()).map(function(d) { return parseInt(d); });

        that.tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+that.offsetL)+"px;top:"+(mouse[1]+that.offsetT)+"px")
            .html(d.properties.name);
    })
    .on("mouseout", function(d,i) {
        that.tooltip.classed("hidden", true);
    });

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange = function (selectionStart, selectionEnd)
{
    this.wrangleData(function(d) { return d.type == type; });
}

/**
 * Helper function that gets the width of a D3 element
 */
var getInnerWidth = function(element)
{
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}

/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
MapVis.prototype.addSlider = function(svg){
    var that = this;
    var sliderHeight = that.height - 20;
    var sliderScale = d3.scale.linear().domain([0,sliderHeight]).range([0,sliderHeight]);

    var sliderDragged = function()
    {
        var value = Math.max(0, Math.min(sliderHeight,d3.event.y));
        var sliderValue = sliderScale.invert(value);

        if (sliderValue == 0)
            sliderValue = .1;

        that.y = d3.scale.pow().exponent(sliderValue / sliderHeight).range([that.height, 0]);
          
        that.yAxis = d3.svg.axis()
          .scale(that.y)
          .orient("left");
          
        d3.select(this)
            .attr("y", function () {
                return sliderScale(sliderValue);
            })
        that.updateVis({});
    }

    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:sliderHeight
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:sliderHeight,
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)
}

MapVis.prototype.resetSlider = function()
{
    var sliderHeight = this.height - 20;
    d3.select(".sliderHandle").attr({y:sliderHeight});

    this.y = d3.scale.linear()
      .range([this.height, 0]);
      
    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    this.updateVis();
}

MapVis.prototype.filterAndAggregate = function(_filter)
{
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }

    return this.data.map(function(d)
    { 
        return {date: d.date, calls: d.calls.filter(filter)};
    });
}
