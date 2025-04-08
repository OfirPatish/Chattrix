import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout";
import Chat from "../features/chat";
import Profile from "../features/profile";
import Settings from "../features/settings";
import Login from "../features/auth/login";
import Register from "../features/auth/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
