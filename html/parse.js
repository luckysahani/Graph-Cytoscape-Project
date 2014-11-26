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

// function show_all_data(){
// 	$.get( '/show_all_data', function(data){
// 		document.getElementById('graph_output').value=data;
// 	});
// 	console.log('All data is shown below');
// }

function delete1(){
    var x;
    if (confirm("Are you sure about deleting your data?") == true) 
    {
		$.get( '/delete', function(data){
			document.getElementById('graph_output').value='All values are deleted \n'+data;
		});
		console.log('deleted');
    } 
    else
    {
    	console.log('delete cancelled');
    }
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
			//console.log(graph.data.nodes.length);
			//graph.data.nodes.push(element);
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
		
		var obj = JSON.parse(dat1);
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

		var div_id = "cytoscapeweb";
		
		var element = {};
		var prev_node = -1;
		var indexes = '';
		for(var i=0; i<obj[0].nodes.length; i++){
			var temp = obj[0].nodes[i];
			temp=temp.split('/');
			indexes+=temp[temp.length-1]+' ';
		}
		indexes.trim();

		var rel_indexes = '';
		for(var i=0; i<obj[0].relationships.length; i++){
			var temp = obj[0].relationships[i];
			temp=temp.split('/');
			rel_indexes+=temp[temp.length-1]+' ';
		}
		rel_indexes.trim();
		
		$.get( '/nodebyid?indexes=' +  indexes , function(dat2){
			// document.getElementById('graph_output').value=dat1;
			var obj2= JSON.parse(dat2);
			for(var i=0;i<obj2.length;i++){
				element = {};
				element.id = ''+obj2[i].n.id+'';
				element.label = ''+obj2[i].n.data.Name+'';
				graph.data.nodes.push(element);
			}
			$.get( '/relbyid?indexes=' +  rel_indexes , function(dat3){
				document.getElementById('graph_output').value=dat3;
				var obj3= JSON.parse(dat3);
				for(var i=0;i<obj3.length;i++){
					element = {};
					element.id = ''+obj3[i].n.id+'';
					element.source = ''+obj3[i].n.start+'';
					element.target = ''+obj3[i].n.end+'';
					graph.data.edges.push(element);
				}
				var vis = new org.cytoscapeweb.Visualization(div_id, options);
				vis.draw(draw_options);
			});	
			// var vis = new org.cytoscapeweb.Visualization(div_id, options);
			// vis.draw(draw_options);
		});
		//document.getElementById('graph_output').value = dat1;
		//document.getElementById('graph_output').value = div_id;

	    
		//  init and draw
		//document.getElementById('graph_output').value = JSON.stringify(visual_style);
	});
	// $.get( '/getnode?node1=' +  str1[1], function(dat1){
	// 	var node = JSON.parse(dat1);
	// 	id2 = node[0].a.id;
	// });
		// document.getElementById('graph_output').value = id1;
}

function dijkstras(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	str1 = str1.split(' ');
//	var temp ='temp + \n';
	var id1 = '';
	var id2 = '';
	// console.log(str1[1]);
	$.get( '/dijkstras?node1=' +  str1[0] + '&node2=' + str1[1], function(dat1){
		
		var obj = JSON.parse(dat1);
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

		var div_id = "cytoscapeweb";
		
		var element = {};
		var prev_node = -1;
		var indexes = '';
		for(var i=0; i<obj[0].nodes.length; i++){
			var temp = obj[0].nodes[i];
			temp=temp.split('/');
			indexes+=temp[temp.length-1]+' ';
		}
		indexes.trim();

		var rel_indexes = '';
		for(var i=0; i<obj[0].relationships.length; i++){
			var temp = obj[0].relationships[i];
			temp=temp.split('/');
			rel_indexes+=temp[temp.length-1]+' ';
		}
		rel_indexes.trim();
		
		$.get( '/nodebyid?indexes=' +  indexes , function(dat2){
			// document.getElementById('graph_output').value=dat1;
			var obj2= JSON.parse(dat2);
			for(var i=0;i<obj2.length;i++){
				element = {};
				element.id = ''+obj2[i].n.id+'';
				element.label = ''+obj2[i].n.data.Name+'';
				graph.data.nodes.push(element);
			}
			$.get( '/relbyid?indexes=' +  rel_indexes , function(dat3){
				document.getElementById('graph_output').value=dat3;
				var obj3= JSON.parse(dat3);
				for(var i=0;i<obj3.length;i++){
					element = {};
					element.id = ''+obj3[i].n.id+'';
					element.source = ''+obj3[i].n.start+'';
					element.target = ''+obj3[i].n.end+'';
					graph.data.edges.push(element);
				}
				var vis = new org.cytoscapeweb.Visualization(div_id, options);
				vis.draw(draw_options);
			});	
			// var vis = new org.cytoscapeweb.Visualization(div_id, options);
			// vis.draw(draw_options);
		});
		//document.getElementById('graph_output').value = dat1;
		//document.getElementById('graph_output').value = div_id;

	    
		//  init and draw
		//document.getElementById('graph_output').value = JSON.stringify(visual_style);
	});
	// $.get( '/getnode?node1=' +  str1[1], function(dat1){
	// 	var node = JSON.parse(dat1);
	// 	id2 = node[0].a.id;
	// });
		// document.getElementById('graph_output').value = id1;
}

