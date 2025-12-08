import { useEffect, useState } from "react";
import "./Dashboard.css";
import cambio from "../assets/currency_exchange.svg";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchNews();
  }, []);

  return (
    <>
      {/* ------------------ NAV ------------------ */}
      <header className="dashboard-nav">
        <nav>
          <button>Consultas</button>
          <button>Simulação</button>
          <button>Sair</button>
        </nav>
      </header>

      {/* ------------------ MAIN ------------------ */}
      <main className="dashboard-main">
        <h1 className="intro">Olá, Usuário!</h1>
        <h1 className="ask">O que vamos fazer hoje?</h1>

        <div className="dashboard-opcoes">
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
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