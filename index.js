// in nodejs
// require()

// in frontend javascript you cant use require()
// import

//const { ethers } = require("ethers")
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("I see a metamask")
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            console.log("Connected!")
            connectButton.innerHTML = "Connected"
        } catch (e) {
            console.log(e)
        }
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        console.log("I do not see metamask")
        connectButton.innerHTML = "Please install metamask"
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        // we need
        // provider/connection to the blockchain
        // signer/wallet/someone with gas
        // contract that we are interacting with
        // abi & address

        // connect to the blockchain through metamask (window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // assign signer as the metamask wallet
        const signer = provider.getSigner()
        console.log(signer)
        // get contract
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // make transactions
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // wait for tx to finish
            await listenForTransactionMined(txResponse, provider)
            console.log("Done!")
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMined(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    // listen for this transaction to finish
    // contract.once
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations.`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// withdraw function
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionMined(txResponse, provider)
        } catch (e) {
            console.log(e)
        }
    }
}
