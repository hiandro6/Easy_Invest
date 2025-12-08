import "./Comparar.css";
import { useState } from "react";
import { Chart } from "react-google-charts";
import arrow from "../assets/arrow_back.svg"

import { Link } from "react-router-dom";

export default function Comparar() {
  const [sim1, setSim1] = useState({ valor: "", juros: "", meses: "", tipo: "simples" });
  const [sim2, setSim2] = useState({ valor: "", juros: "", meses: "", tipo: "simples" });
  const [sim3, setSim3] = useState({ valor: "", juros: "", meses: "", tipo: "simples" });

  const [graficoData, setGraficoData] = useState([["Mês", "Simulação 1", "Simulação 2", "Simulação 3"]]);
  const [resultados, setResultados] = useState(null);

  function montarSimulacao(sim) {
    return {
      valor_inicial: Number(sim.valor),
      taxa_mensal: Number(sim.juros),
      prazo_meses: Number(sim.meses),
      tipo_juros: sim.tipo,
    };
  }

  async function comparar() {
    try {
      const token = localStorage.getItem("token");

      const body = {
        simulacao1: montarSimulacao(sim1),
        simulacao2: montarSimulacao(sim2),
        simulacao3: montarSimulacao(sim3),
      };

      const response = await fetch("http://localhost:8000/simulations/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      setResultados(data.result_data);

      const evol1 = data.result_data.simulacao1.evolucao;
      const evol2 = data.result_data.simulacao2.evolucao;
      const evol3 = data.result_data.simulacao3.evolucao;

      const linhas = [["Mês", "Simulação 1", "Simulação 2", "Simulação 3"]];
      const maxMeses = Math.max(evol1.length, evol2.length, evol3.length);

      for (let mes = 1; mes <= maxMeses; mes++) {
        const v1 = evol1.find((x) => x.mes === mes)?.valor || null;
        const v2 = evol2.find((x) => x.mes === mes)?.valor || null;
        const v3 = evol3.find((x) => x.mes === mes)?.valor || null;

        linhas.push([mes, v1, v2, v3]);
      }

      setGraficoData(linhas);

    } catch (error) {
      console.error("Erro ao comparar:", error);
    }
  }

  function renderForm(sim, setSim, title) {
    return (
      <div className="comparar-content">
        <h1>{title}</h1>
        <form>
          <label>
            <span>Valor inicial</span>
            <input
              type="number"
              value={sim.valor}
              onChange={(e) => setSim({ ...sim, valor: e.target.value })}
            />
          </label>

          <label>
            <span>Juros %</span>
            <input
              type="number"
              value={sim.juros}
              onChange={(e) => setSim({ ...sim, juros: e.target.value })}
            />
          </label>

          <label>
            <span>Meses</span>
            <input
              type="number"
              value={sim.meses}
              onChange={(e) => setSim({ ...sim, meses: e.target.value })}
            />
          </label>

          <label>
            <span>Tipo de Juros</span>
            <select
              value={sim.tipo}
              onChange={(e) => setSim({ ...sim, tipo: e.target.value })}
            >
              <option value="simples">Simples</option>
              <option value="compostos">Compostos</option>
            </select>
          </label>
        </form>
      </div>
    );
  }

  return (
    <>
      <main className="comparar-main">
        <Link to='/dashboard'>
          <img src={arrow} alt="Image of a arrow" />
        </Link>
        <div className="container-forms">

          {renderForm(sim1, setSim1, "Simulação 1")}
          {renderForm(sim2, setSim2, "Simulação 2")}
          {renderForm(sim3, setSim3, "Simulação 3")}

        </div>

        <button onClick={comparar} className="btn-comparar">
          Comparar
        </button>

        {resultados && (
          <div className="comparar-resultados">

            <h2>Resultados</h2>

            <div className="cards-resultados">
              <div className="card">
                <h3>Simulação 1</h3>
                <p>Valor Final: R$ {resultados.simulacao1.valor_final}</p>
                <p>Lucro: R$ {resultados.simulacao1.lucro}</p>
              </div>
              <div className="card">
                <h3>Simulação 2</h3>
                <p>Valor Final: R$ {resultados.simulacao2.valor_final}</p>
                <p>Lucro: R$ {resultados.simulacao2.lucro}</p>
              </div>
              <div className="card">
                <h3>Simulação 3</h3>
                <p>Valor Final: R$ {resultados.simulacao3.valor_final}</p>
                <p>Lucro: R$ {resultados.simulacao3.lucro}</p>
              </div>
            </div>

            <Chart
              chartType="LineChart"
              data={graficoData}
              options={{
                title: "Comparação das Simulações",
                hAxis: { title: "Meses" },
                vAxis: { title: "Valor (R$)" },
              }}
            />
          </div>
        )}
      </main>
    </>
  );
}
