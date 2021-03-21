import nanoNodes from "./publicNodes.json"
import {NanoNode, NodeLoader} from "./NodeLoader";

const main = async () => {
	const nodeLoader = new NodeLoader(nanoNodes);
	await nodeLoader.loadAllNodes();

	nodeLoader.allNodes.forEach(nanoNode => {
		console.log(nanoNode.name, "ONLINE:", nanoNode.isOnline, "LATENCY:", nanoNode.latency, "WORK:", nanoNode.isWorkNode);
	});
}

main()