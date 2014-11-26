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
		query += '(e_'+nodes[i]+': Node {Name: "'+nodes[i]+'"}), ';
	}
	for(i = 1; i<input.length; i++){
		nodes = input[i].split(' ');
		query += '(e_'+nodes[0]+')-[:RELATED{weight:['+1+']}]->(e_'+nodes[1]+'), ';
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


app.get("/drawgraph", function(request, response){
	// var str1 = request.query.param1;
	// str1 = str1.trim();
	var query = 'MATCH a-[r]->b return a,r,b';

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
			 'MATCH a-[r]->b RETURN a,r,b'
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

	
app.get("/shortest", function(request, response){
	// var str1 = request.query.param1;
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node1 = request.query.node1;
		var node2 = request.query.node2;
		//var nod2 = request.query.nod2;

		var get_node = 'MATCH a WHERE a.Name = "'+node1+ '"or a.Name ="' + node2 +'" RETURN a';
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
	    		var query1 = '{  "to" : "http://localhost:7474/db/data/node/'+id2+'", "max_depth" : 1000, "relationships" : {    "type" : "RELATED",    "direction" : "out" },  "algorithm" : "shortestPath" }';
	    		var path = 'http://localhost:7474/db/data/node/'+id1+'/paths';
	    		// console.log(id1 +" "+ id2);
	    		hrequest.post({
		    		headers:{
						'Content-Type': 'application/json; charset=UTF-8',
						'Accept': 'application/json'
	    			},
				    uri: path,
				    body: query1
				},
			    function (error, response, body) {
			    	// console.log(error);
			        if (!error && response.statusCode == 200) {
			            // console.log(body);
			            // var obj = JSON.parse(body);
			            // console.log(obj[0].nodes[0]);
		            	response1.send(body);
			        }
			    });
			}
		})

	});
});

app.get("/levels_node", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node = request.query.node;
		var depth = request.query.depth;

		var get_levels = 'MATCH a-[r:RELATED*1..'+depth+']->(b) WHERE a.Name="'+node+'" RETURN DISTINCT b'
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/levels_rel", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node = request.query.node;
		var depth = request.query.depth;

		var get_levels = 'MATCH a-[r:RELATED*1..'+depth+']->b WHERE a.Name="'+node+'" RETURN r'
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/get_node", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node = request.query.node;

		var get_levels = 'MATCH a WHERE a.Name="'+node+'" RETURN a'
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
				console.log(get_levels);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});


app.get("/get_all_node", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var get_levels = 'MATCH a RETURN DISTINCT a'
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
			//	console.log(get_levels);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/get_all_rel", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var get_levels = 'MATCH a-[r]->b RETURN DISTINCT r'
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
			//	console.log(get_levels);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/getnode", function(request, response1){
	// var str1 = request.query.param1;
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var node1 = request.query.node1;
		var node2 = request.query.node2;
		//var nod2 = request.query.nod2;

		var get_node = 'MATCH a WHERE a.Name = "'+node1+ '" RETURN a';
		var id1 = '';
		var id2 = '';
		graph.query(get_node, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				id1 = results[0].a.id;
				var get_node = 'MATCH (a:Node) WHERE a.Name = "'+node2+ '" RETURN a';
				graph.query(get_node, function (err, results) {
					if (err) {
						console.log(err);
						console.log(err.stack);
					}
					else{
						id2 = results[0].a.id;
						console.log(id1+id2);
			    		var query1 = '{  "to" : "http://localhost:7474/db/data/node/'+id2+'", "max_depth" : 1000, "relationships" : {    "type" : "RELATED",    "direction" : "out" },  "algorithm" : "shortestPath" }';
			    		var path = 'http://localhost:7474/db/data/node/'+id1+'/paths';
			    		// console.log(id1 +" "+ id2);
			    		hrequest.post({
				    		headers:{
								'Content-Type': 'application/json; charset=UTF-8',
								'Accept': 'application/json'
			    			},
						    uri: path,
						    body: query1
						},
					    function (error, response, body) {
					    	// console.log(error);
					        if (!error && response.statusCode == 200) {
					            // console.log(body);
					            // var obj = JSON.parse(body);
					            // console.log(obj[0].nodes[0]);
				            	response1.send(body);
					        }
					    });
					}
				});
			}
		});

	});
});

app.get("/nodebyid", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var get_levels = 'START n=node(';
		var index = request.query.indexes.split(' ');
		for(var i=0;i<index.length;i++){
			get_levels+=index[i]+',';
		}
		get_levels = get_levels.substring(0, get_levels.length - 1);
		get_levels+=') RETURN n';
		console.log(get_levels);
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
			//	console.log(get_levels);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/relbyid", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var get_levels = 'START n=relationship(';
		var index = request.query.indexes.split(' ');
		for(var i=0;i<index.length;i++){
			get_levels+=index[i]+',';
		}
		get_levels = get_levels.substring(0, get_levels.length - 1);
		get_levels+=') RETURN n';
		console.log(get_levels);
		graph.query(get_levels, function (err, results) {
			if (err) {
				console.log(err);
				console.log(err.stack);
			}
			else{
				//response.send(results);
			//	console.log(get_levels);
				response.send(JSON.stringify(results, null, 5 ));
			}
		});

	});
});

app.get("/delete_edge", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var id1 = request.query.node1;
		var id2 = request.query.node2;
		var query = 'MATCH a-[r]->b WHERE a.Name="'+id1+'" and b.Name="'+id2+'" DELETE r';
		console.log(query);
		graph.query(query, function (err, results){
			if (err) {
				console.log(err);
				console.log(err.stack);
				response.send("0");
			}
			else{
				response.send("1");
			}			
		});
	});
});

app.get("/create_edge", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var id1 = request.query.node1;
		var id2 = request.query.node2;
		var query = 'MATCH a,b WHERE a.Name="'+id1+'" and b.Name="'+id2+'" CREATE a-[:RELATED{weight:[1]}]->b' ;
		console.log(query);
		graph.query(query, function (err, results){
			if (err) {
				console.log(err);
				console.log(err.stack);
				response.send("0");
			}
			else{
				response.send("1");
			}			
		});
	});
});

app.get("/update_node", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var id1 = request.query.node;
		var query = 'MATCH a WHERE a.Name="'+id1+'" RETURN a';
		graph.query(query, function (err, results){
			if (err) {
				console.log(err);
				console.log(err.stack);
				response.send("0");
			}
			else{
				if(results.length==0){
					query = 'CREATE (e'+0+': Node {Name: "'+id1+'"})';
					console.log(query);
					graph.query(query, function (err, results){
						if (err) {
							console.log(err)
							response.send("0");
						}
						else{
							response.send("1");
						}
					});
				}
			}			
		});
	});
});

app.get("/delete_node", function(request, response){
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		var id1 = request.query.node;
		var query = 'MATCH a-[r]->b WHERE a.Name="'+id1+'"or b.Name="'+id1+'" DELETE r';
		console.log(query);
		graph.query(query, function (err, results){
			if (err) {
				console.log(err);
				console.log(err.stack);
				response.send("0");
			}
			else{
				query = 'MATCH a WHERE a.Name="'+id1+'" DELETE a';
				graph.query(query, function (err, results){
					if (err) {
						console.log(err);
						console.log(err.stack);
						response.send("0");
					}
					else{
						response.send("1");
					}
				});
			}			
		});
	});
});
