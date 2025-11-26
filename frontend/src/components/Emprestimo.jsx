import "./Emprestimo.css";
import { Chart } from "react-google-charts";

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
      <Chart chartType="LineChart" data={data} options={options} />
    </>
  );
}
