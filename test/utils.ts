export const waitFor = (func: () => void, timeout: number = 1000) => {
	const startTime = Date.now();
	return new Promise<void>((resolve, reject) => {
		while (true) {
			const now = Date.now();
			try {
				func();
				return resolve();
			} catch (e) {
				if (now - startTime > timeout) {
					return reject(e);
				}
			}
		}
	});
}
