import fetch from "isomorphic-fetch";
import {SignedBlock} from "nanocurrency-web/dist/lib/block-signer";
import {block, tools} from "nanocurrency-web";

export const postJson = async <T>(nodeUrl: string, data: object) => {
	const request = {
		method: "POST",
		body: JSON.stringify(data)
	};
	const result = await fetch(nodeUrl, request);
	if(result.status === 200) {
		return await result.json() as T;
	}

	const responseText = await result.text();
	return Promise.reject(`[${result.status} ${result.statusText}] ${responseText}`)
}

interface AccountBalanceResponse {
	balance: string;
	pending: string;
}

const getBalance = async (nodeUrl: string, account: string) => {
	const accountBalanceRequest = {
		action: "account_balance",
		account: account
	};
	return await postJson<AccountBalanceResponse>(nodeUrl, accountBalanceRequest);
}

interface AccountInfoResponse {
	frontier: string;
	open_block: string;
	representative_block: string;
	balance: string;
	modified_timestamp: string;
	block_count: string;
	account_version: string;
	confirmation_height: string;
	confirmation_height_frontier: string;
	representative: string;
	weight: string;
	pending: string;
}

const getAccountInfo = async (nodeUrl: string, account: string) => {
	const accountInfoRequest = {
		action: "account_info",
		account: account,
		representative: true,
		weight: true,
		pending: true
	}

	return await postJson<AccountInfoResponse>(nodeUrl, accountInfoRequest);
}

export interface GenerateWorkResponse {
	work: string;
	hash: string;
	difficulty: string;
	multiplier: string
}

const generateWork = async (nodeUrl, frontier: string) => {
	const generateWorkRequest = {
		action: "work_generate",
		hash: frontier
	}
	return await postJson<GenerateWorkResponse>(nodeUrl, generateWorkRequest);
}

interface ProcessResponse {
	work: string;
	hash: string;
}

const process = async (nodeUrl: string, subType: "send" | "receive", blockToProcess: SignedBlock) => {
	const processRequest = {
		action: "process",
		json_block: true,
		subtype: subType,
		block: blockToProcess
	}

	return await postJson<ProcessResponse>(nodeUrl, processRequest);
}

const createSendBlock = (
	amountToSend: string,
	fromAddress: string,
	toAddress: string,
	work: string,
	privateKey: string,
	accountInfo: AccountInfoResponse) => {
	const blockData = {
		walletBalanceRaw: accountInfo.balance,
		amountRaw: amountToSend,
		fromAddress: fromAddress,
		toAddress: toAddress,
		representativeAddress: accountInfo.representative,
		frontier: accountInfo.frontier,
		work: work
	}

	return block.send(blockData, privateKey);
}

const nodeUrl = "https://proxy.powernode.cc/proxy";

export const send = async (fromAddress: string, privateKey: string, toAddress: string, amount: string) => {
	const accountInfo = await getAccountInfo(nodeUrl, fromAddress);
	const workResponse = await generateWork(nodeUrl, accountInfo.frontier);
	const rawToSend = tools.convert(amount, "NANO", "RAW");
	const sendBlock = createSendBlock(
		rawToSend,
		fromAddress,
		toAddress,
		workResponse.work,
		privateKey,
		accountInfo
	)

	const processResponse = await process(nodeUrl, "send", sendBlock);
	return processResponse.hash !== undefined;
}
