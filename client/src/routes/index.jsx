import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../Layout";
import { Home } from "../pages";
import { Login, Register, AdminPanel, CouponCapture } from "../components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="coupon-capture" element={<CouponCapture />} />
      </Route>
    </Route>
  )
);

export { router };
