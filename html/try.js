var neo4j = require("neo4j-js");
neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
    if (err)
        throw err;

    else
    {
    	enum RelationshipTypes implements RelationshipType { ACTS_IN };
    	GraphDatabaseService gds = new EmbeddedGraphDatabase("/path/to/store");
    	Node forrest=gds.createNode();
    	forrest.setProperty("title","Forrest Gump");
    	forrest.setProperty("year",1994);
    	gds.index().forNodes("movies").add(forrest,"id",1);
    	Node tom=gds.createNode();
    	tom.setProperty("name","Tom Hanks");
    	Relationship role=tom.createRelationshipTo(forrest,ACTS_IN);
    	role.setProperty("role","Forrest");
    	Node movie=gds.index().forNodes("movies").get("id",1).getSingle();
    	assertEquals("Forrest Gump", movie.getProperty("title"));
    	for (Relationship role : movie.getRelationships(ACTS_IN,INCOMING)) {
    		Node actor=role.getOtherNode(movie);
    		assertEquals("Tom Hanks", actor.getProperty("name"));
    		assertEquals("Forrest", role.getProperty("role"));
    	}
	}
});