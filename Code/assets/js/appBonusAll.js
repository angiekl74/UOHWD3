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

// Initial Params - AO4
var chosenXAxis = "age";   
var chosenYAxis = "smokes";                                                 

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {                                 
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// AO4 - Adding function updating y-scale 
function yScale(healthData, chosenYAxis) {                              
    // create scales                                                      
    var yLinearScale = d3.scaleLinear()                                   
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderxAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// AO4 - adding function to update yAxis
function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);                         
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);                                                  
    
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderxCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}
// AO4 - passing in newYScale, chosenYAxis arguments
function renderyCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
}
// AO10 - attempt to update ST ABBR for both x and y
function updateTextX(textCircles, xLinearScale, chosenXAxis) {
  textCircles.transition()
    .duration(1000)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
  return textCircles;  
}

function updateTextY(textCircles, yLinearScale, chosenYAxis) {
  textCircles.transition()
    .duration(1000)
    .attr("y", d => yLinearScale(d[chosenYAxis]))
  return textCircles;  
}

// AO4 - did not add Y labels - Example doesn't have any
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;
  if (chosenXAxis === "age") {                             
    label = "Age (Median): ";
  }
  else if(chosenXAxis === "poverty") {
    label = "Poverty %: ";                                  
  }
  else {
    label = "Household Income $: ";
  }

  // var ylabel;
  // if (chosenYAxis === "smokes") {
  //   labely = "Smokes %: ";
  // }
  // else if(chosenYAxis === "obesity") {
  //   labely = "Obesity %: ";
  // }
  // else {
  //   labely = "Lacks Healthcare %: "
  // }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      
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
d3.csv("assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // AO4 - parse data
  healthData.forEach(function(data) {
    data.age = +data.age;                                      
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;                              
    data.obesity = +data.obesity;                              
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // AO4 - yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis); 

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
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
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))             
    .attr("r", 20)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  // AO10 - appendtext initial state abbr text
  var textCircles = chartGroup.selectAll("text.abbr")  
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "abbr")              // so it matches selectAll statement
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(function(d, i) {return d.abbr})
    .style('fill', 'white')
    .attr("font-size", ".65em")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")                    
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener  
    .classed("active", true)
    .text("Age (Median)");                                      

  var incomeLabel = labelsGroup.append("text")                 
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener 
    .classed("inactive", true)
    .text("Household Income ($)");                               

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("In Poverty (%)");

  // AO4 - append y axis
  var ylabelsGroup = chartGroup.append("g")
  var smokesLabel = ylabelsGroup.append("text")  
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("active", true)
    .text("Smokes %");                          

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
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderxAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderxCircles(circlesGroup, xLinearScale, chosenXAxis);

        // // AO10 - attempt to add st abbr
        textCircles = updateTextX(textCircles, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {                              
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel                                               
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {                               
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
          povertyLabel                                                          
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

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderyAxes(yLinearScale, yAxis);    

        // updates circles with new y values
        circlesGroup = renderyCircles(circlesGroup, yLinearScale, chosenYAxis);

        // AO10 - attempt to add st abbr
        textCircles = updateTextY(textCircles, yLinearScale, chosenYAxis);

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