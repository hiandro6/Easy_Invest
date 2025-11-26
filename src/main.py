from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from schemas.user import User
from schemas.simulation import Simulation
from schemas.loan import Loan




app = FastAPI(title="Easy Invest API", version="1.0.0")


@app.post("/users/register", response_model=User)
def register_user(user: User):
    "Cadastro de novos usuários"
    pass


@app.post("/users/login")
def login_user(email: str, password: str):
    "Autenticação de usuários"
    pass




@app.post("/simulations/investment", response_model=Simulation)
def simulate_investment(simulation: Simulation):
    "Simular investimento"
    pass


@app.post("/simulations/loan", response_model=Simulation)
def simulate_loan(loan: Loan):
    valores_mensais = []
    
    # montante = valor_inicial * (1 + taxa_juros * prazo_meses)  # Juros simples

    # montante = valor_inicial * (1 + taxa_juros) ** prazo_meses  # Juros compostos
    pass
@app.get("/simulations/history", response_model=list[Simulation])
def get_simulation_history(user_id: int):
    "Histórico de simulações"

    pass


@app.post("/simulations/compare")
def compare_simulations(simulations_ids: list[int]):
    "Comparar simulações"
    pass
