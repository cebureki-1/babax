import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { TimeAnalysis } from "./pages/TimeAnalysis";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { Marketplace } from "./pages/Marketplace";
import { Cart } from "./pages/Cart";
import { ProductDetail } from "./pages/ProductDetail";
import { Quiz } from "./pages/Quiz";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "marketplace", Component: Marketplace },
      { path: "product/:id", Component: ProductDetail },  
      { path: "cart", Component: Cart },  
      { path: "time-analysis", Component: TimeAnalysis },
      { path: "history", Component: History },
      { path: "settings", Component: Settings },
      { path: "quiz", Component: Quiz },
      { path: "*", Component: NotFound },
    ],
  },
]);