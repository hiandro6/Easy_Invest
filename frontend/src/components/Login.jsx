import "./Login.css";
export default function Login() {
  return (
    <main>
      <section className="nav-login"></section>
      <section className="form-login">
        <form>
          <label htmlFor="email">
            <span>Email</span>
            <input type="email" placeholder="Email" id="email"/>
          </label>

          <label htmlFor="senha">
            <span>Senha</span>
            <input type="password" placeholder="Senha" id="senha"/>
          </label>

          <button>Entrar</button>
          <div>
            <p>Ainda não possuí cadastro?</p>
            <a href="">Cadastre-se aqui</a>
          </div>
        </form>
      </section>
    </main>
  );
}
