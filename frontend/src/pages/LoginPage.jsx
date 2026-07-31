import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const result = await login(email, password);

            const token = localStorage.getItem("token");

            const payload = JSON.parse(atob(token.split(".")[1]));

            if (payload.role === "leader") {

                navigate("/dashboard");

            } else {

                navigate("/");

            }

        } catch (err) {

            setError(

                err.response?.data?.detail ||

                "Login failed"

            );

        }

    };

    return (

        <div
            style={{
                width: "400px",
                margin: "60px auto"
            }}
        >

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px"
                    }}
                >
                    Login
                </button>

            </form>

            {error &&

                <p style={{ color: "red" }}>
                    {error}
                </p>

            }

            <p>

                Don't have an account?{" "}

                <Link to="/register">

                    Register

                </Link>

            </p>

        </div>

    );

}