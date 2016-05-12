var hourArea = document.getElementById("hh");
var minuteArea = document.getElementById("mm");
var secondArea = document.getElementById("ss");
var startBtn = document.getElementById("startBtn");


startBtn.onclick = function (){
	console.log("onclick iniciated");
	var hour = checkNull(hourArea.value);
	var minute = checkNull(minuteArea.value);
	var second = checkNull(secondArea.value);
	console.log("variable Check done");
	
	var timeSec = hour*60*60 + minute*60 + second;

	console.log("value of timeSec is " +timeSec);
	console.log("sending timeSec");
	
	self.port.emit("timeSec", timeSec);
};

self.port.on("show" , function onShow(){
	hourArea.focus();
});

function checkNull(varToCheck){
	console.log("checking variable " + varToCheck );
	if(!varToCheck){
		return 0;
	}else{
		return varToCheck;
	}
}