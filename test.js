var neo4j = require("neo4j-js");
neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
    if (err)
        throw err;

    else
    	graph.createNode({ prop1: 'node property', boolProperty: false }, function (err, node) {
		    console.log(err ? err : node);
		});
});