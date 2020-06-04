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

// AO4 - Initial Params 
var chosenYAxis = "smokes";                                             // AO:changed to age ; AO3: Changed to Y axis

// AO4 - function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {                              // AO: changed hairData to healthData all over the file
  // create scales                                                      // AO3: changed to yScale function and changed all to chosenYAxis
  var yLinearScale = d3.scaleLinear()                                   // AO3: changed to yLinearScale
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// AO4 - function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);                              // AO3: Changed to axisLeft
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);                                                  // AO3: Changed to var leftAxis
  
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));                    // AO3: Changed cx to cy

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  var label;

  if (chosenYAxis === "obesity") {                              // AO: changed to age and household income
    label = "Obesity %:";                                        // AO3: Changed chosenYaxis to y variables to obesity, smokes, lacks healthcare
  }
  else if(chosenYAxis === "smokes") {
    label = "Smoke %:";                                           // AO2: Added poverty in else if
  }
  else {
    label = "Lacks Healthcare (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenYAxis]}`);   // AO: change to state abbr
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

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {     // AO: changed csv file
  if (err) throw err;

  // AO4 - parse data
  healthData.forEach(function(data) {
    data.age = +data.age;                                           // AO: Changed to health data
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;                                           // AO2: added poverty number
    data.obesity = +data.obesity;                                               // AO3: added obesity, healthcare
    data.healthcare = +data.healthcare;
  console.log(healthData);
  });

  // AO4 - yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis);                       // AO3: changed to yScale

  // Create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.age)])                 // AO: Changed yaxis to d.smokes
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);                             // AO3: changed x back to reg
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // AO4 - append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("cx", d => xLinearScale(d.age))                        // AO: Changed to s.smokes  // changed cx back to just age
    .attr("r", 20)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = xlabelsGroup.append("text")                         // AO: Changed to var ageLabel
    .attr("x", 0)                                                           // AO3: Changed all labels to y axis labels
    .attr("y", 20)  
    .attr("value", "age") // value to grab for event listener       // AO: Changed to age
    .classed("active", true)
    .text("Age (Median)");                                          // AO: Changes to Age Median yAxis label 

  var incomeLabel = xlabelsGroup.append("text")                      // AO: Chaged to var incomeLabel
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener    // AO: Changed to income for household income
    .classed("inactive", true)
    .text("Household Income ($)");                                  // AO: Change to this yAxis label if income is selected

  var povertyLabel = xlabelsGroup.append("text")                             // AO2:  Adding poverty yAxis label if poverty is selected
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("In Poverty (%)");

  // AO4 - append y axis labels
  var ylabelsGroup = chartGroup.append("g")
  var smokesLabel = ylabelsGroup.append("text")                                     // AO3: Adding y axis labels.  Left x axis labels on top alone 
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("active", true)
    .text("Smokes %");                                              // AO: Changed to Smokes % for y axis label

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity %"); 

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Lacks Healthcare %"); 

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenYAxis with value
        chosenXAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

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
  // AO4 - y axis label event listener  
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);    
 
         // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {                                
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel                                                          
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "healthcare") {                                 
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel                                                          
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel                                                          
            .classed("active", false)
            .classed("inactive", true);

        }
      }
    });
}).catch(function(error) {
  console.log(error);
});