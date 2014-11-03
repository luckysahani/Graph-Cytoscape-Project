var neo4j = require("neo4j-js");
// var Base = require('/var/www/html/node_modules/neo4j-js/lib/Base.js');
neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
    if (err)
        throw err;

    else
    {

        var query = [
            'START n = node({id})',
            'MATCH m-[r]-n',
            'RETURN m, r'
        ];

        // console.log((Object)Base.data);
        graph.query(query.join('\n'), { id: 1 }, function (err, results) {
            if (err) {
                console.log(err);
                console.log(err.stack);
            }
            else {
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    var relationship = results[i].r;
                    var node = results[i].m;
                    // console.log("hi");

                    // ... do something with the nodes and relationships we just grabbed 
                }

                console.log(JSON.stringify(results, null, 5 )); // printing may help to visualize the returned structure
            }
        });
    }
});