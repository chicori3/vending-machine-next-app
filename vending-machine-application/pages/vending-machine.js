import Head from "next/head";
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'
import Web3 from "web3";
import { useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "../util/loadContract";

const VendingMachine = () => {
    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        contract: null,
        isProviderLoaded: false
    })
    const [account, setAccount] = useState(null)
    const [error, setError] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')

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

    useEffect(() => {
        if (account) {
            getMyDonutCountHandler()
        }
    }, [web3Api, account])

    const getMyDonutCountHandler = async () => {
        const { contract } = web3Api
        const count = await contract.donutBalances(account);
        setMyDonutCount(count.toString())
    }

    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                const web3 = new Web3(window.ethereum);

                setWeb3Api({
                    ...web3Api,
                    web3
                })

                const accounts = await web3.eth.getAccounts()
                setAccount(accounts[0]);
            } catch (e) {
                setError(e.message);
            }
        } else {
            setError("Please install MetaMask")
        }
    }

    const updateDonutQty = event => {
        setBuyCount(event.target.value)
    }

    const buyDonutHandler = async () => {
        const { contract, web3 } = web3Api

        try {
            await contract.purchase(buyCount)
                .send({
                    from: account,
                    value: web3.utils.toWei('2', 'ether') * buyCount
                })
        } catch (e) {
            setError(e.message)
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
                <div className="container">
                    <h2>My donuts: {myDonutCount}</h2>
                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label">Buy Donuts</label>
                        <div className="control">
                            <input onChange={updateDonutQty} type="type" placeholder="Enter amount..."
                                   className="input" />
                        </div>
                        <button onClick={buyDonutHandler} className="button is-primary mt-2">
                            Buy
                        </button>
                    </div>
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