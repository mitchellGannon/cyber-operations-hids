import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [intrusionList, setIntrusionList] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost", { path: "/ids-server/" });

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
    <div className="grid gap-4">
      {/* header */}
      <div className="grid grid-cols-3 content-center h-20 px-4 shadow-md shadow-slate-200 bg-[#F5CF02]">
        <img src="./unsw-logo.png" alt="" style={{ height: '80px' }} />
        <h1>Intrusion Detection System</h1>
      </div>

      {/* intrusions list */}
      <div className="rounded border">
        {intrusionList.map((intrusion, index) => (
          <p key={index}>{intrusion.info}</p>
        ))}
      </div>

      <footer className="grid grid-cols-3 p-4">
        <span>Mitchell Gannon</span>
        <span className="place-self-center">z5433412</span>
        <span className="place-self-end">Cyber Operations</span>
      </footer>
    </div>
  );
}
export default App;
