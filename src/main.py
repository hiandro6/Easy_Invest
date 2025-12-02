from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from schemas.user import User
from schemas.simulation import Simulation
from dotenv import load_dotenv
import os
import httpx 
from typing import Optional
from schemas.loan import Loan
from schemas.investment import Investment
import requests
from datetime import datetime

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
def simulate_investment(investment: Investment):

    C = investment.valor_inicial
    i = investment.taxa_mensal
    t = investment.prazo_meses
    evolucao = []

    if investment.tipo_juros == "simples":
        M = C * (1 + i * t)

        for mes in range(1, t + 1):
            valor = C * (1 + i * mes)
            evolucao.append({"mes": mes, "valor": round(valor)})
    if investment.tipo_juros == "compostos":
        M = C * ((1 + i) ** t)

        for mes in range(1, t + 1):
            valor = C * ((1 + i) ** mes)
            evolucao.append({"mes": mes, "valor": round(valor)})


    simulation = Simulation(
        id=None,
        user_id=1, #verificar depois como vai ficar o id
        type="investment",
        input_data=investment.model_dump(),
        result_data={
            "valor_final": M,
            "evolucao": evolucao
        }
    )

    return simulation

@app.post("/cotacao/")
async def get_cotacao(par: str):
    headers = {"X-API-Key": token}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{awesome_url}/{par}", headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        return response.json()


@app.post("/simulations/loan", response_model=Simulation)
def simulate_loan(loan: Loan):
    valores_mensais = []
    C = loan.valor_desejado
    i = loan.taxa_juros
    t = loan.prazo_meses

    if loan.tipo_juros == "simples": # montante = valor_inicial * (1 + taxa_juros * prazo_meses)
        M = C * (1 + i * t)
        for mes in range(1, t + 1):
            valor_mensal = C * (1 + i * mes) 
            valores_mensais.append({"mes": mes, "valor": round(valor_mensal)})
    
    elif loan.tipo_juros == "compostos": # montante = valor_inicial * (1 + taxa_juros) ** prazo_meses
        M = C * (1 + i) ** t
        for mes in range(1, t + 1):
            valor_mensal = C * (1 + i) ** mes 
            valores_mensais.append({"mes": mes, "valor": round(valor_mensal)})

    loan.valor_final = round(M)

    simulation = Simulation(
        id=None,
        user_id=1, #verificar depois como vai ficar o id
        type="loan",
        input_data=loan.model_dump(),
        result_data={
            "valor_final": M,
            "valores_mensais": valores_mensais
        })
    return simulation

@app.get("/simulations/history", response_model=list[Simulation])
def get_simulation_history(user_id: int):
    "Histórico de simulações"

    pass


@app.post("/simulations/compare")
def compare_simulations(simulations_ids: list[int]):
    "Comparar simulações"
    pass


@app.get("/taxas-juros/") #hiandro
def get_rates():

    def consultar_sgs(serie_id: int) -> float:
        url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie_id}/dados?formato=json&ultimos=1"
        resp = requests.get(url)
        dados = resp.json()
        return float(dados[0]["valor"])

    tr = consultar_sgs(25)
    juros_fixos = consultar_sgs(26)
    
    poupanca = tr + juros_fixos
    selic = consultar_sgs(11)
    cdi = consultar_sgs(12)
    ipca = consultar_sgs(433)

    atualizado_em = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    return {
        "atualizado_em": atualizado_em,
        "poupanca": f"{poupanca:.2f}%",
        "selic": f"{selic:.2f}%",
        "cdi": f"{cdi:.2f}%",
        "ipca": f"{ipca:.2f}%"
    }