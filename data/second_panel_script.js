var hoursSpan = $( ".hours" );
var minutesSpan = $( ".minutes" );
var secondsSpan = $(" .seconds" );


var pauseBtn = $( "#pauseBtn" );
var stopBtn =  $( "#stopBtn" );
var btnDock =  $( "#btnDock" );

var closeBtn = $( "#closeBtn" );

var pause = 0;
var stop = 0;


self.port.on("timeObj" , function (t){
	console.log("timeObj recived" + t.hours + t.minutes + t.seconds); 
    hoursSpan.text(function (){
    	return ('0' + t.hours).slice(-2);
    });
    minutesSpan.text(function (){
    	return ('0' + t.minutes).slice(-2);
    });
    secondsSpan.text(function (){
    	return ('0' + t.seconds).slice(-2);
    });
});

stopBtn.click(function(){
	self.port.emit("stopBtnClicked");
	pause = 0;
	stop = 1;
	pauseBtn.html("<i class='fa fa-pause-circle fa-3x'></i>");
});

closeBtn.click(function(){
	self.port.emit("closeBtnClicked");
});

pauseBtn.click(function(){
	self.port.emit("pauseBtnClicked");
	if (pause == 0 && stop == 0) {
		pause = 1;
		pauseBtn.html("<i class='fa fa-play-circle fa-3x'></i>");
	}else if (pause == 1){
		pause = 0;
		pauseBtn.html("<i class='fa fa-pause-circle fa-3x'></i>");
	}
}); 