var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";                                                    // AO:changed to age

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {                                  // AO: changed hairData to healthData all over the file
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "age") {                              // AO: changed to age and household income
    label = "Age (Median):";
  }
  else if(chosenXAxis === "poverty") {
    label = "Poverty %:";                                           // AO2: Added poverty in else if
  }
  else {
    label = "Household Income:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);   // AO: change to state abbr
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function updateText(textCircles, xLinearScale, chosenXAxis) {
  textCircles.transition()
    .duration(1000)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
  return textCircles;  
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {     // AO: changed csv file
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.age = +data.age;                                           // AO: Changed to health data
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;                                           // AO2: added poverty number

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.smokes)])                 // AO: Changed yaxis to d.smokes
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.smokes))                        // AO: Changed to s.smokes
    .attr("r", 20)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  // append ST abbr
  var textCircles = chartGroup.selectAll("text.abbr")  
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "abbr")              // so it matches selectAll statement
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.smokes))
    .text(function(d, i) {return d.abbr})
    .style('fill', 'white')
    .attr("font-size", ".65em")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle");
 

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")                         // AO: Changed to var ageLabel
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener       // AO: Changed to age
    .classed("active", true)
    .text("Age (Median)");                                          // AO: Changes to Age Median xaxis label 

  var incomeLabel = labelsGroup.append("text")                      // AO: Chaged to var incomeLabel
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener    // AO: Changed to income for household income
    .classed("inactive", true)
    .text("Household Income ($)");                                  // AO: Change to this xaxis label if income is selected

  var povertyLabel = labelsGroup.append("text")                             // AO2:  Adding poverty xaxis label if poverty is selected
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("In Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokes %");                                              // AO: Changed to Smokes % for y axis label

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        textCircles = updateText(textCircles, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {                                 // AO: Changed to income
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel                                                          // AO2: Added poverty line
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {                                  // AO2: Added poverty conditional
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel                                                          
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel                                                          // AO2: Added poverty line
            .classed("active", false)
            .classed("inactive", true);

        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
