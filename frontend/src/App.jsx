import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Wellcome from './components/Wellcome'
import Comparar from './components/Comparar'
import Cotacao from './components/Cotacao'
import Taxas from './components/Taxas'
import Dashboard from './components/Dashboard'
import Emprestimo from './components/Emprestimo'
import Inflacao from './components/Inflacao'
import Investimento from './components/Investimento'
import Historico from './components/Historico'
function App() {

  return (
    <>
      {/* <Taxas></Taxas> funcionando */}
      <Login></Login> {/*login é obrigatório para acessar a maioria das rotas */}
      {/* <Emprestimo></Emprestimo> funcionando */}
      {/* <Register></Register> */}
      <Inflacao></Inflacao>
      <Investimento></Investimento>
    </>
  )
}

export default App
