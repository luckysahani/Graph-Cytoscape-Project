function alert1(){
	var str = document.getElementById('graph_input');
	var str1 = $.trim(str.value);
	var split = str1.split('\n');
	var len = split.length;
	for (var i = 0; i < len; i++){
		split[i] = $.trim(split[i]);
		var split1 = split[i].split(' ');
		$.get( '/create?param1=' + split1[0] + '&param2=' + split1[1] , function(data) {
			console.log(data);
			document.getElementById("graph_input").value=data.data+' and hardik are magoda';
		});
	}
	console.log("alert1 clicked");
	
}