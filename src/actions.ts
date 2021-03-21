export class Action {
	action: string;
	private ack: boolean;
	private id: number;
	constructor() {
		this.ack = true;
		this.id = Action.generateId();
	}

	private static generateId() {
		return new Date().getMilliseconds() * Math.random() + 9999;
	}
}

export interface BaseMessage {
	ack: string;
	time: number;
	id: number;
}

export class Ping extends Action {
	action = "ping"
}

export interface Pong extends BaseMessage{
	ack: "pong",
	time: number,
	id: number
}

export class AccountBalance extends Action {
	action = "account_balance";
	account: string;
	constructor(address: string) {
		super();
		this.account = address;
	}
}

export interface AccountBalanceResponse extends BaseMessage {
	balance: string;
	pending: string;
}