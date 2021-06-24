import React, { useEffect, useState } from "react";
import Device from "./Device";
import FetchWrapper from "../utils/FetchWrapper";

const DevicesList = () => {
	const [devices, setDevices] = useState(null);

	useEffect(() => {
		FetchWrapper("/api/devices")
			.then((r) => r.json())
			.then((devices) => {
				setDevices(devices);
			});
	}, []);

	return (
		<div className="row">
			{devices == null ? (
				<div className="text-center mt-5">
					<div className="spinner-border"></div>
				</div>
			) : (
				devices.map((device) => {
					return <Device key={device.mac} device={device} />;
				})
			)}
		</div>
	);
};

export default DevicesList;
