import { useEffect, useState } from "react";
import "./Dashboard.css";
import cambio from "../assets/currency_exchange.svg";
import comparar from "../assets/comparar.svg";
import dinheiro from "../assets/dinheiro.svg";
import emprestimo from "../assets/emprestimo.svg";
import historia from "../assets/historia.svg";
import impostos from "../assets/impostos.svg";
import inflacao from "../assets/inflacao.svg";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const [openConsulta, setOpenConsulta] = useState(false);
  const [openSimulacao, setOpenSimulacao] = useState(false);

  useEffect(() => {
    async function fetchUserName() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://127.0.0.1:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Não foi possível obter o nome do usuário:", res.status);
          return;
        }

        const data = await res.json();
        setUserName(data.name || "");
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }

    async function fetchNews() {
      try {
        const res = await fetch("http://127.0.0.1:8000/news");
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserName();
    fetchNews();
  }, []);

  return (
    <>
      {/* ------------------ NAV ------------------ */}
      <header className="dashboard-nav">
        <nav>

          {/* CONSULTAS DROPDOWN */}
          <div className="dropdown">
            <button onClick={() => setOpenConsulta(!openConsulta)}>
              Consultas
            </button>

            {openConsulta && (
              <div className="dropdown-menu">
                <Link to="/taxas" className="dropdown-item">
                  Consultar taxas do mercado
                </Link>

                <Link to="/cotacao" className="dropdown-item">
                  Consultar cotação de moedas
                </Link>
              </div>
            )}
          </div>

          {/* SIMULAÇÕES DROPDOWN */}
          <div className="dropdown">
            <button onClick={() => setOpenSimulacao(!openSimulacao)}>
              Simulação
            </button>

            {openSimulacao && (
              <div className="dropdown-menu">
                <Link to="/investimento" className="dropdown-item">
                  Simular investimento
                </Link>

                <Link to="/emprestimo" className="dropdown-item">
                  Simular empréstimo
                </Link>

                <Link to="/inflacao" className="dropdown-item">
                  Simular com cenários de inflação
                </Link>

                <Link to="/comparar" className="dropdown-item">
                  Comparar simulações
                </Link>

                <Link to="/historico" className="dropdown-item">
                  Histórico de simulações
                </Link>
              </div>
            )}
          </div>

          <Link to="/">
            <button>Sair</button>
          </Link>
        </nav>
      </header>

      {/* ------------------ MAIN ------------------ */}
      <main className="dashboard-main">
        <h1 className="intro">Olá, {userName || "Usuário"}!</h1>
        <h1 className="ask">O que vamos fazer hoje?</h1>

        <div className="dashboard-opcoes">
          <Link to="/investimento" className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </Link>

          <Link to="/emprestimo" className="opcoes">
            <img src={emprestimo} alt="Image of cambiox" />
            <h3>Simular empréstimo</h3>
          </Link>

          <Link to="/inflacao" className="opcoes">
            <img src={inflacao} alt="Image of cambiox" />
            <h3>Simular com cenários de inflação</h3>
          </Link>

          <Link to="/historico" className="opcoes">
            <img src={historia} alt="Image of cambiox" />
            <h3>Histórico de simulações</h3>
          </Link>

          <Link to="/taxas" className="opcoes">
            <img src={impostos} alt="Image of cambiox" />
            <h3>Consultar taxas do mercado</h3>
          </Link>

          <Link to="/cotacao" className="opcoes">
            <img src={dinheiro} alt="Image of cambiox" />
            <h3>Consultar cotação de moedas</h3>
          </Link>

          <Link to="/comparar" className="opcoes">
            <img src={comparar} alt="Image of cambiox" />
            <h3>Comparar simulações</h3>
          </Link>
        </div>
      </main>

      {/* ------------------ NOTÍCIAS ------------------ */}
      <section className="dashboard-noticias">
        <header>
          <h1>Notícias</h1>
        </header>

        {loading ? (
          <p>Carregando notícias...</p>
        ) : (
          <div className="noticias-grid">
            {news.map((item, index) => (
              <div
                key={index}
                className="noticia-card"
                onClick={() => window.open(item.link, "_blank")}
                style={{ cursor: "pointer" }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="Imagem da notícia"
                    className="noticia-img"
                  />
                )}

                <h2>{item.title}</h2>
                <p>{item.summary}</p>

                {item.publishedAt && (
                  <p className="hora">
                    {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
