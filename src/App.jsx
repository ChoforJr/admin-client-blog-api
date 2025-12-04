import "./App.css";

import { Link } from "react-router-dom";
//This is how you import the icon component, I have bookmark the site on my browser,so you can go and learn more there
import { Camera } from "lucide-react";

const App = () => {
  return (
    <div>
      <h1>Hello from the main page of the app!</h1>
      <p>Here are some examples of links to other pages</p>
      <nav>
        <ul>
          <li>
            <Link to="profile">Profile page</Link>
          </li>
        </ul>
      </nav>
      {/*This below is from a Icon component library and I added it because I think I might be useful in speed thinks up */}
      <Camera color="red" size={48} />
    </div>
  );
};

export default App;
