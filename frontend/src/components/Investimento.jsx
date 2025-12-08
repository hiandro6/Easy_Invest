import { useState } from "react";
import "./Investimento.css";
import { Chart } from "react-google-charts";
import arrow from "../assets/arrow_back.svg";

import { Link } from "react-router-dom";

export default function Investimento() {
  const [valorInicial, setValorInicial] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");
  const [taxaMensal, setTaxaMensal] = useState("");
  const [tipoJuros, setTipoJuros] = useState("simples");

  const [chartData, setChartData] = useState(null);
  const [valorFinal, setValorFinal] = useState(null);
  const [lucro, setLucro] = useState(null);

  async function simular() {
    const token = localStorage.getItem("token");

    const payload = {
      valor_inicial: parseFloat(valorInicial),
      prazo_meses: parseInt(prazoMeses),
      taxa_mensal: parseFloat(taxaMensal),
      tipo_juros: tipoJuros,
    };

    console.log("Enviando:", payload);

    const response = await fetch("http://localhost:8000/simulations/investment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Erro ao calcular investimento");
      return;
    }

    const data = await response.json();
    console.log("Recebido:", data);

    // Organiza os dados para o Google Charts
    const evolucao = data.result_data.evolucao;

    const formatted = [
      ["Mês", "Saldo (R$)"],
      ...evolucao.map((e) => [e.mes, e.valor]),
    ];

    setChartData(formatted);
    setValorFinal(data.result_data.valor_final);
    setLucro(data.result_data.lucro);
  }

  const options = {
    title: "Evolução do Investimento",
    hAxis: { title: "Meses" },
    vAxis: { title: "Saldo (R$)" },
    legend: "none",
  };



  async function gerarPDF() {
  const token = localStorage.getItem("token");

  const payload = {
    valor_inicial: parseFloat(valorInicial),
    prazo_meses: parseInt(prazoMeses),
    taxa_mensal: parseFloat(taxaMensal),
    tipo_juros: tipoJuros,
  };

  const response = await fetch("http://localhost:8000/simulations/investment/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    alert("Erro ao gerar PDF");
    return;
  }

  // Receber o PDF como blob
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  // Download automático
  const link = document.createElement("a");
  link.href = url;
  link.download = "simulacao_investimento.pdf";
  link.click();
  }


  return (
    <>
      <header className="investimento-nav">
        <Link to='/dashboard'>
          <img src={arrow} alt="Image of a arrow" />
        </Link>
      </header>

      <main className="investimento-main">
        <div className="investimento-simular">
          <h1>Simular Investimento</h1>

          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>
                <span>Valor Inicial (R$)</span>
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
            </div>

            <div className="investimento-juros">
              <label>
                <span>Taxa de rendimento (% ao mês)</span>
                <input
                  type="number"
                  value={taxaMensal}
                  onChange={(e) => setTaxaMensal(e.target.value)}
                />
              </label>

              <label>
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

          <button onClick={simular}>Calcular</button>
        </div>

        <div className="investimento-grafico">
          {chartData && (
            <>
              <Chart chartType="LineChart" data={chartData} options={options} />
              <p><strong>Valor Final:</strong> R$ {valorFinal}</p>
              <p><strong>Lucro:</strong> R$ {lucro}</p>
            </>
          )}

          <button onClick={gerarPDF}>Gerar PDF</button>
        </div>
      </main>
    </>
  );
}
