import "./Dashboard.css";
import cambio from "../assets/currency_exchange.svg";
import comparar from "../assets/comparar.svg";
import dinheiro from "../assets/dinheiro.svg";
import emprestimo from "../assets/emprestimo.svg";
import historia from "../assets/historia.svg";
import impostos from "../assets/impostos.svg";
import inflacao from "../assets/inflacao.svg";

export default function Dashboard() {
  return (
    <>
      <header className="dashboard-nav">
        <nav>
          <button>Consultas</button>
          <button>Simulação</button>
          <button>Sair</button>
        </nav>
      </header>
      <main className="dashboard-main">
        <h1 className="intro">Olá, Usuário!</h1>
        <h1 className="ask">O que vamos fazer hoje?</h1>
        <div className="dashboard-opcoes">
          <div className="opcoes">
            <img src={cambio} alt="Image of cambiox" />
            <h3>Simular investimento</h3>
          </div>
          <div className="opcoes">
            <img src={emprestimo} alt="Image of cambiox" />
            <h3>Simular empréstimo</h3>
          </div>
          <div className="opcoes">
            <img src={inflacao} alt="Image of cambiox" />
            <h3>Simular com cenários de inflação</h3>
          </div>
          <div className="opcoes">
            <img src={historia} alt="Image of cambiox" />
            <h3>Histórico de Simulações</h3>
          </div>
          <div className="opcoes">
            <img src={impostos} alt="Image of cambiox" />
            <h3>Consultar taxas do mercado</h3>
          </div>
          <div className="opcoes">
            <img src={dinheiro} alt="Image of cambiox" />
            <h3>Consultar cotação de moedas</h3>
          </div>
          <div className="opcoes">
            <img src={comparar} alt="Image of cambiox" />
            <h3>Comparar simulações</h3>
          </div>
        </div>
      </main>
      <section className="dashboard-noticias">
        <header>
          <h1>Noticias</h1>
        </header>
        <div className="conteudo">
          <h2>
            Bolsonaro ainda pode recorrer? Saiba o que acontecerá na trama
            golpista
          </h2>
          <p>
            O Supremo Tribunal Federal (STF) reconheceu nesta terça-feira o
            trânsito em julgado para o ex-presidente Jair Bolsonaro, o deputado
            federal Alexandre Ramagem e o ex-ministro Anderson Torres na ação
            penal da trama golpista. Isso significa que eles, pela lei, não
            podem apresentar mais recursos contra a condenação — e o próximo
            passo é o início da execução da penal.
          </p>
          <p className="hora">25 de novembro de 2025</p>
        </div>
      </section>
    </>
  );
}
