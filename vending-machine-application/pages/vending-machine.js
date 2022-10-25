import Head from "next/head";
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'
import Web3 from "web3";
import { useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "../util/loadContract";

const VendingMachine = () => {
    let web3
    const [error, setError] = useState('')
    const [inventory, setInventory] = useState('')
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        contract: null,
        isProviderLoaded: false
    })

    useEffect(() => {
        const init = async () => {
            const provider = await detectEthereumProvider()
            const contract = await loadContract('VendingMachine', provider);

            setWeb3Api({
                provider,
                contract,
                isProviderLoaded: true
            })
        }

        init()
    }, [])

    useEffect(() => {
        const getInventoryHandler = async () => {
            const { contract } = web3Api
            const inventory = await contract.getVendingMachineBalance();
            setInventory(inventory.toString())
        }

        web3Api.contract && getInventoryHandler()
    }, [web3Api.contract])


    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                web3 = new Web3(window.ethereum)
            } catch (e) {
                setError(e.message);
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>VendingMachine App</title>
                <meta name="description" content="A blockchain vending app" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Vending Machine</h1>
                    </div>
                    <div className="navbar-end">
                        <button className="button is-primary" onClick={connectWalletHandler}>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <h2>Vending machine inventory: {inventory}</h2>
                </div>
            </section>
            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
        </div>
    )
}

export default VendingMachine;