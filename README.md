## D3.js Homework - Visualizing Data with D3.js

## Table of contents
* [Homework_Assignment_Background](##Homework_Assignment_Background)
* [Project_Task](##Project_Task)
* [Technologies](##Technologies)
* [Setup](##setup)
* [Methodology](##Methodology)


## Homework_Assignment_Background

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.
The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.
The data set included with the assignment is based on 2014 ACS 1-year estimates: https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml, but you are free to investigate a different data set. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Project_Task
* To create a D3 static scatter plot chart (example shown below) between two of the data variables such as Healthcare vs. Poverty.  In this project, I also attempted te bonus assignment that included more data and created a dynamic scatter plot. (To review dynamic scatter plot in action, review point #3 under Methodology).  

<img src="Images/4-scatter.jpg"  width="300" height="225">

## Technologies
The project is created with:
* D3js
* Bootstrap===4.3.1

## Setup
1. To download the latest version of d3.js or to link directly to the latest release (https://d3js.org/) 

## Methodology

1. Wrote code to create D3 scatterplot (To review code, review app.js file)

   We created a D3 scatterplot that used Age vs Smoke%.
   * Included state abbreviations in the circles.
   * Implemented tooltip with d3-tip that shows the State name, median age and smoke rate when you hover on a specific circle on the scatterplot.

2. To visualize static scatterplot

   Open index.html.  &nbsp; Below is a snapshot of the final assignment.

    <img src="Images/final_hw_image.png"  width="300" height="250">

3. To visualize dynamic scatterplot (To review code, review appBonusAll.js file)
    * Included more demographics and more risk factors.
    * Placed additional labels in the scatter plot on both y and x axes and gave them click events so that users can decide which data to display. 
    * Animated the transitions for circles' locations as well as the range of axes. 
    * to visualize dynamic scatterplot: Open index.html file:  

        * Comment out the following code:
        ```javascript
        <script type="text/javascript" src="assets/js/app.js"></script>
        ```
        * Uncomment the following code, save the file and run it:  
        ```javascript
        <script type="text/javascript" src="assets/js/appBonusAll.js"></script> 

    * Below is an example of the dynamic scatterplot created:

        <img src="Images/7-animated-scatter.gif"  width="300" height="250">
