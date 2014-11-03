function alert1(){
	var str = document.getElementById('graph_input');
	var split = str.value.split('\n');
	var len = split.length;
	for (var i = 0; i < len; i++){
		alert(split[i]);
	}
	// var r=require("request");
	// var txUrl = "http://localhost:7474/db/data/transaction/commit";
	// function cypher(query,params,cb) {
	//   r.post({uri:txUrl,
	//           json:{statements:[{statement:query,parameters:params}]}},
	//          function(err,res) { cb(err,res.body)})
	// }
}