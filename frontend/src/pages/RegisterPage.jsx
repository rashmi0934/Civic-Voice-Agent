import { useState } from "react";
import { register } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState("citizen");

    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await register({
                name,
                email,
                password,
                role
            });

            alert("Registration Successful");

            navigate("/login");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed"
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

            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <option value="citizen">Citizen</option>
                    <option value="leader">Leader</option>
                </select>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px"
                    }}
                >
                    Register
                </button>

            </form>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>

    );

}