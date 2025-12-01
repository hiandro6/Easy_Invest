import "./Inflacao.css";
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
  title: "Resultados da Simulação",
  hAxis: {
    title: "Meses",
  },
  vAxis: {
    title: "Saldo (R$)",
  },
  legend: "none",
};

export default function Inflacao() {
  return (
    <>
      <header className="inflacao-nav">
        <img src={arrow} alt="Image of a arrow" />
      </header>
      <main className="inflacao-main">
        <div className="inflacao-simular">
          <h1>Simular Investimento</h1>
          <form action="">
            <div>
              <label htmlFor="">
                <span>Valor inicial (R$)</span>
                <input type="number" />
              </label>
              <label htmlFor="">
                <span>Prazo (meses)</span>
                <input type="number" />
              </label>
              <label htmlFor=""  className="inflacao-select">
                <span>Cenário Econômico</span>
                <select name="" id="">
                  <option value="">Otimista</option>
                  <option value="">Não sei</option>
                </select>
              </label>
            </div>
            <div className="inflacao-juros">
              <label htmlFor="">
                <span>Taxa de rendimento (% ao mês)</span>
                <input type="number" />
              </label>
              <label htmlFor=""  className="inflacao-select">
                <select name="" id="">
                  <option value="">Juros Simples</option>
                  <option value="">Juros Compostos</option>
                </select>
              </label>
            </div>
          </form>
          <button>Calcular</button>
        </div>
        <div className="inflacao-grafico">
          <Chart chartType="LineChart" data={data} options={options} />
        </div>
      </main>
    </>
  );
}
