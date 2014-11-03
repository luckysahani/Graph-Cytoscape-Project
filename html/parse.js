function alert1(){
	var str = document.getElementById('graph_input');
	var split = str.value.split('\n');
	var len = split.length;
	for (var i = 0; i < len; i++){
		alert(split[i]);
	}
	console.log("alert1 clicked");
	
}
function check()
{
	var neo4j = require("neo4j-js");
	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
    if (err)
        throw err;

    else
    	graph.createNode({ prop1: 'friends', prop2: 'maggu', boolProperty: false }, function (err, node) {
		    console.log(err ? err : node);
		});
	});
	console.log("check clicked");
}