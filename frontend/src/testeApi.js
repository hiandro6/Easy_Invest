export async function testConnection() {
    try {
      const res = await fetch("http://localhost:8000/taxas-juros/");
      const data = await res.json();
      console.log("Conexão OK! Dados recebidos:", data);
    } catch (error) {
      console.log("Erro ao conectar:", error);
    }
  }
  