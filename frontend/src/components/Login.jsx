import { useState } from "react";
import "./Login.css";
import emailIcon from "../assets/o-email.png";
import passwordIcon from "../assets/old-big-key.png";
import arrowIcon from "../assets/arrow_back.svg";
import logo from "../assets/logo_cut.png";

import { Link } from "react-router-dom";

export default function Login() {
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "success" | "error"

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback("Credenciais inválidas.");
        setFeedbackType("error");
      } else {
        setFeedback("Login realizado com sucesso!");
        setFeedbackType("success");
        window.location.href = "/dashboard";

        // Salvar token (opcional)
        localStorage.setItem("token", data.access_token);
      }

      setTimeout(() => setFeedback(""), 5000);

    } catch (error) {
      setFeedback("Erro ao conectar ao servidor.");
      setFeedbackType("error");
      setTimeout(() => setFeedback(""), 5000);
    }
  }

  return (
    <main className="login-main">
      <section className="nav-login">
        <Link to='/'>
          <div className="title-login">
          
            <img src={arrowIcon} alt="Icon of a arrow" />
            <h1>Início</h1>
          
          </div>
        </Link>
        <div className="logo-login">
          <img src={logo} alt="Image of a logo" />
        </div>
      </section>

      <section className="form-login">
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            <span>
              <img src={emailIcon} alt="Icon of a email" className="img-label-login" />
              E-mail
            </span>
            <input type="email" placeholder="Email" id="email" />
          </label>

          <label htmlFor="senha">
            <span>
              <img src={passwordIcon} alt="Icon of a key" className="img-label-login" />
              Senha
            </span>
            <input type="password" placeholder="Senha" id="senha" />
          </label>

          <button>Entrar</button>

          {feedback && (
            <p className={`feedback ${feedbackType}`}>{feedback}</p>
          )}

          <div className="link-login">
            <p>Ainda não possui cadastro?</p>
            <Link to='/register'>
              <a href="">Cadastre-se aqui</a>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
