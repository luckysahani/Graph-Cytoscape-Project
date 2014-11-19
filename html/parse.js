function alert1(){
	var str = document.getElementById('graph_input');
	var str1 = $.trim(str.value);
	str1 = str1.split('\n');
	str1 = str1.join('; ');
	$.get( '/create?param1=' +  str1, function(data){});
	document.getElementById('graph_input').value = '';
	console.log("alert1 clicked");	
}

function alert2(){
	var str = document.getElementById('query_input');
	var str1 = $.trim(str.value);
	$.get( '/query?param1=' +  str1, function(data){
		console.log(data);
	});
	document.getElementById('query_input').value = '';
	console.log("alert2 clicked");	
}