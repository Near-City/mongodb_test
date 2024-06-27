import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Dashboard from "./views/Dashboard";
import Test from "./views/Test";

import { ConfigProvider } from "./contexts/configContext";
import { CurrentIndicatorProvider } from "./contexts/indicatorContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <CurrentIndicatorProvider>
        <RouterProvider router={router} />
      </CurrentIndicatorProvider>
    </ConfigProvider>
  </React.StrictMode>
);
