import "./Emprestimo.css";
import { Chart } from "react-google-charts";
import arrow from "../assets/arrow_back.svg"

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
  title: "Evolução do Empréstimo com Juros Compostos (10% ao mês)",
  hAxis: {
    title: "Meses",
  },
  vAxis: {
    title: "Saldo (R$)",
  },
  legend: "none",
};

export default function Emprestimo() {
  return (
    <>
      <header className="emprestimo-nav">
        <img src={arrow} alt="Image of a arrow" />
      </header>
      <main className="emprestimo-main">
          <div className="simular">
            <h1>Simular Empréstimo</h1>
            <form action="">
              <div>
                <label htmlFor="">
                  <span>
                    Valor desejado (R$)
                  </span>
                  <input type="number" />
                </label>
                <label htmlFor="">
                  <span>
                    Prazo (meses)
                  </span>
                  <input type="number" />
                </label>
              </div>
              <div>
                <label htmlFor="">
                  <span>
                    Juros (%)
                  </span>
                  <input type="number" />
                </label>
                <label htmlFor="">
                  <select name="" id="">
                    <option value="">Juros Simples</option>
                    <option value="">Juros Compostos</option>
                  </select>
                </label>
              </div>
            </form>
            <button>Calcular</button>
          </div>
          <div className="grafico">
            <Chart chartType="LineChart" data={data} options={options}/>
          </div>
      </main>
      <section className="parcelas"></section>
      
    </>
  );
}
