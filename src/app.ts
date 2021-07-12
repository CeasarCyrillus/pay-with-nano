import nanoNodes from "./publicNodes.json"
import {NanoNode, NodeLoader} from "./NodeLoader";
import {send} from "./utils";
import {wallet} from "nanocurrency-web";
import {Wallet} from "nanocurrency-web/dist/lib/address-importer";

export const generateWallet = (seedPassword?: string) => {
	const passPhrase = wallet.generate(undefined, seedPassword).mnemonic;
	const newWallet = wallet.fromLegacyMnemonic(passPhrase);
	return {
		address: newWallet.accounts[0].address,
		mnemonic: newWallet.mnemonic,
		seed: newWallet.seed
	}
}

const main = async () => {

}

main()