
var tooltip = floatingTooltip('gates_tooltip');

const countryText = {
    "GTM": "Guatemala",
    "HND": "Honduras",
    "SLV": "El Salvador"
};
const occuAttr = {
    "Agricultural production or labor": {"label": "Agriculture", "color": "#eb4927", "class": "agriculture"},
    "Informal work": {"label": "Informal Work", "color": "#e03448", "class": "informal"},
    "Salaried employment": {"label": "Salaried Work", "color": "#d11f63", "class": "salary"},
    "Own business": {"label": "Own Business", "color": "#e23cad", "class": "business"},
    "Domestic work": {"label": "Domestic Work", "color": "#bf0eb2", "class": "domestic"},
    "Student (may or may not attend classes regularly)": {"label": "Student", "color": "#881da8", "class": "student"},
    "Unemployed": {"label": "Unemployed", "color": "#662d91", "class": "unemployed"}
};

const occuAttrb = {
    "Agricultural production or labor": {"label": "Agriculture 28%", "color": "#eb4927", "class": "agriculture"},
    "Informal work": {"label": "Informal Work 22%", "color": "#e03448", "class": "informal"},
    "Salaried employment": {"label": "Salaried Work 15%", "color": "#d11f63", "class": "salary"},
    "Own business": {"label": "Own Business 6%", "color": "#e23cad", "class": "business"},
    "Domestic work": {"label": "Domestic Work 4%", "color": "#bf0eb2", "class": "domestic"},
    "Student (may or may not attend classes regularly)": {"label": "Student 20%", "color": "#881da8", "class": "student"},
    "Unemployed": {"label": "Unemployed 6%", "color": "#662d91", "class": "unemployed"}
};

const occuAttrc = {
    "Agricultural production or labor": {"label": "Agriculture 17%", "color": "#eb4927", "class": "agriculture"},
    "Informal work": {"label": "Informal Work 30%", "color": "#e03448", "class": "informal"},
    "Salaried employment": {"label": "Salaried Work 21%", "color": "#d11f63", "class": "salary"},
    "Own business": {"label": "Own Business 5%", "color": "#e23cad", "class": "business"},
    "Domestic work": {"label": "Domestic Work 6%", "color": "#bf0eb2", "class": "domestic"},
    "Student (may or may not attend classes regularly)": {"label": "Student 15%", "color": "#881da8", "class": "student"},
    "Unemployed": {"label": "Unemployed 5%", "color": "#662d91", "class": "unemployed"}
};

var margin = {top: 10, right: 150, bottom: 10, left: 150},
    width = 700 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " ; };
    // color = d3.scale.category20();
    
var fillColor = d3.scale.linear()
    .domain(['low', 'medium', 'high'])
    .range(['#3ba7c9', '#1540c4', '#e23cad']);

// append the svg canvas to the page
var svg = d3.select("#chartsank").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(8)
    .nodePadding(6)
    .size([width, height]);

var path = sankey.link();

