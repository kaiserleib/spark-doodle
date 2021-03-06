package doodle;

import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import java.io.*;

@WebSocket
public class DoodleWebSocket {
    
    @OnWebSocketConnect
    public void connected(Session session) {
        Application.sessions.add(session);
    }

    @OnWebSocketClose
    public void closed(Session session, int statusCode, String reason) {
        Application.sessions.remove(session);
    }

    @OnWebSocketMessage
    public void message(String message) throws IOException {
        Application.broadcastMessage(message);
    }
}