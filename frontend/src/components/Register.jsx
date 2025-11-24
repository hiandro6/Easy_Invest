import "./Register.css";
import emailIcon from "../assets/o-email.png";
import passwordIcon from "../assets/old-big-key.png";
import arrowIcon from "../assets/arrow_back_white.svg";
import logo from "../assets/logo_cut.png";

export default function Login() {
  return (
    <main className="register-main">
      <section className="form-register">
        <div className="title-register">
          <img src={arrowIcon} alt="Icon of a arrow" />
          <h1>Início</h1>
        </div>

        <form>
          <label htmlFor="nome">
            <span>
              <img
                src={emailIcon}
                alt="Icon of a email"
                className="img-label-register"
              />
              Nome e Sobrenome
            </span>
            <input type="text" placeholder="Usuário Investidor" id="nome" />
          </label>

          <label htmlFor="email">
            <span>
              <img
                src={emailIcon}
                alt="Icon of a email"
                className="img-label-register"
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
                className="img-label-register"
              />
              Senha
            </span>
            <input type="password" placeholder="Senha" id="senha" />
          </label>

          <button>Cadastre-se</button>
          <div className="link-register">
            <p>Já possuí cadastro?</p>
            <a href="">Faça login aqui</a>
          </div>
        </form>
      </section>
      <section className="nav-register">
        <div className="logo-register">
          <img src={logo} alt="Image of a logo" />
        </div>
      </section>
    </main>
  );
}
