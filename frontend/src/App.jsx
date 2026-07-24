import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import CitizenPage from "./pages/CitizenPage";

import DashboardPage from "./pages/DashboardPage";


function App() {

    return (

        <BrowserRouter>

            <nav>

                <Link to="/">
                    Citizen
                </Link>

                {" | "}

                <Link to="/dashboard">
                    Leader Dashboard
                </Link>

            </nav>


            <Routes>

                <Route

                    path="/"

                    element={
                        <CitizenPage />
                    }

                />


                <Route

                    path="/dashboard"

                    element={
                        <DashboardPage />
                    }

                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;