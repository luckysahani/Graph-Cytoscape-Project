var neo4j = require("neo4j-js");
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
    	graph.createNode({ prop1: 'maggu number 1', boolProperty: false }, function (err, node) {
		    console.log(err ? err : node);
		});
    	graph.createNode({ prop1: 'friends', prop2: 'maggu', boolProperty: false }, function (err, node) {
		    console.log(err ? err : node);
		});
		var batch = graph.createBatch();

		//create a node and get another in the same request
		graph.createNode(batch, { key: 'value' }, function (error, node) {
		    //this will not be called until after batch.run()
		});
		graph.getNode(batch, 18, function (error, node) {
		    //this will not be called until after batch.run()
		});

		batch.run();
		console.log("check clicked");
	}
});