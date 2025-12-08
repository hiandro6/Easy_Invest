import "./Inflacao.css";
import { Chart } from "react-google-charts";
import arrow from "../assets/arrow_back.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Inflacao() {
  const [valorInicial, setValorInicial] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");
  const [taxaMensal, setTaxaMensal] = useState("");
  const [tipoJuros, setTipoJuros] = useState("simples");
  const [cenario, setCenario] = useState("otimista");

  const [graficoData, setGraficoData] = useState([["Mês", "Nominal", "Real"]]);
  const [valorFinalReal, setValorFinalReal] = useState(null);
  const [lucroReal, setLucroReal] = useState(null);

  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  async function calcular(){
    try {
      const token = localStorage.getItem("token");

      const body = {
        valor_inicial: Number(valorInicial),
        taxa_mensal: Number(taxaMensal),
        prazo_meses: Number(prazoMeses),
        tipo_juros: tipoJuros,
        cenario: cenario,
      };

      const response = await fetch(
        "http://localhost:8000/simulations/investment-inflation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      const linhas = [["Mês", "Nominal", "Real"]];
      data.result_data.evolucao.forEach((item) => {
        linhas.push([item.mes, item.valor, item.valor_real]);
      });

      setGraficoData(linhas);
      setValorFinalReal(data.result_data.valor_final_real);
      setLucroReal(data.result_data.lucro_real);

      setMostrarGrafico(true);
    } catch (err) {
      console.error("Erro ao calcular inflação:", err);
    }
  }

  return (
    <>
      <header className="inflacao-nav">
        <Link to="/dashboard">
          <img src={arrow} alt="Image of a arrow" />
        </Link>
      </header>

      <main className="inflacao-main">
        <div className="inflacao-simular">
          <h1>Simular Investimento com Inflação</h1>

          <form>
            <div>
              <label>
                <span>Valor inicial (R$)</span>
                <input
                  type="number"
                  value={valorInicial}
                  onChange={(e) => setValorInicial(e.target.value)}
                />
              </label>

              <label>
                <span>Prazo (meses)</span>
                <input
                  type="number"
                  value={prazoMeses}
                  onChange={(e) => setPrazoMeses(e.target.value)}
                />
              </label>

              <label className="inflacao-select">
                <span>Cenário Econômico</span>
                <select
                  value={cenario}
                  onChange={(e) => setCenario(e.target.value)}
                >
                  <option value="otimista">Otimista</option>
                  <option value="neutro">Neutro</option>
                  <option value="pessimista">Pessimista</option>
                </select>
              </label>
            </div>

            <div className="inflacao-juros">
              <label>
                <span>Taxa de rendimento (% ao mês)</span>
                <input
                  type="number"
                  value={taxaMensal}
                  onChange={(e) => setTaxaMensal(e.target.value)}
                />
              </label>

              <label className="inflacao-select">
                <span>Tipo de Aplicação</span>
                <select
                  value={tipoJuros}
                  onChange={(e) => setTipoJuros(e.target.value)}
                >
                  <option value="simples">Juros Simples</option>
                  <option value="compostos">Juros Compostos</option>
                </select>
              </label>
            </div>
          </form>

          <button onClick={calcular}>Calcular</button>
        </div>

        {/* Só aparece após clicar no botão */}
        {mostrarGrafico && (
          <div className="inflacao-grafico">
            <h2 style={{ marginBottom: "10px" }}>Evolução do Investimento</h2>

            {valorFinalReal !== null && lucroReal !== null && (
              <div
                className="inflacao-resultados"
                style={{ marginBottom: "20px" }}
              >
                <p>
                  <strong>Valor Final Real:</strong> R$ {valorFinalReal}
                </p>
                <p>
                  <strong>Lucro Real:</strong> R$ {lucroReal}
                </p>
              </div>
            )}

            {/* Só renderiza quando houver dados */}
            {graficoData.length > 1 && (
              <Chart
                chartType="LineChart"
                data={graficoData}
                options={{
                  hAxis: { title: "Meses" },
                  vAxis: { title: "Valor (R$)" },
                  legend: { position: "bottom" },
                }}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}
