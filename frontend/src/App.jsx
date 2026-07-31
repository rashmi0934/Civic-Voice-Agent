import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CitizenPage from "./pages/CitizenPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function PrivateRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {

        return <Navigate to="/login" />;

    }

    return children;
}

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <CitizenPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}