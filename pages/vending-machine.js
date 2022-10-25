import Head from "next/head";
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

export default function VendingMachine() {
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
                        <button className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <p>placeholder text</p>
                </div>
            </section>
        </div>
    )
}