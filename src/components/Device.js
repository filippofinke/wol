import { useState, useEffect } from "react";
import FetchWrapper from "../utils/FetchWrapper";

const Device = (props) => {
	const [status, setStatus] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);
	const [wakingUp, setWakingUp] = useState(false);

	const getStatus = () => {
		FetchWrapper("/api/device/" + props.device.mac)
			.then((r) => r.text())
			.then((status) => {
				setStatus(status);
				setLastUpdate(new Date().toLocaleTimeString());
			});
	};

	useEffect(() => {
		getStatus();
		let interval = setInterval(getStatus, 5000);
		return function cleanup() {
			clearInterval(interval);
		};
		// eslint-disable-next-line
	}, []);

	const getClassName = (status) => {
		if (status === "Online") return "text-success";
		else if (status === "Offline") return "text-danger";
		else if (status === "Unknown") return "text-warning";
		else return "";
	};

	const wakeUp = () => {
		setWakingUp(true);
		FetchWrapper("/api/device/" + props.device.mac, { method: "POST" });
	};

	return (
		<div className="col-md-6 col-lg-4 mt-2">
			<div className="card m-1">
				<div className="card-body text-center">
					<h5 className="card-title">{props.device.name}</h5>
					<p className="card-text">
						MAC: {props.device.mac}
						<br />
						IP: {props.device.ip}
						<br />
						Status: <span className={getClassName(status)}>{status ?? "Loading..."}</span>
					</p>

					<div className="d-grid gap-2">
						<button
							disabled={wakingUp}
							onClick={wakeUp}
							className={`btn btn-dark ${status === "Offline" ? "" : "invisible"}`}
							type="button"
						>
							{wakingUp ? "Waking up..." : "Wake up"}
						</button>
					</div>
					<small className="text-muted">
						<span>{lastUpdate ?? "Loading..."}</span>
					</small>
				</div>
			</div>
		</div>
	);
};

export default Device;
