const FetchWrapper = (...args) => {
	if (!args[1]) {
		args[1] = {
			headers: {},
		};
	}

	args[1].headers = {
		...args[1].headers,
		Authorization: localStorage.getItem("token"),
	};

	let promise = fetch.apply(this, args);

	promise.then((r) => {
		if (r.status === 403) {
			/* To optimize? Idk how to edit the AuthContext directly */
			localStorage.removeItem("token");
			window.location = "/";
		}
	});

	return promise;
};

export default FetchWrapper;
