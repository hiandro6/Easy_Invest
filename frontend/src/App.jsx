import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/taxas" element={<Taxas />} />
          <Route path="/emprestimo" element={<Emprestimo />} />
          <Route path="/inflacao" element={<Inflacao />} />
          <Route path="/comparar" element={<Comparar />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investimento" element={<Investimento />} />
          <Route path="/cotacao" element={<Cotacao />} />

          {/* Rota padrão -> redireciona para pagina inicial */}
          <Route path="*" element={<Wellcome />} />

        </Routes>
      
    </>
  )
}

export default App
