import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Dashboard from "./views/Dashboard";
import Test from "./views/Test";

import { ConfigProvider } from "./contexts/configContext";
import { CurrentIndicatorProvider } from "./contexts/indicatorContext";
import { CurrentInfoProvider } from "./contexts/currentInfoContext";

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
      <CurrentInfoProvider>
        <CurrentIndicatorProvider>
          <RouterProvider router={router} />
        </CurrentIndicatorProvider>
      </CurrentInfoProvider>
    </ConfigProvider>
  </React.StrictMode>
);
