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
			console.log(dat1);

		var graph = { 
						dataSchema: 
						{ 
							nodes: [ { 
								name: "label", type: "string" 
							} ], 
							edges: [ {	name: "label", type: "string"},
								{name: "directed", type: "boolean", defValue: true}
							] 
						}, 
						data: { 
							nodes: [],
							edges: []
						}
					};
		var visual_style = {
            global: {
                backgroundColor: "#ABCFD6"
            },
            nodes: {
                shape: "OCTAGON",
                borderWidth: 3,
                borderColor: "#ffffff",
                size: {
                    defaultValue: 25,
                   // continuousMapper: { attrName: "weight", minValue: 25, maxValue: 75 }
                },
                color: {
                    discreteMapper: {
                        attrName: "id",
                        entries: [
                            
                        ]
                    }
                },
                labelHorizontalAnchor: "center"
            },
            edges: {
                width: 3,
                color: "#0B94B1"
            }
        };
		// console.log(graph);
		var div_id = "cytoscapeweb";
		var obj = JSON.parse(dat1);
		// console.log(obj.length);

		var element = {};
		element.id = ''+obj.length+'';
		element.label = obj[0].a.data.Name;
		graph.data.nodes.push(element);
		for(var i=0; i<obj.length; i++){
			var element = {};
			element.id = ''+i+'';
			element.label = obj[i].b.data.Name;
			graph.data.nodes.push(element);
			element = {};
			element.attrValue = ''+i+'';
			element.value = "#7FFF00";
			visual_style.nodes.color.discreteMapper.entries.push(element);
		}

		for(var i=0; i<obj.length; i++){
			var element = {};
			element.id = ''+ i +'_link';
			element.target = '' + i + '';
			element.source = ''+obj.length + '';
			element.label = 'edge';
			graph.data.edges.push(element);
		}
		

	    var options = {
	        swfPath: "/swf/CytoscapeWeb",
	        flashInstallerPath: "/swf/playerProductInstall"

	    };

	    var draw_options ={
	    	visualStyle: visual_style,
	    	network: graph,
	    	// edgeLabelsVisible: true,
            layout: "Circle"
	    };
	    
		//  init and draw
		var vis = new org.cytoscapeweb.Visualization(div_id, options);
		vis.draw(draw_options);
		// document.getElementById('graph_output').value = JSON.stringify(visual_style);
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
		// var obj = JSON.parse(dat1);
		// console.log(dat1);
		var obj = dat1;

		var graph = { 
						dataSchema: 
						{ 
							nodes: [ { 
								name: "label", type: "string" 
							} ], 
							edges: [ {	name: "label", type: "string"},
								{name: "directed", type: "boolean", defValue: true}
							] 
						}, 
						data: { 
							nodes: [],
							edges: []
						}
					};
		var visual_style = {
            global: {
                backgroundColor: "#ABCFD6"
            },
            nodes: {
                shape: "OCTAGON",
                borderWidth: 3,
                borderColor: "#ffffff",
                size: {
                    defaultValue: 25,
                   // continuousMapper: { attrName: "weight", minValue: 25, maxValue: 75 }
                },
                color: {
                    discreteMapper: {
                        attrName: "id",
                        entries: [
                            
                        ]
                    }
                },
                labelHorizontalAnchor: "center"
            },
            edges: {
                width: 3,
                color: "#0B94B1"
            }
        };
		var div_id = "cytoscapeweb";
		
		var element = {};
		var prev_node = -1;
		for(var i=0; i<obj[0].nodes.length; i++){
			var getId = obj[0].nodes[i].split('/');
			console.log(getId[getId.length-1]);
			
			// making nodes
			element = {};
			element.id = ''+getId[getId.length-1]+'';
			element.label = ''+getId[getId.length-1]+'';
			graph.data.nodes.push(element);
			
			// filling colors
			element = {};
			element.attrValue = ''+getId[getId.length-1]+'';
			element.value = "#7FFF00";
			visual_style.nodes.color.discreteMapper.entries.push(element);

			// making edges
			if(prev_node == -1){
				prev_node = getId[getId.length-1];
			 	continue;
			}
			element = {};
			element.id = ''+ getId[getId.length-1] +'_link';
			element.source = '' + prev_node + '';
			element.target = ''+ getId[getId.length-1] + '';
			element.label = 'edge';
			graph.data.edges.push(element);

			prev_node = getId[getId.length-1];
		}

	    var options = {
	        swfPath: "/swf/CytoscapeWeb",
	        flashInstallerPath: "/swf/playerProductInstall"

	    };

	    var draw_options ={
	    	visualStyle: visual_style,
	    	network: graph,
	    	// edgeLabelsVisible: true,
            layout: "Circle"
	    };
	    
		//  init and draw
		var vis = new org.cytoscapeweb.Visualization(div_id, options);
		// vis.draw(draw_options);
		// document.getElementById('graph_output').value = JSON.stringify(visual_style);
	});
	// $.get( '/getnode?node1=' +  str1[1], function(dat1){
	// 	var node = JSON.parse(dat1);
	// 	id2 = node[0].a.id;
	// });
		// document.getElementById('graph_output').value = id1;
}