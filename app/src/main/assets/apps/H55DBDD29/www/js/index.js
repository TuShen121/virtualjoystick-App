/*==============================第一个摇杆================================================*/
var options_1 = {
    zone: document.getElementById('zone_joystick_1'),
    color:"#afafaf",
    size: 150,
};
var manager_1 = nipplejs.create(options_1);
/*==============================第二个摇杆================================================*/
var options_2 = {
    zone: document.getElementById('zone_joystick_2'),
    color:"#afafaf",
    size: 150,
};
var manager_2 = nipplejs.create(options_2);

/*==============================获取摇杆数据================================================*/
var leftJoystickData={
	x:75,
	y:75,
}
var rightJoystickData={
	x:75,
	y:75,
}

manager_1.on("start",function(evt){
	leftJoystickData.x=manager_1[0].frontPosition.x
	leftJoystickData.y=manager_1[0].frontPosition.y
})
manager_1.on("end",function(evt){
	leftJoystickData.x=75
	leftJoystickData.y=75
})
manager_1.on("move",function(evt){
	var x=manager_1[0].frontPosition.x
	var y=manager_1[0].frontPosition.y

	x=parseInt(x)
	y=parseInt(y)
	
	leftJoystickData.x=x
	leftJoystickData.y=y
})

manager_2.on("start",function(evt){
	rightJoystickData.x=manager_2[0].frontPosition.x
	rightJoystickData.y=manager_2[0].frontPosition.y
})
manager_2.on("end",function(evt){
	rightJoystickData.x=75
	rightJoystickData.y=75
})
manager_2.on("move",function(evt){
	var x=manager_2[0].frontPosition.x
	var y=manager_2[0].frontPosition.y

	x=parseInt(x)
	y=parseInt(y)
		
	rightJoystickData.x=x
	rightJoystickData.y=y
})

/***************************获取按键数据*************************************************/
$("#btn_1").click(function(){
	if($("#btn_1").val()=='0'){
		$("#btn_1").val('1')
	}else if($("#btn_1").val()=='1'){
		$("#btn_1").val('0')
	}
})
$("#btn_2").click(function(){
	if($("#btn_2").val()=='0'){
		$("#btn_2").val('1')
	}else if($("#btn_2").val()=='1'){
		$("#btn_2").val('0')
	}
})
/********************打开设置******************************************/
$("#btn_status").click(function(){
	$("#div_setting").toggle()
})
/*================================setting=====================================*/
var ws=null;

var webSocketAdd=null
var tcpSocketAdd=null

mui.plusReady(function(){
/**************************读取原始数据填入input****************************************************/	
	webSocketAdd=plus.storage.getItem("webSocketAdd");
	$("#ipt_websocket").val(webSocketAdd);
	
	tcpSocketAdd=plus.storage.getItem("tcpSocketAdd");
	$("#ipt_socket").val(tcpSocketAdd);
	
	$("#btn_websocket").click(function(){
		if($("#btn_websocket").html()=="连接"){
			plus.tcpSocket.close(function(result){
	            //mui.toast("断开连接");
	        });
	        
			webSocketAdd = $("#ipt_websocket").val();
			plus.storage.setItem("webSocketAdd",webSocketAdd);		
			ws =  new  ReconnectingWebSocket('ws://'+webSocketAdd);	
			ws.onopen=function(){
				$("#btn_websocket").html("断开")
				$("#btn_socket").html("连接")		
				$("#btn_bluetooth").html("连接")		
				$("#btn_status").val("webSocket")
			}
			ws.onclose=function(){
				$("#btn_websocket").html("连接")
			}
			ws.onmessage=function(evt){
				console.log(evt.data)
				var img = document.getElementById("img_vedio")
				img.src='data:image/jpeg;base64,'+evt.data;
			}
		}else{
			$("#btn_websocket").html("连接")
			$("#btn_status").val("未连接")
			ws.close()
			ws.refresh()
		}
	})
	$("#btn_socket").click(function(){
		if($("#btn_socket").html()=="连接"){
			try{
				ws.close()
			}catch(e){
				//TODO handle the exception
			}
			tcpSocketAdd = $("#ipt_socket").val();
			plus.storage.setItem("tcpSocketAdd",tcpSocketAdd);
			plus.tcpSocket.connect(
		        $("#ipt_socket").val().split(':')[0],
		        $("#ipt_socket").val().split(':')[1],
		        function(result){
		        	$("#btn_status").val("socket")
		        	$("#btn_websocket").html("连接")
					$("#btn_socket").html("断开")		
					$("#btn_bluetooth").html("连接")		
		        },
		        function(error){
		            $("#btn_status").val("未连接")
		            $("#btn_socket").html("连接")
		            mui.toast("连接失败");
		        }
		    );
	    }else{
	    	$("#btn_socket").html("连接")
			$("#btn_status").val("未连接")
			plus.tcpSocket.close(function(result){
	            mui.toast("断开连接");
	        });
	    }
	})
})//mui.plusReady(function(){

/*=============================数据发送================================================*/
setInterval(function(){
	
	var leftDiv = document.getElementById("div_left_view")
	var rightDiv = document.getElementById("div_right_view")
	
	leftDiv.innerHTML=JSON.stringify(leftJoystickData)
	rightDiv.innerHTML=JSON.stringify(rightJoystickData)
	
	var x1=	leftJoystickData.x.toString()
	var y1= leftJoystickData.y.toString()
	var x2= rightJoystickData.x.toString()
	var y2= rightJoystickData.y.toString()
	
	var btn_1 = $("#btn_1").val()
	var btn_2 = $("#btn_2").val()
	try{
		ws.send(x1+','+y1+','+x2+','+y2+','+btn_1+','+btn_2+'\n')
	}catch(e){
		//TODO handle the exception
	}
	plus.tcpSocket.send(
        (x1+','+y1+','+x2+','+y2+','+btn_1+','+btn_2+'\n').toString(),
        function(result){
            
        }
    );
},50);
