import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Test from "./views/Dashboard";
import Preselection from "./views/Preselection";
import { ConfigProvider } from "./contexts/configContext";
import { CurrentIndicatorProvider } from "./contexts/indicatorContext";
import { SecondIndicatorProvider } from "./contexts/secondIndicatorContext";
import { CurrentInfoProvider } from "./contexts/currentInfoContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Preselection />,
  },
  {
    path: "/dashboard",
    element: <Test />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <CurrentInfoProvider>
        <CurrentIndicatorProvider>
          <SecondIndicatorProvider>
          <RouterProvider router={router} />
          </SecondIndicatorProvider>
        </CurrentIndicatorProvider>
      </CurrentInfoProvider>
    </ConfigProvider>
  </React.StrictMode>
);
