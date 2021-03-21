
import { EventEmitter } from "isomorphic-ws";
import {waitFor} from "./utils";
import {NanoNode} from "../src/NanoNode";
import {Ping, Pong} from "../src/actions";
import WebSocket from "isomorphic-ws";

describe("NanoNode", () => {
	test("connect", async () => {
		const websocket = new EventEmitter();
		const nanoNode = new NanoNode(websocket as unknown as WebSocket, "test");
		websocket.emit("open");

		await nanoNode.connected();

		await waitFor(() => {
			expect(nanoNode.isConnected).toBe(true);
		});
	})

	class FakeWebSocket extends EventEmitter{
		send = jest.fn();
	}

	test("ping", async () => {
		const websocket = new FakeWebSocket();
		const nanoNode = new NanoNode(websocket as unknown as WebSocket, "test");
		websocket.emit("open");
		await nanoNode.connected();

		websocket.send = jest.fn((dater) => {
			const pong: Pong = {ack: "pong", id: 88, time: 171283912312}
			setTimeout(() => {
				websocket.emit("message", JSON.stringify(pong))
			}, 100)
		})

		const responseTime = await nanoNode.ping();
		expect(nanoNode.responseTime).toBeGreaterThanOrEqual(100);
		expect(responseTime).toBeGreaterThanOrEqual(100);
	})


})

