import WebSocket, {EventEmitter} from "isomorphic-ws";
import {AccountBalance, AccountBalanceResponse, Action, BaseMessage, Ping, Pong} from "./actions";

export class NanoNode {
	public isConnected: boolean;
	public responseTime: number | null;
	private ws: WebSocket;
	public name: string;

	constructor(websocket: WebSocket, name: string) {
		this.ws = websocket;
		this.name = name;
		this.ws.addListener("open", () => {
			this.isConnected = true;
		})

		this.isConnected = false;
		this.responseTime = null;
	}

	public connected = () => {
		return new Promise<void>((resolve => {
			if(this.isConnected){
				resolve();
			}

			if (this.ws.readyState === WebSocket.OPEN) {
				this.isConnected = true;
				resolve()
			} else {
				this.ws.addListener("open", () => {
					this.isConnected = true;
					resolve();
				})
			}
		}))
	}

	public connect = (websocket: EventEmitter) => {
		this.ws = websocket as WebSocket;
		return new Promise<void>((resolve, reject) => {
			this.ws.addListener("open", () => {
				this.isConnected = true;
				resolve();
			})
		});
	}

	public ping = async () => {
		const sendTime = Date.now();
		const pong = await this.send<Pong>(new Ping());
		console.log(pong);
		const receiveTime = Date.now();
		this.responseTime = receiveTime - sendTime;
		return Promise.resolve(this.responseTime);

	}

	public send = <T extends BaseMessage>(action: any) => {
		return new Promise<T>((resolve, reject) => {
			const timeoutTimer = setTimeout(() => {
				reject("no response received");
			}, 5000);

			this.ws.addListener("message", (message) => {
				clearTimeout(timeoutTimer);
				resolve(JSON.parse(message.toString()) as T);
			})
			console.log("sending")
			console.log(JSON.stringify(action))
			this.ws.send(JSON.stringify(action));
		})
	}

	async getBalance(address: string) {
		const balanceAction = new AccountBalance(address);
		return this.send<AccountBalanceResponse>(balanceAction);
	}
}
