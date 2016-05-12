var data = require('sdk/self').data;
var panels = require('sdk/panel');
var { setInterval, clearInterval } = require("sdk/timers");

var timeOut = 0;
var stopBtnClicked = 0;
var pauseBtnClicked = 0;
var toBeResumed = 0;

function resetVars(){
	console.log("all variable reseted");
	timeOut = 0;
	stopBtnClicked = 0;
	pauseBtnClicked = 0;
	toBeResumed = 0;
}

var panel_data = panels.Panel({
	width: 380,
	height: 420,
	contentURL: data.url("panel_data.html"),
	contentScriptFile: [data.url("./jquery/jquery.min.js"),data.url("./js/panel.js"),data.url("panel_script.js")]
});

var overlay_data = panels.Panel({
	width: 320,
	height: 240,
	contentURL: data.url("overlay_data.html"),
	contentScriptFile: data.url("overlay_script.js")
});

var second_panel = panels.Panel({
	width: 700,
	height: 400,
	contentURL: data.url("second_panel_data.html"),
	contentScriptFile: [data.url("./jquery/jquery.min.js"),data.url("second_panel_script.js")] 
});

require('sdk/ui/button/action').ActionButton({
	id: "show-timer-panel",
	label: "Show Timer",
	icon: {
		"16": "./time.png",
		"32": "./time.png",
		"64": "./time.png"
	},
	onClick: handleClick
});

function handleClick(state){
	if(timeOut == 0){
		resetVars();
		panel_data.show();
	}else{
		second_panel.show();
	}
}

function setTimer(timeSec){
	console.log("setTimer started");
	var currentTime = Date.parse(new Date());
	var deadline = new Date(currentTime + timeSec*1000);
	updateTimer(deadline);
}

function getRemaningTime(deadline) {

	var t = Date.parse(deadline) - Date.parse(new Date());
	var seconds = Math.floor((t/1000) % 60);
	var minutes = Math.floor( (t/1000/60) % 60 );
  	var hours = Math.floor( (t/(1000*60*60)) % 24 );
  	//var days = Math.floor( t/(1000*60*60*24) );
  		return {
    		'total': t,
    		//'days': days,
    		'hours': hours,
    		'minutes': minutes,
    		'seconds': seconds
  		};	
}

function updateTimer(endtime){
	console.log("starting update function")
	function updateClock(){
		var t = getRemaningTime(endtime);
		console.log(t.total);
		second_panel.port.emit("timeObj" , t);
		if (stopBtnClicked == 1) {
			clearInterval(timeinterval);
			resetVars();
			console.log("tesume " + toBeResumed);
		} else
			if (pauseBtnClicked == 1) {
				timeOut = t.total/1000;
				clearInterval(timeinterval);
				toBeResumed = 1;
				pauseBtnClicked = 0;
				console.log("paused at " + timeOut);
			} else
				if(t.total <= 0){
					console.log("clearing clock");
					clearInterval(timeinterval);
					timeOut = 0;
					loadOverlay();
				}
	}
	updateClock();
	var timeinterval = setInterval(updateClock ,1000);

}


function loadOverlay(){
	console.log("Starting Second overlay");
	overlay_data.show();
}

panel_data.on("show", function(){
	panel_data.port.emit("show");
});

panel_data.port.on("timeSec" , function (timeSec){
	console.log("timeSec recived value = " + timeSec);
	console.log("hiding panel 1");
	panel_data.hide();
	console.log("Setting global timeout to " + timeSec);
	timeOut = timeSec;
	console.log("Setting timer with value " + timeSec);
	setTimer(timeOut);
});

overlay_data.port.on("clicked", function(){
	console.log("second overlay complete");
	overlay_data.hide();
});

second_panel.port.on("stopBtnClicked" , function(){
	resetVars();
	stopBtnClicked = 1;
});

second_panel.port.on("closeBtnClicked" , function(){
	second_panel.hide();
});

second_panel.port.on("pauseBtnClicked" , function(){
	if(toBeResumed == 1){
		toBeResumed = 0;
		setTimer(timeOut);
	}else {
		pauseBtnClicked = 1;
	}
});