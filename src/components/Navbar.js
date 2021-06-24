import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
	const { token, logout } = useContext(AuthContext);

	const doLogout = (e) => {
		e.preventDefault();
		logout();
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">
					Wake On Lan
				</a>
				{token && (
					<form className="d-flex">
						<button onClick={doLogout} className="btn btn-dark">
							Logout
						</button>
					</form>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
