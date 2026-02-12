import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AgentLayout } from "./components/AgentLayout";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Account } from "./pages/Account";
import { Checkout } from "./pages/Checkout";
import { Search } from "./pages/Search";
import { Profile } from "./pages/Profile";
import { Addresses } from "./pages/Addresses";
import { AddressMap } from "./pages/AddressMap";
import { Wallet } from "./pages/Wallet";
import { Orders } from "./pages/Orders";
import { OrderDetail } from "./pages/OrderDetail";
import { OrderTracking } from "./pages/OrderTracking";
import { Favorites } from "./pages/Favorites";
import { Settings } from "./pages/Settings";
import { Support } from "./pages/Support";
import { PaymentMethods } from "./pages/PaymentMethods";
import { Subscriptions } from "./pages/Subscriptions";
import { DeliveryAgent } from "./pages/DeliveryAgent";
import { AgentEarnings } from "./pages/AgentEarnings";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

// Get base path from Vite config (for GitHub Pages deployment)
const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    Component: Login,
  },
  {
    path: "/auth/signup",
    Component: Signup,
  },
  {
    path: "/agent",
    Component: AgentLayout,
    children: [
      { path: "dashboard", Component: DeliveryAgent },
      { path: "earnings", Component: AgentEarnings },
      { index: true, Component: DeliveryAgent },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: Search },
      { path: "categories", Component: Categories },
      { path: "categories/:categoryId", Component: Categories },
      { path: "product/:productId", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "account", Component: Account },
      { path: "account/profile", Component: Profile },
      { path: "account/addresses", Component: Addresses },
      { path: "account/address-map", Component: AddressMap },
      { path: "account/wallet", Component: Wallet },
      { path: "account/orders", Component: Orders },
      {
        path: "account/order-detail/:orderId",
        Component: OrderDetail,
      },
      {
        path: "account/order/:orderId",
        Component: OrderTracking,
      },
      { path: "account/favorites", Component: Favorites },
      {
        path: "account/subscriptions",
        Component: Subscriptions,
      },
      {
        path: "account/payment-methods",
        Component: PaymentMethods,
      },
      { path: "account/settings", Component: Settings },
      { path: "account/support", Component: Support },
    ],
  },
], {
  basename: basename,
});