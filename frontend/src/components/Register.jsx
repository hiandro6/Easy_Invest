import "./Register.css";
import emailIcon from "../assets/o-email.png";
import passwordIcon from "../assets/old-big-key.png";
import arrowIcon from "../assets/arrow_back_white.svg";
import logo from "../assets/logo_cut.png";
import api from "../api/axios";
import { useState } from "react";

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");


  async function handleRegister(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
  
    try {
      const response = await api.post("/users/register", {
        name: nome,
        email: email,
        password: senha,
      });
  
      setSucesso("Usuário cadastrado com sucesso!");
      setTimeout(() => setSucesso(""), 5000);

      setTimeout(() => {
        window.location.href = "/login"; // redirecionar
      }, 1200);
  
    } catch (error) {
      if (error.response?.data?.detail) {
        setErro(error.response.data.detail);
      } else {
        setErro("Erro ao registrar. Tente novamente.");
      }
      setTimeout(() => setErro(""), 5000);
    }
  }
  
  return (
    <main className="register-main">
      <section className="form-register">
        <div className="title-register">
          <img src={arrowIcon} alt="Icon of a arrow" />
          <h1>Início</h1>
        </div>

        {erro && <p className="erro-text">{erro}</p>}
        {sucesso && <p className="sucesso-text">{sucesso}</p>}

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
            <input type="text" placeholder="Usuário Investidor" id="nome" value={nome} 
            onChange={(e) => setNome(e.target.value)}/>
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
            <input type="email" placeholder="Email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}/>
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
            <input type="password" placeholder="Senha" id="senha" value={senha}
            onChange={(e) => setSenha(e.target.value)}/>
          </label>

          <button onClick={handleRegister}>Cadastre-se</button>
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
