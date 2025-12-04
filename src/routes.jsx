import App from "./App";
import Profile from "./Profile";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    // This is a catch-all for errors that occur within the <App /> component or its children.
    errorElement: <ErrorPage />,
  },
  {
    path: "profile/:name?",
    element: <Profile />,
  },
];

export default routes;
