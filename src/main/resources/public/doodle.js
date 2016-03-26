document.addEventListener("DOMContentLoaded", function() {
	var mouse = { 
		click: false,
      	move: false,
      	pos: {x:0, y:0},
      	pos_prev: false
   	};
	
	var canvas  = document.getElementById('doodle');
	var context = canvas.getContext('2d');
	
	canvas.onmousedown = function(e) {
		mouse.click = true;
	};
	
	canvas.onmouseup = function(e) {
		mouse.click = false;
	};
	
	canvas.onmousemove = function(e) {
		mouse.pos.x = e.clientX;
		mouse.pos.y = e.clientY;
		mouse.move = true;
	};
	
	var eraser = document.getElementById('eraser');
	eraser.onclick = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	//Establish the WebSocket connection and set up event handlers
	var socket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/doodle");
	
	socket.onmessage = function (event) {
   		var parsedData = JSON.parse(event.data);
		var line = parsedData.line;
		context.beginPath();
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
		context.stroke();
	};
	
	// main loop, running every 25ms
    function loop() {
    	// check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            var data = {line: [{x: mouse.pos.x, y: mouse.pos.y}, {x: mouse.pos_prev.x, y: mouse.pos_prev.y}]};
            socket.send(JSON.stringify(data));
         
            mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(loop, 25);
   }
   loop();
});
