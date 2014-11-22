var express = require("express");
var fs = require("fs");
var http = require('http');
var util = require('util'); 	 
var neo4j = require('neo4j-js');
var query = '';
var hrequest = require('request');

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
	query = 'CREATE ';
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
		{
			console.log('error in connecting');
			throw err;
		}

		else{	
			console.log("entered here");
			graph.query(query, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
				console.log(JSON.stringify(results, null, 5 ));
			});
			console.log("create clicked");
		}
	});
	response.send(JSON.stringify(query, null, 5 ));
});

app.get("/delete", function(request, response){
	// var str1 = request.query.param1;
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err)
			throw err;

		else{	
			var query1 = [
			'MATCH a-[r]-(), b',
			'DELETE r, a, b'
			];

			graph.query(query1.join('\n'), function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
				response.send(JSON.stringify(results, null, 5 ));
			})
		}
	});
});

app.get("/query", function(request, response){
	var str1 = request.query.param1;
	str1 = str1.trim();
	var query = 'MATCH a-[r]->b where a.Name = "'+str1+'" return a,r,b';

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

		        //    console.log(JSON.stringify(results, null, 5 ));
		            response.send(JSON.stringify(results, null, 5 ));
		        }
				
			});
		}
	});
});


app.get("/show_all_data", function(request, response){
	// var str1 = request.query.param1;
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err)
			throw err;

		else{	
			var query1 = [
			'MATCH a',
			'RETURN a'
			];

			graph.query(query1.join('\n'), function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
				}
				response.send(JSON.stringify(results, null, 5 ));
			})
		}
	});
});

app.get("/getnode", function(request, response){
	// var str1 = request.query.param1;
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node1 = request.query.node1;
		var node2 = request.query.node2;
		//var nod2 = request.query.nod2;

		var get_node = 'MATCH (a:Node) WHERE a.Name = "'+node1+ '"or a.Name ="' + node2 +'" RETURN a';
		var id1 = '';
		var id2 = '';
		graph.query(get_node, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				id1 = results[0].a.id;
				id2 = results[1].a.id;
	    		var query1 = '{  "to" : "http://localhost:7474/db/data/node/'+id2+'",  "max_depth" : 3,  "relationships" : {    "type" : "RELATED",    "direction" : "out" },  "algorithm" : "shortestPath" }';
	    		var path = 'http://localhost:7474/db/data/node/'+id1+'/paths';
	    		console.log(path);
	    		hrequest.post({
	    		headers:{
					'Content-Type': 'application/json; charset=UTF-8',
					'Accept': 'application/json'
    			},
			    uri: path,
			    body: query1},
			    function (error, response, body) {
			    	console.log(error);
			        if (!error && response.statusCode == 200) {
			            console.log(body)
			        }
			    });
			}
		})

	});
});