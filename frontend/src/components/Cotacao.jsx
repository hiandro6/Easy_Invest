import "./Cotacao.css";
import arrow from "../assets/arrow_back.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Cotacao() {
    const [valor, setValor] = useState("");
    const [moeda, setMoeda] = useState("EUR");
    const [resultado, setResultado] = useState(null);

    const consultar = async () => {
        try {
            const par = `BRL-${moeda}`;

            const response = await axios.post(
                "http://localhost:8000/cotacao/",
                {
                    par: par,
                    valor: Number(valor),
                }
            );

            console.log("Resposta:", response.data);
            setResultado(response.data);

        } catch (err) {
            console.error("Erro ao consultar:", err);
        }
    };

    return (
        <main className="cotacao-main">
            <section className="cotacao-nav">
                <Link to="/dashboard">
                    <img src={arrow} alt="Image of a arrow" />
                </Link>
            </section>

            <section className="cotacao-consulta">
                <h1>Cotação de Moedas</h1>

                <div className="cotacao-moedas">
                    <div className="cotacao-entrada">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <label>
                                <span>Valor em real (R$)</span>
                                <input
                                    type="number"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                />
                            </label>

                            <label>
                                <span>Moeda de destino</span>
                                <select value={moeda} onChange={(e) => setMoeda(e.target.value)}>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="ARS">ARS</option>
                                </select>
                            </label>
                        </form>

                        <button onClick={consultar}>Consultar</button>
                    </div>

                    {resultado && (
                        <div className="cotacao-saida">

                            {/* BLOCO - 1 MOEDA = X REAIS */}
                            <div className="destino">
                                <h2>1 {moeda} =</h2>
                                <h2 className="cotacao-valor">R$ {resultado.bid}</h2>
                            </div>

                            {/* BLOCO - VALOR EM REAIS = X MOEDA */}
                            <div className="original">
                                <h2>R$ {valor} =</h2>
                                <h2 className="cotacao-valor">
                                    {moeda} {resultado.valor_convertido.toFixed(2)}
                                </h2>
                            </div>

                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
