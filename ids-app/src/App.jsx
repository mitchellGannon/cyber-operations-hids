import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [intrusionList, setIntrusionList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost", { path: "/ids-server/" });

    // Setup event listeners
    socket.on("connect", () => {
      console.log("connected to server..");
      setIsConnected(true);
    });

    socket.on("intrusion-detected", (data) => {
      setIntrusionList(data);
    });
    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("intrusion-detected");
      socket.close();
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      {isConnected && <h1>Detected Intrusions</h1>}
      {intrusionList.map((intrusion, index) => (
        <p key={index}>{intrusion.info}</p>
      ))}
    </div>
  );
}
export default App;
