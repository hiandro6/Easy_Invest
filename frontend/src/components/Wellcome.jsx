import logo from "../assets/logo_cut.png";
import "./Wellcome.css"

export default function Wellcome () {
    return (
        <>
            <main>
                <section className="content">
                    <img src={logo} alt="Image of a logo" />
                    <p>Sua plataforma de investimentos</p>
                    <div className="options">
                        <button>Login</button>
                        <button>Cadastre-se</button>
                    </div>
                </section>
            </main>
        </>
    )
}