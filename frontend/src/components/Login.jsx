import "./Login.css";
import emailIcon from "../assets/o-email.png";
import passwordIcon from "../assets/old-big-key.png";
import arrowIcon from "../assets/arrow.svg";
import logo from "../assets/logo_cut.png"

export default function Login() {
  return (
    <main>
      <section className="nav-login">
        <div className="title-login">
          <img src={arrowIcon} alt="Icon of a arrow" />
          <h1>Início</h1>
        </div>

        <div className="logo-login">
          <img src={logo} alt="Image of a logo" />
        </div>

      </section>
      <section className="form-login">
        <form>
          <label htmlFor="email">
            <span>
              <img
                src={emailIcon}
                alt="Icon of a email"
                className="img-label-login"
              />
              E-mail
            </span>
            <input type="email" placeholder="Email" id="email" />
          </label>

          <label htmlFor="senha">
            <span>
              <img
                src={passwordIcon}
                alt="Icon of a key"
                className="img-label-login"
              />
              Senha
            </span>
            <input type="password" placeholder="Senha" id="senha" />
          </label>

          <button>Entrar</button>
          <div className="link-login">
            <p>Ainda não possuí cadastro?</p>
            <a href="">Cadastre-se aqui</a>
          </div>
        </form>
      </section>
    </main>
  );
}
