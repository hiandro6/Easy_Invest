import "./Cotacao.css";
import arrow from "../assets/arrow_back.svg"

export default function Cotacao() {
    return (
        <>
            <main className="cotacao-main">
                <section className="cotacao-nav">
                    <img src={arrow} alt="Image of a arrow" />
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
                            <div className="destino"></div>
                            <div className="original"></div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}