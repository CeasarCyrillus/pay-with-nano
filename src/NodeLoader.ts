import {GenerateWorkResponse, postJson} from "./utils";

interface NodeDetails
{
	url: string,
	name: string
}

export class NanoNode {
	public readonly name: string;
	private readonly url: string;
	public latency: number;
	public isOnline: boolean;
	public isWorkNode: boolean;

	constructor(name: string, url: string) {
		this.name = name;
		this.url = url;
		this.isOnline = false;
	}

	async load(): Promise<void> {
		const getLatencyPromise = this.getLatency().then(latency => {
			this.isOnline = true;
			this.latency = latency;
		}).catch(() => {
			this.latency = 0;
			this.isOnline = false;
		});

		const getIsWorkNodePromise = this.getIsWorkNode().then(isWorkNode => {
			this.isWorkNode = isWorkNode;
		}).catch(() => {
			this.isWorkNode = false;
		});

		await getLatencyPromise;
		await getIsWorkNodePromise
	}

	private async getLatency() {
		const versionRequest = {
			"action": "version"
		}

		const startTime = Date.now();
		try{
			await postJson(this.url, versionRequest);
		} catch (e){
			return Promise.reject()
		}

		const endTime = Date.now();
		return Promise.resolve(endTime - startTime);
	}

	private async getIsWorkNode() {
		const workGenerateRequest = {
			action: "work_generate",
			hash: "95D908F79D2816A995C5A2836B40069273C039B751033F3846DD8C65E088CAC8"
		}

		try{
			const workGenerateResponse = await postJson<GenerateWorkResponse>(this.url, workGenerateRequest)
			return workGenerateResponse.work !== undefined;
		}
		catch (e){
			return false;
		}

	}
}

export class NodeLoader {
	private nodeDetails: NodeDetails[];
	public allNodes: NanoNode[] = [];
	constructor(nodeDetails: NodeDetails[]) {
		this.nodeDetails = nodeDetails;
	}

	loadAllNodes = async () => {
		this.allNodes = this.nodeDetails.map(nodeDetail => new NanoNode(nodeDetail.name, nodeDetail.url));
		await Promise.all(this.allNodes.map(nanoNode => nanoNode.load()));
	}

	getProcessNodes = {

	}
}