import {NanoNode} from "./NanoNode";
import WebSocket from "isomorphic-ws";
const pingNodes = async () => {
	const nanoNode = new NanoNode();
	const websocket = new WebSocket("wss://ws.powernode.cc/");
	await nanoNode.connect(websocket)
	const responseTime = await nanoNode.ping();
	console.log(responseTime);
}

pingNodes();