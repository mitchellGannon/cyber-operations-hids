import { FormEvent, useState } from "react";
import digitalLogo from "./login.jpeg";

function App() {
  return ( 
    <div className="grid place-items-center">
      <div className="shadow-lg rounded grid grid-rows-2 overflow-hidden">
        <img src={digitalLogo} alt="" className="row-span-2 w-[300px]"/>
        <form onSubmit={(e: React.SyntheticEvent) => {
            e.preventDefault();
          const target = e.target as typeof e.target & {
            user: { value: string };
            password: { value: string };
          };
          

        }} method="post" className="grid grid-rows-3 gap-4 p-4 row-span-3">
          <input type="text" name="user" placeholder="username" required={true} className="rounded border-solid border-2 border-black"/>
          <input type="password" name="password" placeholder="password" required={true} className="rounded border-solid border-2 border-black"/>
          <button className="rounded bg-blue-500 text-white" type="submit">Login</button>
        </form>
      </div>
    </div> 
  );
}

export default App;
