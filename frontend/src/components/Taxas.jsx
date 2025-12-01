import "./Taxas.css";
import arrow from "../assets/arrow_back.svg"

export default function Taxas() {
    return (
        <>
            <main className="taxas-main">
                <section className="taxas-nav">
                    <img src={arrow} alt="Image of a arrow" />
                </section>
                <section className="taxas-conteudo">
                    <div className="alinhamento">
                        <div className="taxas-conteudo-cabecalho">
                        <div className="taxas-cifrao">
                            R$
                        </div>
                        <div className="taxas-cifrao-texto">
                            <h2>Taxas do Mercado Financeiro</h2>
                            <p>Consulte as principais taxas atualizadas automaticamente.</p>
                        </div>
                    </div>
                    <div className="taxas-conteudo-valores">
                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>SELIC</h2>
                            </div>
                            <h2>
                                10,75%
                            </h2>
                        </div>
                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>CDI</h2>
                            </div>
                            <h2>
                                10,75%
                            </h2>
                        </div>
                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>IPCA</h2>
                            </div>
                            <h2>
                                10,75%
                            </h2>
                        </div>
                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>Poupança</h2>
                            </div>
                            <h2>
                                10,75%
                            </h2>
                        </div>
                    </div>
                    </div>
                </section>
                <section className="taxas-atualizar">
                    <div className="taxas-atualizacao">
                        <p>Ultima atualização: 12/10/2003</p>
                        <button>Atualizar</button>
                    </div>
                </section>
            </main>
        </>
    )
}