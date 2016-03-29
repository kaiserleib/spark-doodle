document.addEventListener("DOMContentLoaded", function() {
	var mouse = { 
		click: false,
      	move: false,
      	pos: {x:0, y:0},
      	pos_prev: false
   	};
	
	var canvas  = document.getElementById('doodle');
	var context = canvas.getContext('2d');
	
	
	//Establish the WebSocket connection and set up event handlers
	var socket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/doodle");
	
	canvas.onmousedown = function(e) {
		startDrawing();
	};
	
	handleTouchStart = function(e) {
	    e.preventDefault();
	    startDrawing();
	}
	
	startDrawing = function() {
	    mouse.click = true;
		
		//re-establish the websocket on clicks so that we can keep doodling after heroku kills us
		if (socket.readyState === 0) {
	        socket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/doodle");
	    }
	}
	
    sendWhenConnected = function (message, interval) {
        if (socket.readyState === 1) {
            socket.send(message);
        } else {
            setTimeout(function () {
                sendWhenConnected(socket.send(message), interval);
            }, interval);
        }
    };
	
	canvas.onmouseup = function(e) {
		stopDrawing();
	};
	
	handleTouchStop = function(e) {
	    stopDrawing();
	}
	
	stopDrawing = function() {
	    mouse.click = false;
	}
	
	canvas.onmousemove = function(e) {
		sendPenPosition(e.clientX, e.clientY);
	};
	
	handleTouchMove = function(e) {
	    sendPenPosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	}
	
	sendPenPosition = function(xpos, ypos) {
        mouse.pos.x = xpos;
        mouse.pos.y = ypos;
        mouse.move = true;
	}
	
	canvas.addEventListener("touchstart", handleTouchStart, false);
	canvas.addEventListener("touchmove", handleTouchMove, false);
	canvas.addEventListener("touchCancel", handleTouchStop, false);
	canvas.addEventListener("touchEnd", handleTouchStop, false);
	
	var eraser = document.getElementById('eraser');
	eraser.onclick = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
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
            sendWhenConnected(JSON.stringify(data), 1000);
         
            mouse.move = false;
      }
      
      // conditional to avoid always drawing a line from the origin on touch events
      if (mouse.pos.x != 0) {
          mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      }
      setTimeout(loop, 25);
   }
   loop();
});
