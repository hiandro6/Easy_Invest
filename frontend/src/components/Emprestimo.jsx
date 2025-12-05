import "./Emprestimo.css";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../assets/arrow_back.svg";

export default function Emprestimo() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [parcelasTexto, setParcelasTexto] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  async function handleSimular(e) {
    e.preventDefault();

    const valor = Number(e.target.valor.value);
    const prazo = Number(e.target.prazo.value);
    const juros = Number(e.target.juros.value);
    const tipo = e.target.tipo.value;

    const requestBody = {
      valor_desejado: valor,
      prazo_meses: prazo,
      taxa_juros: juros,
      tipo_juros: tipo,
    };

    try {
      console.log("Enviando:", requestBody);
      const response = await fetch("http://localhost:8000/simulations/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Erro ao simular");
        return;
      }

      // Montar gráfico
      const newChartData = [["Mês", "Saldo (R$)"]];
      data.result_data.valores_mensais.forEach((item) => {
        newChartData.push([item.mes, item.valor]);
      });

      setChartData(newChartData);

      // Parcelas
      const parcela = data.result_data.valor_final / prazo;
      setParcelasTexto(
        `R$ ${parcela.toFixed(2)} por ${prazo} meses, totalizando R$ ${data.result_data.valor_final.toFixed(2)}`
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <header className="emprestimo-nav">
        <img src={arrow} alt="Back" onClick={() => navigate(-1)} />
      </header>

      <main className="emprestimo-main">
        <div className="emprestimo-simular">
          <h1>Simular Empréstimo</h1>
          <form onSubmit={handleSimular}>
            <div>
              <label>
                <span>Valor desejado (R$)</span>
                <input type="number" id="valor" name="valor" required />
              </label>
              <label>
                <span>Prazo (meses)</span>
                <input type="number" id="prazo" name="prazo" required />
              </label>
            </div>

            <div className="emprestimo-juros">
              <label>
                <span>Juros (%)</span>
                <input type="number" id="juros" name="juros" required />
              </label>
              <label>
              <select id="tipo" name="tipo" defaultValue="simples">
                <option value="simples">Juros Simples</option>
                <option value="compostos">Juros Compostos</option>
              </select>

              </label>
            </div>

            <button type="submit">Calcular</button>
          </form>
        </div>

        <div className="emprestimo-grafico">
          {chartData.length > 0 && (
            <Chart chartType="LineChart" data={chartData} />
          )}
        </div>
      </main>

      <section className="emprestimo-parcelas">
        <h1>Parcelas</h1>
        {parcelasTexto && <h3>{parcelasTexto}</h3>}
      </section>
    </>
  );
}
