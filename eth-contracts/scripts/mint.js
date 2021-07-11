const HDWalletProvider = require("truffle-hdwallet-provider")
const zokratesProof = [
    require("./proof_0.json"),
    require("./proof_1.json"),
    require("./proof_2.json"),
    require("./proof_3.json"),
    require("./proof_4.json"),
    require("./proof_5.json"),
    require("./proof_6.json"),
    require("./proof_7.json"),
    require("./proof_8.json"),
    require("./proof_9.json"),
];
const web3 = require('web3')
const OWNER_ADDRESS = '0x1E906eebc627e4c49104d4b36A842bBF8Db09a7d'
const CONTRACT_ADDRESS = '0xb465e694BB6fFA6Df22D9Fd204eCf8D7766Ef973'
const fs = require('fs');
 const MNEMONIC = fs.readFileSync(".secret").toString().trim();
const MINT_COUNT =10

const INFURA_KEY = '6424df6ccdc14923928d27dbf5730746'

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS ) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const contract = require('../build/contracts/SolnSquareVerifier.json'); 
const ABI = contract.abi;

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (CONTRACT_ADDRESS) {
        const r2token = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })
        // tokens issued directly to the owner.
        for (let i = 0; i < MINT_COUNT ; i++) {
            try {
                let proofs = Object.values(zokratesProof[i].proof);
                let inputs = zokratesProof[i].inputs;
                console.log("OWNER_ADDRESS "+ OWNER_ADDRESS + "\n");
                console.log("i "+i+ "\n");
                console.log("proofs "+ proofs+ "\n");
                console.log("inputs "+ inputs+ "\n");
                let tx = await r2token.methods.addSolution(i,OWNER_ADDRESS,  ...proofs, inputs).send({ from: OWNER_ADDRESS });
                //console.log("Solution added. Transaction: " + tx.transactionHash);
                tx = await r2token.methods.mint(OWNER_ADDRESS, i).send({ from: OWNER_ADDRESS });
                //console.log("Minted item. Transaction: " + tx.transactionHash);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

main()