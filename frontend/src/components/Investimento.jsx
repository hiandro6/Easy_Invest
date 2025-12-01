import "./Investimento.css";
import { Chart } from "react-google-charts";
import arrow from "../assets/arrow_back.svg";

const data = [
  ["Mês", "Saldo (R$)"],
  [0, 1000],
  [1, 1100],
  [2, 1200],
  [3, 1300],
  [4, 1400],
  [5, 1500],
  [6, 1600],
];

const options = {
  title: "Resultado da simulação",
  hAxis: {
    title: "Meses",
  },
  vAxis: {
    title: "Saldo (R$)",
  },
  legend: "none",
};

export default function investimento() {
  return (
    <>
      <header className="investimento-nav">
        <img src={arrow} alt="Image of a arrow" />
      </header>
      <main className="investimento-main">
        <div className="investimento-simular ">
          <h1>Simular Investimento</h1>
          <form action="">
            <div>
              <label htmlFor="">
                <span>Valor Inicial (R$)</span>
                <input type="number" />
              </label>
              <label htmlFor="">
                <span>Prazo (meses)</span>
                <input type="number" />
              </label>
            </div>
            <div className="investimento-juros">
              <label htmlFor="">
                <span>Taxa de rendimento (% ao mês)</span>
                <input type="number" />
              </label>
              <label htmlFor="">
                <span>Tipo de Aplicação</span>
                <select name="" id="">
                  <option value="">Juros Simples</option>
                  <option value="">Juros Compostos</option>
                </select>
              </label>
            </div>
          </form>
          <button>Calcular</button>
        </div>
        <div className="investimento-grafico">
          <Chart chartType="LineChart" data={data} options={options} />
          <button>Gerar PDF</button>
        </div>
      </main>
    </>
  );
}
