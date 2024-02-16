import { useEffect, useState } from "react";
import io from "socket.io-client";
import './App.css';

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
    <div className="grid grid-rows-[min-content_auto_min-content]">
      {/* header */}
      <div className="grid grid-cols-3 content-center h-20 px-4 shadow-md shadow-slate-200 bg-[#F5CF02] items-center">
        <img src="./unsw-logo.png" alt="" style={{ height: '80px' }} />
        <h1 className="place-self-center">Intrusion Detection System</h1>
      </div>

      { /* body */ }
      <div className="flex flex-col gap-4 p-8">
        <h2 className="text-lg">Detected Intrusions</h2>
        {/* intrusions list */}
        <div className="rounded border">
          {intrusionList.map((intrusion, index) => (
            <p key={index}>{intrusion.info}</p>
          ))}
        </div>
      </div>

      <footer className="grid grid-cols-3 p-4 bg-slate-800 text-white items-center h-16">
        <span>Mitchell Gannon</span>
        <span className="place-self-center">z5433412</span>
        <span className="justify-self-end">Cyber Operations</span>
      </footer>
    </div>
  );
}
export default App;
