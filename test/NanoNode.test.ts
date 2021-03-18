
import WebSocket, { EventEmitter } from "isomorphic-ws";
import {NanoNode} from "../src/app";
describe("NanoNode", () => {
	test("connect", async () => {
		const websocket = new EventEmitter();
		const nanoNode = new NanoNode(websocket);

		nanoNode.connect();
		websocket.emit("open");

		await waitFor(() => {
			expect(nanoNode.isConnected).toBeTruthy()
		});
	})
})


const waitFor = (func: () => void, timeout: number = 2000) => {
	const startTime = Date.now();
	return new Promise<void | string>((resolve, reject) => {
		while(true){
			const now = Date.now();
			try {
				func();
				return resolve();
			}
			catch (e) {
				if(now - startTime > timeout){
					return reject(e);
				}
			}
		}
	});
}

