MapVis = function(_parentElement, _countriesData, _powerRanks, _blips, _atwar, _eventHandler)
{
    this.parentElement = _parentElement;
    this.topo = _countriesData;
    this.power = _powerRanks;
    this.blips = _blips;
    this.atWar = _atwar;
    this.eventHandler = _eventHandler;
    this.year = 1946;

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.graticule = d3.geo.graticule();
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");

    this.offsetL = 30;
    this.offsetT = 20;

    this.setupVis();
    this.updateVis();
    this.initVis();
}

MapVis.prototype.setupVis = function()
{
    var thatm = this;

    this.projection = d3.geo.mercator()
        .translate([thatm.width / 2, thatm.height / 2])
        .center([0, 50])
        .scale(thatm.width / 2 / Math.PI);

    this.path = d3.geo.path().projection(thatm.projection);

    this.parentElement
        .attr("transform", "translate(" + -500 + "," + 0 + ")");

    this.svg = this.parentElement.append("svg")
        .attr("width", thatm.width)
        .attr("height", thatm.height)
        .attr("class", "mapSvg")
        // .on("click", click)
        .append("g");

    this.g = this.svg.append("g");
}

MapVis.prototype.initVis = function()
{
    var thatm = this;
    this.wrangleData(this.year);
}


MapVis.prototype.wrangleData = function(_year)
{
    var thatm = this;
    this.year = _year;
    console.log(this.atWar);
    // this.updateVis();
    this.pathee.style("fill", function(d, i) {
        var toColorCINC = thatm.power.filter(function(y,i) {
            return y.year == thatm.year;
        })[0]
        .countries.filter(function(y,i) {
            return y.name == d.properties.name;
        });//[0].cinc;

        basicColor = d3.rgb("#00441b");

        if (toColorCINC.length == 0)
        {
            return "#ffffff";
        }
        else
        {
            // http://colorbrewer2.org/
            if (toColorCINC[0].cinc < 0.05)
                return "#e5f5f9";
            if (toColorCINC[0].cinc < 0.1)
                return "#ccece6";
            if (toColorCINC[0].cinc < 0.15)
                return "#99d8c9";
            if (toColorCINC[0].cinc < 0.2)
                return "#66c2a4";
            if (toColorCINC[0].cinc < 0.25)
                return "#41ae76";
            if (toColorCINC[0].cinc < 0.3)
                return "#238b45";
            if (toColorCINC[0].cinc < 0.35)
                return "#006d2c";
            if (toColorCINC[0].cinc < 0.4)
                return "#00441b";
        }
    });
    
    d3.selectAll(".gpoint").selectAll("circle")
        .transition().duration(1000)
        .attr("r", 0);
    var oo = this.blips.filter(function(d) {
        return (d["Year"] == _year); 
    }).forEach(function(d) {
        thatm.addBlip(d.Latitude, d.Longitude, d);
    });
}

MapVis.prototype.updateVis = function()
{
    thatm = this;
    d3.select('svg.mapSvg').remove();
    this.setupVis();

    // Map Code From: http://techslides.com/d3-map-starter-kit

    this.svg.append("path")
        .datum(thatm.graticule)
        .attr("class", "graticule")
        .attr("d", thatm.path);

    this.g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("class", "equator")
        .attr("d", thatm.path);

    this.country = this.g.selectAll(".country").data(thatm.topo);

    this.pathee = this.country.enter().insert("path")
      .attr("class", "country")
      .attr("d", thatm.path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) {
        var toColorCINC = thatm.power.filter(function(y,i) {
            return y.year == thatm.year;
        })[0]
        .countries.filter(function(y,i) {
            return y.name == d.properties.name;
        });//[0].cinc;

        basicColor = d3.rgb("#00441b");

        if (toColorCINC.length == 0)
        {
            return "#ffffff";
        }
        else
        {
            // http://colorbrewer2.org/
            if (toColorCINC[0].cinc < 0.05)
                return "#e5f5f9";
            if (toColorCINC[0].cinc < 0.1)
                return "#ccece6";
            if (toColorCINC[0].cinc < 0.15)
                return "#99d8c9";
            if (toColorCINC[0].cinc < 0.2)
                return "#66c2a4";
            if (toColorCINC[0].cinc < 0.25)
                return "#41ae76";
            if (toColorCINC[0].cinc < 0.3)
                return "#238b45";
            if (toColorCINC[0].cinc < 0.35)
                return "#006d2c";
            if (toColorCINC[0].cinc < 0.4)
                return "#00441b";
        }

        return d.properties.color;
    });

    this.country.on("mousemove", function(d,i) {
        var mouse = d3.mouse(thatm.svg.node()).map(function(d) { return parseInt(d); });

        thatm.tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+thatm.offsetL)+"px;top:"+(mouse[1]+thatm.offsetT)+"px")
            .html(d.properties.name);
    })
    .on("mouseout", function(d,i) {
        thatm.tooltip.classed("hidden", true);
    })
    .on("click", function(d,i) {
        console.log(d.properties.name)
    });
}

MapVis.prototype.addBlip = function(lat, lon, dat)
{
    thatm = this;
    var gpoint = this.g.append("g").attr("class", "gpoint");
    var x = this.projection([lon,lat])[0];
    var y = this.projection([lon,lat])[1];

    if (lat == -888)
    {
        console.log(dat);
    }

    gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("fill", "red")
        .attr("r", 0).attr("opacity", 0)
        .transition().duration(1000)
        .attr("r", 5).attr("opacity", 100);

    gpoint.on("mousemove", function(d,i) {
        var mouse = d3.mouse(thatm.svg.node()).map(function(d) { return parseInt(d); });
        thatm.tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+thatm.offsetL)+"px;top:"+(mouse[1]+thatm.offsetT)+"px")
            .html("Conflict Territory: " + dat["Conflict territory"]);
    })
    .on("mouseout", function(d,i) {
        thatm.tooltip.classed("hidden", true);
    })
}


MapVis.prototype.onSelectionChange = function ()
{
}


var getInnerWidth = function(element)
{
    // var style = window.getComputedStyle(element.node(), null);
    return 1200;
    return parseInt(style.getPropertyValue('width'));
}
