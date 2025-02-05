import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import VehicleInsurance from "./pages/vehicle-insurance";
import HealthInsurance from "./pages/health-insurance";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/vehicle-insurance',
          element: <VehicleInsurance />
        },
        {
          path: '/life-insurance',
          element: <HealthInsurance />
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ]
    }
  ]
)

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