// load the data (using the timelyportfolio csv method)
d3.csv("./data/sankey.csv", function(error, data) {

  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};

    data.forEach(function (d) {
      graph.nodes.push({ "name": d.source });
      graph.nodes.push({ "name": d.target });
      graph.links.push({ "source": d.source,
                         "target": d.target,
                         "value": +d.value,
                         "origin": d.country,
                         "dest": d.mig_ext_country});
     });

     // return only the distinct / unique nodes
     graph.nodes = d3.keys(d3.nest()
       .key(function (d) { return d.name; })
       .map(graph.nodes));

     // loop through each link replacing the text with its index from node
     graph.links.forEach(function (d, i) {
       graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
       graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
     });

     //now loop through each nodes to make nodes an array of objects
     // rather than an array of strings
     graph.nodes.forEach(function (d, i) {
       graph.nodes[i] = { "name": d, "color": d.color };
     });

  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
    //   .attr("class", "link")
      .attr("class", d => {            sourceClass = occuAttr[d.source.name.split('-')[1]].class;
            return "link " + sourceClass;
   
      })
      .attr("d", path)
//       .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; })
        // .on('mouseover', showDetail)
        .on('mouseover', d => {
            showDetail(d);
                sourceClass = occuAttr[d.source.name.split('-')[1]].class;
                sourceColor = occuAttr[d.source.name.split('-')[1]].color
                 sourceClassb = occuAttrb[d.target.name].class;
                sourceColorb = occuAttrb[d.target.name].color
                // select links with this class
                d3.selectAll("." + sourceClass)
                    // .raise()
                    .transition()
                    .ease('linear')
                    .duration(300)
                    // .style("stroke", function(l) {
                    //     return l.source.name === d.source.name ? color(d.source.name.replace(/ .*/, "")) : "#b3e7e8";
                    // });
                    .style("stroke", sourceColor);
                // select nodes with this class
                d3.selectAll(".source-" + sourceClass)
                    .transition()
                    .duration(300)
                    .style("fill", sourceColor);
                d3.selectAll(".target-" + sourceClassb)
                    .transition()
                    .duration(300)
                    .style("fill", sourceColorb);
        })
      .on('mouseout', function(d) {
          hideDetail(d);
          link.transition()
          .ease('linear')
            .duration(300)
            .style("stroke", "#b3e7e8");
          node.select("rect")
            .transition()
            .ease('linear')
            .duration(300)
            .style("fill", "#b3e7e8");
        
        });
//       .on("mouseover", function(d) {
//   		d3.select(this).style("stroke", function(l) {
//         return l.source === d  ? color(d.name.replace(/ .*/, "")) : "#b3e7e8";
//       }).style("stroke-width", 3);
// 		 
//         })        
// 		.on("mouseleave", function(d) {
//   		d3.select(this).style("stroke", "#b3e7e8").style("stroke-width", 1)
// 		;
//         })
//       .on('mouseover', showDetail)
//       .on('mouseout', hideDetail);

		
		

// add the link titles
//   link.append("title")
//         .text(function(d) {
//     		return d.source.name + "  " + 
//                 d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
//       .on("mouseover", function(d) {
//           d3.select(this)
//             .select("rect")
//             .transition()
//             .duration(300)
//             .style("fill", d => {
//                 return (d.name.startsWith('-')) ? occuAttr[d.name.split('-')[1]].color
//                 : "#b3e7e8"
//             });
//         sourceClass = occuAttr[d.name.split('-')[1]].class;
//         d3.selectAll("." + sourceClass)
//         // .raise()
//         .transition()
//         .duration(300)
//         .style("stroke", function(l) {
//             // return l.source === d  ? color(d.name.replace(/ .*/, "")) : "#b3e7e8";
//             return l.source === d  ? occuAttr[d.name.split('-')[1]].color : "#b3e7e8";
//         });
//       })

//   .on("mouseleave", function(d) {
//       d3.select(this)
//         .selectAll("rect")
//         .transition()
//         .duration(300)
//         .style("fill", "#b3e7e8")
//     link
//       .transition()
//       .duration(300)
//       .style("stroke", "#b3e7e8");
//   ) };

      

// add the rectangles for the nodes
  node.append("rect")
      .attr("class", d => {
            if (d.name.startsWith('-')) {
                sourceClass = occuAttr[d.name.split('-')[1]].class;
                return "node source-" + sourceClass;
            }
            else {
                sourceClass = occuAttr[d.name].class;
                return "node target-" + sourceClass;
            }
      })
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
     //  .style("fill", "#d11f63" )
      .style("stroke", "#fff")
	.style("fill", "#b3e7e8");
	// function(d) { return d.color;}) 
//     .append("title")
     //  .text(function(d) { 
// 		  return d.name + "\n" + format(d.value); })

		  
  

// add in the title for the nodes
//   node.append("text")
//       .attr("x", 10)
//       .attr("y", 0)
//       .attr("dy", ".95em")
//       .attr("text-anchor", "start")
//       .attr("transform", null)
//     //   .text(function(d) { return d.name;})
//     // uncomment the below code after occupation data is filtered out 
//     // text labels with dictionary lookup
//       .text(function(d) { 
//             if (d.name.startsWith('-')) {
//                 return occuAttrb[d.name.split('-')[1]].label;
//             }
//             else {
//                 return occuAttrc[d.name].label; 
//             }
//         })
//       .style("fill", "black")
//       .style("font-size", "12px")
//     .filter(function(d) { return d.x < width / 2; })
//       .attr("x", -10 + sankey.nodeWidth())
//       .attr("text-anchor", "end");


 function showDetail(d) {
 

node.append("text")
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", ".95em")
      .attr("text-anchor", "start")
      .attr("transform", null)
      .text(function(d) { 
      
            if (d.name.startsWith('-')) {
                return occuAttrb[d.name.split('-')[1]].label;
            }
            else {
                return occuAttrc[d.name].label; 
            }
        })
      .style("fill", "black")
      .style("font-size", "12px")
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", -10 + sankey.nodeWidth())
      .attr("text-anchor", "end");
      
    $("#gates_tooltip").empty();
    const tooltipTemplate = $(".tooltip.template");
    let tooltipContent = tooltipTemplate.clone();
    let beforeColor = occuAttr[d.source.name.split('-')[1]].color;
    let afterColor = occuAttr[d.target.name].color;

    tooltipContent.find(".side-color").css("background", "linear-gradient(" + beforeColor + ", " + afterColor + ")");
    tooltipContent.find(".text-color-before").css("color", beforeColor);
    tooltipContent.find(".text-color-after").css("color", afterColor);
    tooltipContent.find(".label-before").html(occuAttr[d.source.name.split('-')[1]].label);
    tooltipContent.find(".label-after").html(occuAttr[d.target.name].label);
    tooltipContent.find(".label-origin").html(countryText[d.origin]);
    tooltipContent.find(".label-dest").html(d.dest);

    tooltipContent.children().appendTo("#gates_tooltip");

    // tooltip.showTooltip(content, d3.event);
    tooltip.showTooltip(d3.event);
  } 

  function hideDetail(d) {  		
    tooltip.hideTooltip();
    d3.selectAll("text")       
    .style("fill", "#fff");
  }
// the function for moving the nodes
//   function dragmove(d) {
//     d3.select(this).attr("transform", 
//         "translate(" + d.x + "," + (
//                 d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
//             ) + ")");
//     sankey.relayout();
//     link.attr("d", path);
//   }
});
