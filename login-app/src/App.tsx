import axios from 'axios';
import digitalLogo from "./login.jpeg";

function App() {
  return (
    <div className="grid place-items-center">
      <div className="grid grid-rows-2 overflow-hidden rounded shadow-lg">
        <img src={digitalLogo} alt="" className="row-span-2 w-[300px]" />
        <form
          onSubmit={async (e: React.SyntheticEvent) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              user: { value: string };
              password: { value: string };
            };

            try {
              const response = await axios.post('http://localhost/login', {
                user: target.user.value,
                password: target.password.value
              });
              console.log(response.data); // Handle the response data here
            } catch (error) {
              console.error('Unable to process the /login POST request', error); // Handle errors here
            } 
          }}
          method="post"
          className="row-span-3 grid grid-rows-3 gap-4 p-4"
        >
          <input
            type="text"
            name="user"
            placeholder="username"
            required={true}
            className="rounded border-2 border-solid border-black"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            required={true}
            className="rounded border-2 border-solid border-black"
          />
          <button className="rounded bg-blue-500 text-white" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
