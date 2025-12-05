import App from "./App Components/App";
import HomePage from "./HomePage Components/HomePage";
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
    ],
  },
];

export default routes;
