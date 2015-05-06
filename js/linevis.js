// Constructor for LineVis
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
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");
    this.offsetL = 30;
    this.offsetT = -30;

    this.texts = [];
    this.bars = [];

    this.initVis();
}


// Sets up the main SVG file
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

// Draws the axes and creates the scales
LineVis.prototype.setupAxes = function()
{
    
    var thatl = this;

    // Creates the scales
    this.x = d3.scale.linear()
        .range([0, thatl.width]);

    this.y = d3.scale.linear()
        .range([thatl.height, 0]);

    // Creates the axes
    this.xAxis = d3.svg.axis()
        .scale(thatl.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(thatl.y)
        .orient("left");

    this.x.domain([1946, 2007]);
    this.y.domain([0, thatl.maxVal]);

    // Draws the axes
    this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + thatl.height + ")")
          .call(thatl.xAxis);

    this.svg.append("g")
          .attr("class", "y axis")
          .call(thatl.yAxis)
        .append("text")
          .attr("transform", "rotate(0)")
          .attr("y",15)
          .attr("x",5)
          .attr("dy", ".71em")
          .style("text-anchor", "begin")
          .style("font-size", "16px")
          .text(function() {
                if (thatl.mytype == 1)
                    return "% Population in Military";
                if (thatl.mytype == 2)
                    return "% GDP used for Military";
                if (thatl.mytype == 3)
                    return "Thousands of tons of Iron+Steel Production / Person*";
          });
}

LineVis.prototype.drawLines = function()
{
    var thatl = this;
    this.countryNames.forEach(function(na)
    {
        if (thatl.mydata[0][na] != null)
        {
        	// Circle to signify the start date of the data
            thatl.svg.append("circle")
                .attr("cx", thatl.x(thatl.mydata[0][na].x[0]))
                .attr("cy", thatl.y(thatl.mydata[0][na].y[0]))
                .attr("r", 3)
                .attr("fill", "black");

            // We had trouble setting up a path, so we just drew one manually instead
            for (var i = 0; i < thatl.mydata[0][na].x.length - 1; i++)
            {
                thatl.svg.append("line")
                    .attr("class", "linee")
                    .attr("x1", thatl.x(thatl.mydata[0][na].x[i]))
                    .attr("x2", thatl.x(thatl.mydata[0][na].x[i + 1]))
                    .attr("y1", thatl.y(thatl.mydata[0][na].y[i]))
                    .attr("y2", thatl.y(thatl.mydata[0][na].y[i + 1]))
                    .attr("namee", na)
                    // Display country name when hovering over the line. Also triggers eventHandler
                    .on("mousemove", function(d,i) {
                        $(thatl.eventHandler).trigger("countryChanged", na);
                        var mouse = d3.mouse(thatl.svg.node()).map(function(d) { return parseInt(d); });

                        thatl.tooltip.classed("hidden", false)
                            .attr("style", "left:"+(mouse[0]+thatl.offsetL)+"px;top:"+(mouse[1]+thatl.offsetT)+"px")
                            .html(na);
                    })
                    .on("mouseout", function(d,i) {
                        $(thatl.eventHandler).trigger("countryChanged", "NONE");
                        thatl.tooltip.classed("hidden", true);
                    })
            };
        }
    });
}

LineVis.prototype.wrangleData = function(_year)
{
}

LineVis.prototype.updateVis = function()
{
}

// Updates which lines are selected based on an event
LineVis.prototype.onSelectionChange = function (_name)
{
    var thatl = this;
    thatl.svg.selectAll(".linee")[0].forEach(function(d)
    {
        if (d3.select(d).attr("namee") == _name)
        {
            d3.select(d).classed("linehover", true);
        }
        else
        {
            d3.select(d).classed("linehover", false);
        }
    })
}
