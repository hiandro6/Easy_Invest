import { useEffect, useState } from "react";
import "./Historico.css";
import arrow from "../assets/arrow_back.svg";

import { Link } from "react-router-dom";
      
export default function Historico() {
    const [simulations, setSimulations] = useState([]);

    useEffect(() => {
        async function loadHistory() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:8000/simulations/history", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setSimulations(data);
            } catch (err) {
                console.error("Erro ao carregar histórico:", err);
            }
        }

        loadHistory();
    }, []);

    function safeMoney(value) {
        if (value === undefined || value === null || isNaN(value)) {
            return "—";
        }

        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR");
    }

    async function deleteSimulation(id) {
        const confirmDelete = window.confirm("Deseja realmente apagar esta simulação?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:8000/simulations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                alert("Erro ao apagar simulação");
                return;
            }

            // remover imediatamente do estado (sem recarregar)
            setSimulations(prev => prev.filter(sim => sim.id !== id));

        } catch (err) {
            console.error("Erro ao apagar:", err);
        }
    }

    return (
        <>
            <header className="historico-nav">
                <Link to='/dashboard'>
                    <img src={arrow} alt="Image of a arrow" />
                </Link>
                <h1>Histórico de Simulações</h1>
            </header>

            <main className="historico-main">
                {simulations.length === 0 && <p>Nenhuma simulação encontrada.</p>}

                {simulations.map((sim) => {
                    const input = sim.input_data;
                    const result = sim.result_data;

                    const valorInvestido =
                        input.valor_inicial ??
                        input.valor_desejado ??
                        input.valorAplicado ??
                        null;

                    const juros =
                        input.taxa_mensal ??
                        input.taxa_juros ??
                        input.taxa ??
                        null;

                    const meses =
                        input.prazo_meses ??
                        input.meses ??
                        input.periodo ??
                        null;

                    return (
                        <div key={sim.id} className="historico-registro">

                            <div className="historico-cabecalho">
                                <h1>Simulação ({sim.type})</h1>
                                <h3>ID {sim.id}</h3>
                            </div>

                            {sim.type !== "comparison" ? (
                                <>
                                    <div className="historico-dinheiro">
                                        <h3>Dinheiro Investido</h3>
                                        <p>{safeMoney(valorInvestido)}</p>
                                    </div>

                                    <div className="historico-data">
                                        <div className="historico-juros">
                                            <h3>Juros (%)</h3>
                                            <p>{juros ?? "—"}</p>
                                        </div>

                                        <div className="historico-juros">
                                            <h3>Meses</h3>
                                            <p>{meses ?? "—"}</p>
                                        </div>

                                        <div className="historico-juros">
                                            <h3>Lucro</h3>
                                            <p>{safeMoney(result?.lucro)}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>Comparação entre 3 simulações</h2>

                                    {["simulacao1", "simulacao2", "simulacao3"].map((key, index) => (
                                        <div key={index} className="historico-data comparison-block">
                                            <h3>{`Simulação ${index + 1}`}</h3>

                                            <p>
                                                Valor final:{" "}
                                                {safeMoney(result?.[key]?.valor_final)}
                                            </p>
                                            <p>
                                                Lucro:{" "}
                                                {safeMoney(result?.[key]?.lucro)}
                                            </p>
                                        </div>
                                    ))}
                                </>
                            )}

                            <div className="historico-apagar">
                                <button onClick={() => deleteSimulation(sim.id)}>Apagar</button>
                                <p>Simulação feita em {formatDate(sim.created_at)}</p>
                            </div>
                        </div>
                    );
                })}
            </main>
        </>
    );
}
