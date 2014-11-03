var express = require("express");
var fs = require("fs");
var http = require('http');
var util = require('util'); 	
var neo4j = require('neo4j-js');

var app = express();
app.use(express.static(__dirname + '/html'));



app.listen(80);
console.log('server runnning...');	

// fetch all notes in home.
app.get("/create", function(request, response)
{
	console.log(request.query.param1);
	console.log(request.query.param2);
	var p1 = request.query.param1;
	var p2 = request.query.param2;
//	response.send({'data': request.query.param});

	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) 
	{

	    if (err)
	        throw err;

	    else
	    {	
	  		// graph.createNodeIndex ( [Batch,] String name, Function callback )
			// graph.createNodeIndex ( [Batch,] String name, Object config, Function callback )
			// graph.createNodeIndex ( [Batch,] Function callback )
			// graph.createNodeIndex ( [Batch,] Object config, Function callback )
	    	graph.createNode([{ Name: p1 }, {Name: p2}], function (err, nodes) {
			    console.log(err ? err : nodes);
			    var rel = "relation";
			    nodes[0].createRelationshipFrom(nodes[1], rel, function (error, relationship){
			    	console.log(error ? error : relationship);
			    });
			});

				


			// var batch = graph.createBatch();
			
			// graph.getNode(batch, 18, function (error, node) {
			//     //this will not be called until after batch.run()
			// });

		//	batch.run();
			console.log("check clicked");
		}
	});

});

