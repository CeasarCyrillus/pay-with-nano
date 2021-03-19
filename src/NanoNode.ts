import WebSocket, {EventEmitter} from "isomorphic-ws";
import {Action, BaseMessage, Ping, Pong} from "./actions";

export class NanoNode {
	public isConnected: boolean;
	public responseTime: number | null;
	private ws: WebSocket;

	constructor() {
		this.ws = null;
		this.isConnected = false;
		this.responseTime = null;
	}

	public connect = (websocket: EventEmitter) => {
		this.ws = websocket as WebSocket;
		console.log(this.ws.readyState)
		return new Promise<void>((resolve, reject) => {
			this.ws.addListener("open", () => {
				this.isConnected = true;
				console.log(this.ws.readyState)
				resolve();
			})
		});
	}

	public ping = async () => {
		const sendTime = Date.now();
		await this.send<Pong>(new Ping());
		const receiveTime = Date.now();
		this.responseTime = receiveTime - sendTime;
		return Promise.resolve(this.responseTime);

	}

	public send = <T extends BaseMessage>(action: Action) => {
		return new Promise<T>((resolve, reject) => {
			const timeoutTimer = setTimeout(() => {
				reject("no response received");
			}, 5000);

			this.ws.addListener("message", (message) =>{
				clearTimeout(timeoutTimer);
				resolve(JSON.parse(message.toString()) as T);
			})
			this.ws.send(JSON.stringify(action));
		})
	}
}
