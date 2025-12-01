from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from schemas.user import User
from schemas.simulation import Simulation
<<<<<<< HEAD
from dotenv import load_dotenv
import os
import httpx 
from typing import Optional
=======
from schemas.loan import Loan



>>>>>>> 587453493dc08c98f8b24f0daca4302c30d7053d

app = FastAPI(title="Easy Invest API", version="1.0.0")

load_dotenv()

# AWESOME API (COTAÇÃO DAS MOEDAs)
token = os.getenv('AWESOME_API_KEY')
awesome_url = "https://economia.awesomeapi.com.br/json/last"


@app.post("/users/register", response_model=User)
def register_user(user: User):
    "Cadastro de novos usuários"
    pass


@app.post("/users/login")
def login_user(email: str, password: str):
    "Autenticação de usuários"
    pass


@app.post("/simulations/investment", response_model=Simulation) #hiandro
def simulate_investment(simulation: Simulation):
    "Simular investimento"
    pass


<<<<<<< HEAD
@app.post("/cotacao/")
async def get_cotacao(par: str):
    headers = {"X-API-Key": token}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{awesome_url}/{par}", headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()

@app.post("/simulations/loan", response_model=Simulation) #hiandro
def simulate_loan(simulation: Simulation):
    "Simular empréstimo"
    pass
=======
@app.post("/simulations/loan", response_model=Simulation)
def simulate_loan(loan: Loan):
    valores_mensais = []
    
    # montante = valor_inicial * (1 + taxa_juros * prazo_meses)  # Juros simples
>>>>>>> 587453493dc08c98f8b24f0daca4302c30d7053d

    # montante = valor_inicial * (1 + taxa_juros) ** prazo_meses  # Juros compostos
@app.get("/simulations/history", response_model=list[Simulation])
def get_simulation_history(user_id: int):
    "Histórico de simulações"

    pass


@app.post("/simulations/compare")
def compare_simulations(simulations_ids: list[int]):
    "Comparar simulações"
    pass