function levels(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	str1 = str1.split(' ');

	console.log(str1[1]);
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
    $.get( '/get_node?node=' + str1[0], function(data2){
    	var a_obj = JSON.parse(data2);
		$.get( '/levels_node?node=' +  str1[0] + '&depth=' + str1[1], function(data){
			var i;
			var obj = JSON.parse(data);
			var exist = false;
			// /document.getElementById('graph_output').value = data;
			for(i=0;i<obj.length;i++){
				var element = {};
				element.id = ''+obj[i].b.id+'';
				if(element.id == a_obj[0].a.id) exist = true;
				element.label = obj[i].b.data.Name;
				graph.data.nodes.push(element);
				element = {};
				element.attrValue = ''+obj[i].b.id+'';
				element.value = "#7FFF00";
				visual_style.nodes.color.discreteMapper.entries.push(element);
			}
			if(exist == false){
			//	document.getElementById('graph_output').value = "Reached Here";
				var element = {};
				element.id = ''+a_obj[0].a.id+'';
			//	if(element.id == a_obj[0].a.id) exist = true;
				element.label = a_obj[0].a.data.Name;
				graph.data.nodes.push(element);
			}
			$.get( '/levels_rel?node=' +  str1[0] + '&depth=' + str1[1], function(data1){
				obj = JSON.parse(data1);
				var arr= new Array(1000);
				for(i =0; i< 1000; i++) arr[i] = 0;
				var count =0;
				var j=0;
				for( i=0; i<obj.length; i++){
					for(j=0;j<obj[i].r.length;j++){
						if(arr[obj[i].r[j].metadata.id]==0){
							count++;
							arr[obj[i].r[j].metadata.id]=1;
							var temp1 = obj[i].r[j].start;
							temp1 = temp1.split('/');
							var element = {};
							element.id = ''+obj[i].r[j].metadata.id+'_link';
							element.source = temp1[temp1.length-1];	
							element.label = "edge";
							temp1 = obj[i].r[j].end;
							temp1 = temp1.split('/');
							element.target = temp1[temp1.length-1];
							graph.data.edges.push(element);
						}
					}
				}
				document.getElementById('graph_output').value = JSON.stringify(graph);
				var options = {
			        swfPath: "/swf/CytoscapeWeb",
			        flashInstallerPath: "/swf/playerProductInstall"

			    };

			    var draw_options ={
			    	visualStyle: visual_style,
			    	network: graph,
			    	edgeLabelsVisible: true,
		             layout: "Tree"
			    };
			    
				//  init and draw
				var vis = new org.cytoscapeweb.Visualization("cytoscapeweb", options);
				vis.draw(draw_options);
			});
		});
	});
}

function drawgraph(){
	// var str = document.getElementById('query_input');
	var temp ='temp + \n';
	// var str1 = $.trim(str.value);
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

    var options = {
        swfPath: "/swf/CytoscapeWeb",
        flashInstallerPath: "/swf/playerProductInstall"

    };

    var draw_options ={
    	visualStyle: visual_style,
    	network: graph,
    	edgeLabelsVisible: true,
         layout: "Tree"
    };
	// console.log(graph);
	var div_id = "cytoscapeweb2";

	$.get( '/get_all_node', function(dat1){
		var obj = JSON.parse(dat1);
		for(var i=0; i<obj.length; i++)
		{
			var element = {};
			element.id = ''+obj[i].a.id+'';
			element.label = obj[i].a.data.Name;
			graph.data.nodes.push(element);
			element = {};
			element.attrValue = ''+obj[i].a.id+'';
			element.value = "#7FFF00";
			visual_style.nodes.color.discreteMapper.entries.push(element);
		}
		//	console.log(data);
		$.get('/get_all_rel', function(data){
		//	document.getElementById('graph_output').value = data;
			// console.log(obj.length);
			var obj = JSON.parse(data);

			for(var i=0; i<obj.length; i++){
				var element = {};
				element.id = ''+ obj[i].r.id +'_link';
				element.source = '' + obj[i].r.start + '';
				element.target = ''+obj[i].r.end + '';
				element.label = 'edge';
				graph.data.edges.push(element);
			}
			
		    
			//  init and draw
			var vis = new org.cytoscapeweb.Visualization(div_id, options);
			vis.draw(draw_options);
		});
	});

	// document.getElementById('drawgraph').value = '';
	console.log("drawgraph is done");	
}

function delete_edge(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	str1 = str1.split(' ');
	$.get('/delete_edge?node1=' +  str1[0] + '&node2=' + str1[1], function(data){
		if(data=="0"){
			document.getElementById('graph_output').value = "Error Deleting Edges";
		}
		else{
			document.getElementById('graph_output').value = "Edge has been deleted";
			drawgraph();
		}
	});
}


function update_node(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	document.getElementById('graph_output').value = str1;
	$.get('/update_node?node=' + str1, function(data){
		if(data=="0"){
			document.getElementById('graph_output').value = "Error Updating Node";
		}
		else{
			document.getElementById('graph_output').value = "New Node has been created";
			drawgraph();
		}
	});
}

function create_edge(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	str1 = str1.split('\n');
	$.get('/create_edge?node1=' +  str1[0], function(data){
		if(data=="0"){
			document.getElementById('graph_output').value = "Error Deleting Edges";
		}
		else{
			document.getElementById('graph_output').value = "Edge has been deleted";
			drawgraph();
		}
	});
}

function delete_node(){
	var str = document.getElementById('query_getnode');
	var str1 = $.trim(str.value);
	$.get('/delete_node?node=' + str1, function(data){
		if(data=="0"){
			document.getElementById('graph_output').value = "Error Deleting Node";
		}
		else{
			document.getElementById('graph_output').value = "Node has been deleted";
			drawgraph();
		}
	});
}