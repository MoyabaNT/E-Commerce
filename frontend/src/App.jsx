import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider, Route,
} from "react-router-dom";
import SignUp from "../../../BBBEECAL/frontend/src/Components/Forms/SignUp";
import LogIn from "./Forms/LogIn";
import UpSign from "./Forms/UpSign";
import Home from "./Home";
import LandingPage from "./Components/LandingPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route index='/Home' element={<Home />} />
    <Route path='/UpSign' element={<UpSign />}></Route>
    <Route path='/Login' element={<LogIn />} />
    <Route path='/LandingPage' element={<LandingPage />} />
    </>
  )
)

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App