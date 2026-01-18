"use client";

import { createContext, useContext, useState, useRef } from "react";
import { getAuthToken, sendKeepAliveMessage } from "app/utils/deepgramUtils";

const DeepgramContext = createContext();

const DeepgramContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [socketState, setSocketState] = useState(-1);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const keepAlive = useRef();
  const maxReconnectAttempts = 5;

  const connectToDeepgram = async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("Max reconnect attempts reached.");
      // we don't actually know this is a rate limit, but want to show this anyways
      setRateLimited(true);
      return;
    }

    setSocketState(0); // connecting

    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        console.error("Failed to get authentication token. Check your DEEPGRAM_API_KEY.");
        setSocketState(2); // error
        return;
      }
      console.log("Got auth token, connecting to WebSocket...");

      const newSocket = new WebSocket("wss://agent.deepgram.com/v1/agent/converse", [
        "bearer",
        authToken,
      ]);

      const onOpen = () => {
        setSocketState(1); // connected
        setReconnectAttempts(0); // reset reconnect attempts after a successful connection
        console.log("WebSocket connected.");
        keepAlive.current = setInterval(sendKeepAliveMessage(newSocket), 10000);
      };

      const onError = (err) => {
        setSocketState(2); // error
        console.error("Websocket error", err);
        console.error("WebSocket readyState:", newSocket.readyState);
        console.error("WebSocket URL:", newSocket.url);
      };

    const onClose = () => {
      clearInterval(keepAlive.current);
      setSocketState(3); // closed
      console.info("WebSocket closed. Attempting to reconnect...");
      setTimeout(connectToDeepgram, 3000); // reconnect after 3 seconds
      setReconnectAttempts((attempts) => attempts + 1);
    };

    const onMessage = () => {
      // console.info("message", e);
    };

      newSocket.binaryType = "arraybuffer";
      newSocket.addEventListener("open", onOpen);
      newSocket.addEventListener("error", onError);
      newSocket.addEventListener("close", onClose);
      newSocket.addEventListener("message", onMessage);

      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting to Deepgram:", error);
      setSocketState(2); // error
    }
  };

  return (
    <DeepgramContext.Provider
      value={{
        socket,
        socketState,
        rateLimited,
        connectToDeepgram,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram() {
  return useContext(DeepgramContext);
}

export { DeepgramContextProvider, useDeepgram };
