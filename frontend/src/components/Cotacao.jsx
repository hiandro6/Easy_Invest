import "./Cotacao.css";
import arrow from "../assets/arrow_back.svg"

import { Link } from "react-router-dom";

export default function Cotacao() {
    return (
        <>
            <main className="cotacao-main">
                <section className="cotacao-nav">
                    <Link to='/dashboard'>
                        <img src={arrow} alt="Image of a arrow" />
                    </Link>
                </section>
                <section className="cotacao-consulta">
                    <h1>Cotação de Moedas</h1>
                    <div className="cotacao-moedas">
                        <div className="cotacao-entrada">
                            <form>
                                <label htmlFor="">
                                    <span>Valor em real (R$)</span>
                                    <input type="number" />
                                </label>
                                <label htmlFor="">
                                    <span>Moeda de destino</span>
                                    <select name="" id="">
                                        <option value="">EUR</option>
                                    </select>
                                </label>
                            </form>
                            <button>Consutar</button>
                        </div>
                        <div className="cotacao-saida">
                            <div className="destino">
                                <h2>1 EUR = </h2>
                                <h2 className="cotacao-valor">942.30932</h2>
                            </div>
                            <div className="original">
                                <h2>EUR</h2>
                                <h2 className="cotacao-valor">942.30932</h2>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}