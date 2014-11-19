function create(){
	var str = document.getElementById('graph_input');
	var str1 = $.trim(str.value);
	str1 = str1.split('\n');
	str1 = str1.join('; ');
	$.get( '/create?param1=' +  str1, function(data){
		document.getElementById('graph_output').value=data;
	});
	document.getElementById('graph_input').value = '';
				// console.log("create clicked");	
}

function show_all_data(){
	$.get( '/show_all_data', function(data){
		document.getElementById('graph_output').value=data;
	});
	console.log('All data is shown below');
}

function delete1(){
	$.get( '/delete', function(data){
		document.getElementById('graph_output').value='All values are deleted \n'+data;
	});
	console.log('deleted');
}

function check_neighours(){
	var str = document.getElementById('query_input');
	var temp ='temp + \n';
	var str1 = $.trim(str.value);

	$.get( '/query?param1=' +  str1, function(dat1){
		//	console.log(data);

		var graph = '{ "dataSchema": { "nodes": [ { "name": "label", "type": "string" }], "edges": [ { "name": "label", "type": "string" } ] }, "data": { "nodes": [';
		// console.log(graph);
		var div_id = "cytoscapeweb";
		var obj = JSON.parse(dat1);
		// console.log(obj.length);

		graph += '{ "id": "'+obj.length+'", "label": "'+ obj[0].a.data.Name +'" }, ';
		for(var i=0; i<obj.length; i++){
			graph += '{ "id": "'+i+'", "label": "'+ obj[i].b.data.Name +'" }, ';
		}
		graph = graph.substring(0, graph.length - 2);
		graph += '], "edges": [';
		for(var i=0; i<obj.length; i++){
			graph += '{ "id": "'+i+'_link", "target": "'+i+'", "source": "'+obj.length+'"}, ';
		}
		graph = graph.substring(0, graph.length - 2);
		graph += ']}}';

		var graphShow = JSON.parse(graph);
		 document.getElementById('graph_output').value = dat1;

	    var options = {
	        // where you have the Cytoscape Web SWF
	        swfPath: "/swf/CytoscapeWeb",
	        // where you have the Flash installer SWF
	        flashInstallerPath: "/swf/playerProductInstall"
	    };
	    
		//  init and draw
		var vis = new org.cytoscapeweb.Visualization(div_id, options);
		vis.draw({ network: graphShow });
		// document.getElementById('graph_output').value = graph;
	});

	document.getElementById('query_input').value = '';
	console.log("check_neighours clicked");	
}

function shortest_path(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	str1 = str1.split(' ');
//	var temp ='temp + \n';
	var id1 = '';
	var id2 = '';
	// console.log(str1[1]);
	$.get( '/getnode?node1=' +  str1[0] + '&node2=' + str1[1], function(dat1){
		var node = JSON.parse(dat1);
		id1 = node[0].a.id;
	});
	// $.get( '/getnode?node1=' +  str1[1], function(dat1){
	// 	var node = JSON.parse(dat1);
	// 	id2 = node[0].a.id;
	// });
		document.getElementById('graph_output').value = id2;
}