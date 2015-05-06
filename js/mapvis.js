MapVis = function(_parentElement, _countriesData, _powerRanks, _blips, _atwar, _latlong, _eventHandler)
{
    this.parentElement = _parentElement;
    this.topo = _countriesData;
    this.power = _powerRanks;
    this.blips = _blips;
    this.atWar = _atwar;
    this.latLong = _latlong;
    this.countryNames = this.latLong.map(function(d, i) { return d.name; });
    this.eventHandler = _eventHandler;
    this.year = 1946;

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.graticule = d3.geo.graticule();
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");
    this.zoom = d3.behavior.zoom().scaleExtent([1,9]).on("zoom", this.move);

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

    //this.parentElement
    //    .attr("transform", "translate(" + -500 + "," + 0 + ")");

    this.svg = this.parentElement.append("svg")
        .attr("width", thatm.width)
        .attr("height", thatm.height)
        .attr("class", "mapSvg")
        .call(thatm.zoom)
        // .on("click", click)
        .append("g");

    this.g = this.svg.append("g");

    this.svg.append("linearGradient")
          .attr("id", "temperature-gradient-green")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", "5%").attr("y1", "0%")
          .attr("x2", "22%").attr("y2", "0%")
        .selectAll("stop")
          .data([
            {offset: "0%", color: "#e5f5f9"},
            {offset: "14%", color: "#c7e9c0"},
            {offset: "29%", color: "#a1d99b"},
            {offset: "43%", color: "#74c476"},
            {offset: "57%", color: "#41ab5d"},
            {offset: "71%", color: "#238b45"},
            {offset: "86%", color: "#006d2c"},
            {offset: "100%", color: "#00441b"}
          ])
        .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });
    this.svg.append("linearGradient")
          .attr("id", "temperature-gradient-red")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", "5%").attr("y1", "0%")
          .attr("x2", "22%").attr("y2", "0%")
        .selectAll("stop")
          .data([
            {offset: "0%", color: "#fee0d2"},
            {offset: "14%", color: "#fcbba1"},
            {offset: "29%", color: "#fc9272"},
            {offset: "43%", color: "#fb6a4a"},
            {offset: "57%", color: "#ef3b2c"},
            {offset: "71%", color: "#cb181d"},
            {offset: "86%", color: "#a50f15"},
            {offset: "100%", color: "#67000d"}
          ])
        .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });
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

    var atwarthisyear = this.atWar.filter(function(d, i) {
        return d.year == thatm.year;
    })[0].enemies;

    var allatwar = [];
    d3.selectAll(".gline").remove();
    atwarthisyear.forEach(function(d, i) {
        allatwar.push(d.SideA);
        allatwar.push(d.SideB);
        thatm.addLine(d.SideA, d.SideB);
    });

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
        else if ($.inArray(d.properties.name, allatwar) > -1)
        {
            if (toColorCINC[0].cinc < 0.05)
                return "#fee0d2";
            if (toColorCINC[0].cinc < 0.1)
                return "#fcbba1";
            if (toColorCINC[0].cinc < 0.15)
                return "#fc9272";
            if (toColorCINC[0].cinc < 0.2)
                return "#fb6a4a";
            if (toColorCINC[0].cinc < 0.25)
                return "#ef3b2c";
            if (toColorCINC[0].cinc < 0.3)
                return "#cb181d";
            if (toColorCINC[0].cinc < 0.35)
                return "#a50f15";
            if (toColorCINC[0].cinc < 0.4)
                return "#67000d"; 
        }
        else
        {
            // http://colorbrewer2.org/
            if (toColorCINC[0].cinc < 0.05)
                return "#f7fcf5";
            if (toColorCINC[0].cinc < 0.1)
                return "#e5f5e0";
            if (toColorCINC[0].cinc < 0.15)
                return "#c7e9c0";
            if (toColorCINC[0].cinc < 0.2)
                return "#a1d99b";
            if (toColorCINC[0].cinc < 0.25)
                return "#41ab5d";
            if (toColorCINC[0].cinc < 0.3)
                return "#238b45";
            if (toColorCINC[0].cinc < 0.35)
                return "#006d2c";
            if (toColorCINC[0].cinc < 0.4)
                return "#00441b";
        }
    })
