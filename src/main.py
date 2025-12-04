from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Query
from schemas.user import User
from schemas.simulation import Simulation
from dotenv import load_dotenv
import os
import httpx 
from typing import Optional
from schemas.loan import Loan
from schemas.investment import Investment
from schemas.investment_inflation import InvestmentInflation
import requests
from datetime import datetime, timedelta

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

    lucro = M - C

    simulation = Simulation(
        id=None,
        user_id=1, #verificar depois como vai ficar o id
        type="investment",
        input_data=investment.model_dump(),
        result_data={
            "valor_final": M,
            "lucro": lucro,
            "evolucao": evolucao
        }
    )

    return simulation

@app.post("/cotacao/")
async def get_cotacao(par: str, valor: float = Query(..., description="Valor a ser convertido")):
    headers = {"X-API-Key": token}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{awesome_url}/{par}", headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()

    # A AwesomeAPI retorna algo tipo: {"USDBRL": {"bid": "5.12", ...}}
    # Então pegamos o primeiro item desse dict:
    key = list(data.keys())[0]
    bid = float(data[key]["bid"])

    # Faz a conversão
    valor_convertido = valor * bid

    return {
        "par": par,
        "valor_original": valor,
        "bid": bid,
        "valor_convertido": valor_convertido
    }


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


@app.get("/taxas-juros/")
def get_rates():

    def consultar_sgs(serie_id: int) -> float:
        hoje = datetime.now()
        data_inicial = (hoje - timedelta(days=730)).strftime("%d/%m/%Y")
        data_final = hoje.strftime("%d/%m/%Y")

        url = (
            f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie_id}/dados"
            f"?formato=json&dataInicial={data_inicial}&dataFinal={data_final}"
        )

        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            raise HTTPException(status_code=503, detail=f"Erro ao consultar série {serie_id}")

        dados = resp.json()

        if not dados:
            raise HTTPException(status_code=503, detail=f"Série {serie_id} sem dados recentes")

        # pega o último registro (mais atual)
        ultimo = dados[-1]

        if "valor" not in ultimo:
            raise HTTPException(status_code=503, detail=f"Retorno inválido da série {serie_id}")

        return float(ultimo["valor"])

    tr = consultar_sgs(25)              # taxa referencial
    juros_fixos = consultar_sgs(26)     # juros da poupança
    poupanca = tr + juros_fixos

    selic = consultar_sgs(11)
    cdi = consultar_sgs(12)
    ipca = consultar_sgs(433)

    return {
        "atualizado_em": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "poupanca": f"{round(poupanca, 2)}%",
        "selic": f"{round(selic, 2)}%",
        "cdi": f"{round(cdi, 2)}%",
        "ipca": f"{round(ipca, 2)}%"
    }

@app.post("/simulations/investment-inflation", response_model=Simulation)
def simulate_investment_inflation(investment_inflation: InvestmentInflation):


    C = investment_inflation.valor_inicial
    i = investment_inflation.taxa_mensal
    t = investment_inflation.prazo_meses
    evolucao = []


    cenarios = {
        "otimista": 0.0025,
        "neutro":   0.0040,
        "pessimista": 0.0070
    }

    
    inflacao = cenarios[investment_inflation.cenario]

  
    if investment_inflation.tipo_juros == "simples":
        M = C * (1 + i * t)

        for mes in range(1, t + 1):
            valor = C * (1 + i * mes)                     # valor nominal
            valor_ajustado = valor / ((1 + inflacao) ** mes)  # valor real corrigido

            evolucao.append({
                "mes": mes,
                "valor": round(valor),  
                "valor_real": round(valor_ajustado, 2)
            })


    if investment_inflation.tipo_juros == "compostos":
        M = C * ((1 + i) ** t)

        for mes in range(1, t + 1):
            valor = C * ((1 + i) ** mes)                  # valor nominal
            valor_ajustado = valor / ((1 + inflacao) ** mes)

            evolucao.append({
                "mes": mes,
                "valor": round(valor),          
                "valor_real": round(valor_ajustado, 2)
            })

    M_real = M / ((1 + inflacao) ** t) #valor final real

    lucro_nominal = M - C
    lucro_real = M_real - C

    simulation = Simulation(
        id=None,
        user_id=1,
        type="investment_inflation",
        input_data=investment_inflation.model_dump(),
        result_data={
            "valor_final_nominal": round(M, 2),
            "valor_final_real": round(M_real, 2),
            "lucro_nominal": round(lucro_nominal, 2),
            "lucro_real": round(lucro_real, 2),
            "inflacao_mensal": inflacao,
            "evolucao": evolucao
        }
    )

    return simulation