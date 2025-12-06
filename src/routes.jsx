import App from "./App Components/App";
import HomePage from "./HomePage Components/HomePage";
import Posts from "./Posts Components/Posts";
import SignIn from "./SignIn Components/SignIn";
import Account from "./Account Components/Account";
import Users from "./Users Components/Users";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    // This is a catch-all for errors that occur within the <App /> component or its children.
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "posts", element: <Posts /> },
      { path: "signIn", element: <SignIn /> },
      { path: "account", element: <Account /> },
      { path: "users", element: <Users /> },
    ],
  },
];

export default routes;
