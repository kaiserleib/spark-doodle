package doodle;

import static spark.Spark.*;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.jetty.websocket.api.Session;

public class Application {
	
	static List<Session> sessions = new ArrayList<>();
	
	public static void main( String[] args) {
		staticFileLocation("public");
		webSocket("/doodle", DoodleWebSocket.class);
		init();
        get("/hello", (req, res) -> {
            return "Hello  World!";
        });
    }
	
	//Sends a message from one user to all users, along with a list of current usernames
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
}
