import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import PropTypes from "prop-types";
import axios from "axios";

IntrusionList.propTypes = {
  intrusionList: PropTypes.node.isRequired,
};

IntrusionTypeChip.propTypes = {
  intrusionType: PropTypes.node.isRequired,
};

function IntrusionTypeChip({ intrusionType }) {
  const chipColor =
    intrusionType === "Sql Injection"
      ? "#5795cb"
      : intrusionType === "Denial Of Service"
      ? "#5a8476"
      : intrusionType === "Tampering"
      ? "#978162"
      : "grey";
  return (
    <div
      className="rounded text-white p-2"
      style={{ backgroundColor: chipColor }}
    >
      <p>{intrusionType}</p>
    </div>
  );
}

function IntrusionList({ intrusionList }) {
  if (intrusionList.length > 0) {
    return (
      <div className="p-4 rounded border border-slate-200 flex flex-col gap-4">
        {intrusionList.map((intrusion) => (
          <div
            key={intrusion.id}
            className="rounded overflow-hidden flex flex-col  bg-slate-100 border shadow-md"
          >
            {/* header row */}
            <div className="flex justify-between items-center text-white bg-slate-600 p-2">
              <IntrusionTypeChip intrusionType={intrusion.intrusionType} />
              <div className="px-2">{intrusion.date}</div>
            </div>

            {/* description */}
            <p className="p-2">{intrusion.info}</p>
          </div>
        ))}
      </div>
    );
  }

  return <h4>No Detected Intrusions</h4>;
}

function App() {
  const [intrusionList, setIntrusionList] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost", { path: "/ids-server/" });

    socket.on("intrusion-detected", (data) => {
      setIntrusionList(data);
    });

    socket.on("intrusions-cleared", () => setIntrusionList([]));
    // Cleanup on component unmount
    return () => {
      socket.off("connect");
      socket.off("intrusion-detected");
      socket.off("intrusions-cleared");
      socket.close();
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  async function clearIntrusionsListAsync() {
    try {
      await axios({
        method: "purge",
        url: "http://localhost/clear-intrusions",
      });
    } catch (error) {
      console.error(
        "Unable to process the /clear-intrusions PURGE request",
        error
      ); 
    }
  }

  return (
    <div className="grid grid-rows-[min-content_auto_min-content]">
      {/* header */}
      <div className="grid grid-cols-3 content-center h-20 px-4 shadow-md shadow-slate-200 bg-[#F5CF02] items-center sticky top-0">
        <img src="./unsw-logo.png" alt="" style={{ height: "80px" }} />
        <h1 className="place-self-center">Intrusion Detection System</h1>
      </div>

      {/* body */}
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between">
          <h2 className="text-lg">Detected Intrusions</h2>
          <button
            hidden={intrusionList.length === 0}
            className="rounded border px-4 py-2"
            onClick={() => clearIntrusionsListAsync()}
          >
            Clear Intrusions
          </button>
        </div>
        {/* intrusions list */}
        <IntrusionList intrusionList={intrusionList} />
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
