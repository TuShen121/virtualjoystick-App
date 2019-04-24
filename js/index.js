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
manager_1.on("start",function(evt){
	console.log("1"+JSON.stringify(evt))
})
manager_1.on("end",function(evt){
	console.log("1"+JSON.stringify(evt))
})
manager_1.on("move",function(evt){
	console.log("1"+JSON.stringify(evt))
})
manager_2.on("start",function(evt){
	console.log("2"+JSON.stringify(evt))
})
manager_2.on("end",function(evt){
	console.log("2"+JSON.stringify(evt))
})
manager_2.on("move",function(evt){
	console.log("2"+JSON.stringify(evt))
})
