// Define svg area, chart's margins, final chart area
var svgWidth = 900;
var svgHeight = 400;
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 50,
    left: 50
};
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body and append svg area and set dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group and apply Margin Convention
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load in data and cast values to a number
d3.csv('assets/data/data.csv').then(function(rawData){
    console.log(rawData);
    rawData.forEach(function(d){
        d.age = +d.age;
        d.smokes = +d.smokes;
    })

    // var test = rawData.map(row => row["age"])   
    // console.log("test: ", test)
    
    // Create xScale, yScale, bottom and left Axes
    var xScaleMin = d3.min(rawData, d => d.age) - 2;
    var xScaleMax = d3.max(rawData, d => d.age) + 2;
    var yScaleMin = d3.min(rawData, d => d.smokes) - 2;
    var yScaleMax = d3.max(rawData, d => d.smokes) + 2;

    console.log(xScaleMin, xScaleMax);
    console.log(yScaleMin, yScaleMax);

    var xScale = d3.scaleLinear()
        // .domain(d3.extent(rawData, d =>d.age))
        .domain([xScaleMin, xScaleMax])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        // .domain(d3.extent(rawData, d =>d.smokes))
        .domain([yScaleMin, yScaleMax])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append two svg group elements to chartGroup and append axes
    chartGroup.append("g")
        .call(leftAxis)
        // .attr("transform", `translate (${chartMargin.left}, 0)`);
        
    chartGroup.append("g")
        .call(bottomAxis)
        .attr("transform", `translate(0, ${chartHeight})`);

    // Create group for labels
    // var labelsGroup = chartGroup.append("g")
        // .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);

    chartGroup.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 40)
        .style("text-anchor", "middle")
        .text("Age (Median)")
        .attr("font-size", "1.25em");
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -chartHeight/2 - 30)
        .text("Smokes (%)")
        .attr("font-size", "1.25em");
    
    // Create Title for chart
    chartGroup.append("text")
    // .attr("class", title)
    .attr("y", -10)
    .attr("x", chartWidth/2 - 200)
    .text("Smoking % Rate vs. Median Age By State")
    .attr("font-size", "1.5em");
    
    // Create circles
    var circlesGroup = chartGroup.selectAll("circle").data(rawData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.smokes))
        .attr("r", 10)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);
    
    // Create text labels for each circle 
    // Credit https://stackoverflow.com/questions/21363042/d3-data-not-showing-all-the-elements
    chartGroup.selectAll("text.abbr")  
        .data(rawData)
        .enter()
        .append("text")
        .attr("class", "abbr")              // so it matches selectAll statement
        .attr("x", d => xScale(d.age))
        .attr("y", d => yScale(d.smokes) + 3)
        .text(function(d, i) {return d.abbr})
        .style('fill', 'white')
        .attr("font-size", ".65em")
        .attr("font-weight", "bold")
        .style("text-anchor", "middle");

    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d){
            return (`${d.state}<br> Median Age: ${d.age}
                              <br> Smoke Rate: ${d.smokes} %`)            
        })


    chartGroup.call(toolTip);
    
    //Create event listener to display/hide tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data,this);

    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
    })
})

