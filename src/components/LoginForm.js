import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = () => {
	const [token, setToken] = useState("");
	const { login } = useContext(AuthContext);

	const doLogin = (e) => {
		e.preventDefault();
		login(token);
	};

	return (
		<form className="mx-auto mt-5" style={{ maxWidth: "300px" }}>
			<div className="form-group">
				<input
					type="password"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					className="form-control"
					placeholder="Token"
				/>
			</div>
			<div className="d-grid gap-2 mt-3">
				<button onClick={doLogin} type="submit" className="btn btn-dark">
					Login
				</button>
			</div>
		</form>
	);
};

export default LoginForm;