/*
    .style("stroke", function(d, i) {
        if ($.inArray(d.properties.name, allatwar) > -1)
            return "#CC0000";
        else
            return "black";
    })
    .style("stroke-width", function(d, i) {
        if ($.inArray(d.properties.name, allatwar) > -1)
            return 2;
        else
            return 1.5;
    });
*/
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

        if (toColorCINC.length == 0)
        {
            return "#ffffff";
        }
        else
        {
            thatm.addCapital(toColorCINC[0].name);
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
    });

    // Make the legend
    this.svg.append("rect")
        .attr("x", 50)
        .attr("y", thatm.height + 50)
        .attr("height", 20)
        .attr("width", 200)
        .attr("fill", "url(#temperature-gradient-green)");
    this.svg.append("rect")
        .attr("x", 50)
        .attr("y", thatm.height + 90)
        .attr("height", 20)
        .attr("width", 200)
        .attr("fill", "url(#temperature-gradient-red)");
    this.svg.append("text")
        .attr("x", 40)
        .attr("y", thatm.height + 45)
        .attr("font-size", "16px")
        .attr("fill", "#000000")
        .text("Power Index");
    this.svg.append("text")
        .attr("x", 50)
        .attr("y", thatm.height + 65)
        .attr("font-size", "16px")
        .attr("fill", "#000000")
        .text("0");
    this.svg.append("text")
        .attr("x", 50)
        .attr("y", thatm.height + 105)
        .attr("font-size", "16px")
        .attr("fill", "#000000")
        .text("0");
    this.svg.append("text")
        .attr("x", 250)
        .attr("y", thatm.height + 65)
        .attr("font-size", "16px")
        .attr("fill", "#ffffff")
        .attr("text-anchor", "end")
        .text("0.4");
    this.svg.append("text")
        .attr("x", 250)
        .attr("y", thatm.height + 105)
        .attr("font-size", "16px")
        .attr("fill", "#ffffff")
        .attr("text-anchor", "end")
        .text("0.4");
    this.svg.append("text")
        .attr("x", 150)
        .attr("y", thatm.height + 65)
        .attr("font-size", "16px")
        .attr("fill", "#000000")
        .attr("text-anchor", "middle")
        .text("At Peace");
    this.svg.append("text")
        .attr("x", 150)
        .attr("y", thatm.height + 105)
        .attr("font-size", "16px")
        .attr("fill", "#000000")
        .attr("text-anchor", "middle")
        .text("At War");
}

MapVis.prototype.addBlip = function(lat, lon, dat)
{
    thatm = this;
    var gpoint = this.g.append("g").attr("class", "gpoint");
    var x = this.projection([lon,lat])[0];
    var y = this.projection([lon,lat])[1];

    gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("fill", "#800000")
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

MapVis.prototype.addCapital = function(c1)
{
    var thatm = this;

    if ($.inArray(c1, thatm.countryNames) < 0)
    {
        return;
    }
    var lat1 = thatm.latLong.filter(function(d) { return d.name == c1; })[0].latitude;
    var lon1 = thatm.latLong.filter(function(d) { return d.name == c1; })[0].longitude;
    var x1 = this.projection([lon1,lat1])[0];
    var y1 = this.projection([lon1,lat1])[1];

    var cappoint = this.g.append("g").attr("class", "cappoint");

    cappoint.append("svg:circle")
        .attr("cx", x1)
        .attr("cy", y1)
        .attr("class","point")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("r", 0).attr("opacity", 0)
        .transition().duration(1000)
        .attr("r", 2).attr("opacity", 100);

    cappoint.on("mousemove", function(d,i) {
            var mouse = d3.mouse(thatm.svg.node()).map(function(d) { return parseInt(d); });
            thatm.tooltip.classed("hidden", false)
                .attr("style", "left:"+(mouse[0]+thatm.offsetL)+"px;top:"+(mouse[1]+thatm.offsetT)+"px")
                .html("Capital of " + c1);
        })
        .on("mouseout", function(d,i) {
            thatm.tooltip.classed("hidden", true);
        })
}

MapVis.prototype.addLine = function(c1, c2)
{
    thatm = this;
    if ($.inArray(c2, thatm.countryNames) > -1 && $.inArray(c1, thatm.countryNames) > -1)
    {
        var lat1 = thatm.latLong.filter(function(d) { return d.name == c1; })[0].latitude;
        var lon1 = thatm.latLong.filter(function(d) { return d.name == c1; })[0].longitude;
        var lat2 = thatm.latLong.filter(function(d) { return d.name == c2; })[0].latitude;
        var lon2 = thatm.latLong.filter(function(d) { return d.name == c2; })[0].longitude;
        var gline = this.g.append("g").attr("class", "gline");
        var x1 = this.projection([lon1,lat1])[0];
        var y1 = this.projection([lon1,lat1])[1];
        var x2 = this.projection([lon2,lat2])[0];
        var y2 = this.projection([lon2,lat2])[1];

        var cx1 = this.projection([0,0])[0];
        var cy1 = this.projection([0,0])[1];

        var gline = thatm.g.append("line").attr("class", "gline")
            .attr("stroke", "red")
            .attr("stroke-width", "2.5px")
            .attr("stroke-opacity", ".5")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2);

        gline.on("mousemove", function(d,i) {
            var mouse = d3.mouse(thatm.svg.node()).map(function(d) { return parseInt(d); });
            thatm.tooltip.classed("hidden", false)
                .attr("style", "left:"+(mouse[0]+thatm.offsetL)+"px;top:"+(mouse[1]+thatm.offsetT)+"px")
                .html(c1 + " vs. " + c2);
        })
        .on("mouseout", function(d,i) {
            thatm.tooltip.classed("hidden", true);
        })
    }


    /*.style("stroke", function(d, i) {
        if ($.inArray(d.properties.name, allatwar) > -1)
            return "red";
        else
            return "black";
    })*/
}

MapVis.prototype.move = function ()
{
    // var thatm = this;
    var t = d3.event.translate;
    var s = d3.event.scale; 
    zscale = s;
    var h = thatm.height/4;


    t[0] = Math.min(
        (thatm.width/thatm.height)  * (s - 1), 
        Math.max( thatm.width * (1 - s), t[0] )
    );

    t[1] = Math.min(
        h * (s - 1) + h * s, 
        Math.max(thatm.height  * (1 - s) - h * s, t[1])
    );

    map_vis.zoom.translate(t);
    map_vis.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    d3.selectAll(".country").style("stroke-width", 1.5 / s);
    d3.selectAll(".gline").style("stroke-width", 2.5 / s);
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
