var express = require("express");
var fs = require("fs");
var http = require('http');
var util = require('util'); 	
var neo4j = require('neo4j-js');
var query = '';

var app = express();
app.use(express.static(__dirname + '/html'));



app.listen(80);
console.log('server runnning...');	

// fetch all notes in home.
app.get("/create", function(request, response){
	//console.log(request.query.param1);
	var str1 = request.query.param1;
	var input = str1.split('; ');
	var nodes = input[0].split(' ');
	query += 'CREATE ';
	for (var i = 0; i<nodes.length; i++){
		query += '(e'+i+': Node {Name: "'+nodes[i]+'"}), ';
	}
	for(i = 1; i<input.length; i++){
		nodes = input[i].split(' ');
		query += '(e'+parseInt(nodes[0])+')-[:RELATED]->(e'+parseInt(nodes[1])+'), ';
	}

	query = query.substring(0, query.length - 2);
	console.log(query);

	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err)
			throw err;

		else{	
			/*var query1 = [
			'MATCH a-[r]-(), b',
			'DELETE r, a, b'
			];

			graph.query(query1.join('\n'), function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
			});*/

			graph.query(query, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
				console.log(JSON.stringify(results, null, 5 ));
			});
			console.log("check clicked");
		}
	});
});

app.get("/query", function(request, response){
	var str1 = request.query.param1;
	str1 = str1.trim();
	var query = 'MATCH a-[:RELATED]->b where a.Name = "'+str1+'" return b';

	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err)
			throw err;

		else{	
			graph.query(query, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
				else{
					//for (var i = 0; i < results.length; i++) {
		            //var relationship = results[i].r;
		            //var node = results[i].m;

		            console.log(JSON.stringify(results, null, 5 )); // printing may help to visualize the returned structure
		            // ... do something with the nodes and relationships we just grabbed 
		        }
				
			});
		}
	});
});