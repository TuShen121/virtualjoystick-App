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

/********************打开设置******************************************/
$("#btn_status").click(function(){
	$("#div_setting").toggle()
})
/*================================setting=====================================*/
var ws=null;

var webSocketAdd=null

mui.plusReady(function(){
/**************************读取原始数据填入input****************************************************/	
	webSocketAdd=plus.storage.getItem("webSocketAdd");
	$("#ipt_websocket").val(webSocketAdd);
	
	$("#btn_websocket").click(function(){
		if($("#btn_websocket").html()=="连接"){
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
		}else{
			$("#btn_websocket").html("连接")
			$("#btn_status").val("未连接")
			ws.close()
		}
	})
	
})//mui.plusReady(function(){

/*=============================数据处理================================================*/
setInterval(function(){
	
	var leftDiv = document.getElementById("div_left_view")
	var rightDiv = document.getElementById("div_right_view")
	
	leftDiv.innerHTML=JSON.stringify(leftJoystickData)
	rightDiv.innerHTML=JSON.stringify(rightJoystickData)
	
	try{
		ws.send(JSON.stringify(leftJoystickData)+JSON.stringify(rightJoystickData))
	}catch(e){
		//TODO handle the exception
	}
},50);
