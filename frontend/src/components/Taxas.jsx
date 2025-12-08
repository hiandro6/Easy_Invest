import { useEffect, useState } from "react";
import api from "../api/axios"; 
import "./Taxas.css";
import arrow from "../assets/arrow_back.svg";

import { Link } from "react-router-dom";

export default function Taxas() {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carrega as taxas ao abrir o componente
    useEffect(() => {
        fetchRates();
    }, []);

    async function fetchRates() {
        try {
            const response = await api.get("/taxas-juros/");
            setRates(response.data);
        } catch (error) {
            console.error("Erro ao buscar taxas:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p style={{ color: "white", textAlign: "center" }}>Carregando taxas...</p>;
    }

    return (
        <main className="taxas-main">
            <section className="taxas-nav">
                <Link to='/dashboard'>
                    <img src={arrow} alt="Image of a arrow" />
                </Link>
            </section>

            <section className="taxas-conteudo">
                <div className="alinhamento">
                    
                    <div className="taxas-conteudo-cabecalho">
                        <div className="taxas-cifrao">R$</div>
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
                            <h2>{rates.selic}</h2>
                        </div>

                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>CDI</h2>
                            </div>
                            <h2>{rates.cdi}</h2>
                        </div>

                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>IPCA</h2>
                            </div>
                            <h2>{rates.ipca}</h2>
                        </div>

                        <div className="taxas">
                            <div className="taxa-cabecalho">
                                <span>%</span>
                                <h2>Poupança</h2>
                            </div>
                            <h2>{rates.poupanca}</h2>
                        </div>

                    </div>

                </div>
            </section>

            <section className="taxas-atualizar">
                <div className="taxas-atualizacao">
                    <p>Última atualização: {rates.atualizado_em}</p>
                    <button onClick={fetchRates}>Atualizar</button>
                </div>
            </section>
        </main>
    );
}
