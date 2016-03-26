package doodle;

import static spark.Spark.*;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.jetty.websocket.api.Session;

public class Application {
	
	static List<Session> sessions = new ArrayList<>();
	
	public static void main( String[] args) {
		port(getHerokuAssignedPort());
		staticFileLocation("public");
		webSocket("/doodle", DoodleWebSocket.class);
		init();
        get("/hello", (req, res) -> {
            return "Hello  World!";
        });
    }
	
	// Broadcasts the given string to all connected websocket sessions
	public static void broadcastMessage(String message) {
	    sessions.stream().filter(Session::isOpen).forEach(session -> {
	        try {
	    		System.out.println("BROADCASTING " + message);
	            session.getRemote().sendString(message);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    });
	}
	
	// Gets the assigned Heroku port, or 4567 if we're not on Heroku
	static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 4567; 
    }
}
