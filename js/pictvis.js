PictVis = function(_parentElement, _deaths, _milex, _eventHandler)
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
PictVis.prototype.initVis = function()
{
    var thatp = this;
    this.wrangleData(this.year1, this.year2);

    this.svg = this.parentElement.append("svg")
                                .attr("viewBox", "0 0 250 55");

    this.svg.append("defs")
            .append("g")
            .attr("id","iconCustom")
            .append("path")
            .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
            // Clip Art from: http://bl.ocks.org/alansmithy/d832fc03f6e6a91e99f4

    var numRows = 3;
    var numCols = 35;
    var pictIndex = d3.range(numCols * numRows);
    this.peopleperpict = 10452501 / (numCols * numRows);

    this.svg.append("g")
            .attr("id", "pictoLayer")
            .selectAll("use")
            .data(pictIndex)
            .enter()
            .append("use")
                .attr("xlink:href","#iconCustom")
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
            .attr("xlink:href","#iconCustom")
            .attr("x", 0)
            .attr("y", 40)
            .classed("iconSelected", true);
    this.legend.append("text")
            .attr("x", 7)
            .attr("y", 40 + 5.5)
            .style("text-anchor", "left")
            .style("font-size", "5px")
            .text(" = 100,000 people")
            //.text(" = " + Math.floor(thatp.peopleperpict) + " people");

}


PictVis.prototype.wrangleData = function(_year1, _year2)
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
PictVis.prototype.updateVis = function()
{
    var thatp = this;
    d3.select("#pictoLayer").selectAll("use").attr("class",function(d,i){
       if (d * thatp.peopleperpict < thatp.deathsdisp) 
       {
           return "iconSelected";
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
PictVis.prototype.onSelectionChange = function ()
{
}


var getInnerWidth = function(element)
{
    return 1200;
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}
