import logo from "../assets/logo_cut.png";
import "./Wellcome.css"
import { Link } from "react-router-dom";

export default function Wellcome () {
    return (
        <>
            <main className="wellcome-main">
                <section className="wellcome-content">
                    <img src={logo} alt="Image of a logo" />
                    <p className="wellcom-p">Sua plataforma de investimentos</p>
                    <div className="options">
                        <Link to="/login">
                            <button>Login</button>
                        </Link>

                        <Link to="/register">
                            <button>Cadastre-se</button>
                        </Link>
                    </div>
                </section>
            </main>
        </>
    )
}