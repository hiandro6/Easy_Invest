import "./Comparar.css";

export default function Comparar() {
  return (
    <>
      <main className="comparar-main">
        <div className="container-forms">
          <div className="comparar-content">
            <h1>Simulação 1</h1>
            <form>
              <label htmlFor="">
                <span>Valor inicial</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Juros %</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Meses</span> <input type="text" />
              </label>
            </form>
          </div>
          <div className="comparar-content">
            <h1>Simulação 2</h1>
            <form>
              <label htmlFor="">
                <span>Valor inicial</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Juros %</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Meses</span> <input type="text" />
              </label>
            </form>
          </div>
          <div className="comparar-content">
            <h1>Simulação 3</h1>
            <form>
              <label htmlFor="">
                <span>Valor inicial</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Juros %</span> <input type="text" />
              </label>
              <label htmlFor="">
                <span>Meses</span> <input type="text" />
              </label>
            </form>
          </div>
        </div>
        <button>Comparar</button>
      </main>
    </>
  );
}
