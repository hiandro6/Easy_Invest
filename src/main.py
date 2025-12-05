from fastapi import FastAPI, HTTPException, Query, Depends
from dotenv import load_dotenv
import os
import httpx 
import requests
from datetime import datetime, timedelta
from schemas.simulation import Simulation
from schemas.loan import Loan
from schemas.investment import Investment
from schemas.investment_inflation import InvestmentInflation
from schemas.compare import CompareRequest, ComparisonItem
from database import create_db_and_tables, get_session
from contextlib import asynccontextmanager
from schemas.user import UserLogin, UserCreate, UserRead
from core.security import verify_password, create_access_token, hash_password
from sqlmodel import Session, select
from models.user import User
from core.auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

load_dotenv()

# AWESOME API (COTAÇÃO DAS MOEDAs)
token = os.getenv('AWESOME_API_KEY')
awesome_url = "https://economia.awesomeapi.com.br/json/last"



@asynccontextmanager
async def lifespan(app: FastAPI): #executa ao iniciar a API
    create_db_and_tables()
    yield  


app = FastAPI(
    title="Easy Invest API",
    version="1.0.0",
    lifespan=lifespan
)

@app.post("/users/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):

    email_exists = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if email_exists:
        raise HTTPException(400, "E-mail já cadastrado.")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

@app.post("/users/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):

    user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()

    if not user:
        raise HTTPException(400, "Credenciais inválidas.")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(400, "Credenciais inválidas.")

    token = create_access_token({"sub": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


@app.post("/simulations/investment", response_model=Simulation) #hiandro
def simulate_investment(investment: Investment, current_user: User = Depends(get_current_user)):

    C = investment.valor_inicial
    i = investment.taxa_mensal / 100
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
        user_id=current_user.id,
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
def simulate_loan(loan: Loan, current_user: User = Depends(get_current_user)):
    valores_mensais = []
    C = loan.valor_desejado
    i = loan.taxa_juros / 100
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
        user_id=current_user.id,
        type="loan",
        input_data=loan.model_dump(),
        result_data={
            "valor_final": M,
            "valores_mensais": valores_mensais
        })
    return simulation

@app.get("/simulations/history", response_model=list[Simulation]) #hiandro
def get_simulation_history(current_user: User = Depends(get_current_user)
):
    "Histórico de simulações"

    pass



@app.post("/simulations/compare", response_model=Simulation)  # hiandro
def compare_simulations(compare_request: CompareRequest, current_user: User = Depends(get_current_user)):

    def calcular(item: ComparisonItem):
        C = item.valor_inicial
        i = item.taxa_mensal / 100  
        t = item.prazo_meses
        evolucao = []

        if item.tipo_juros == "simples":
            M = C * (1 + i * t)
            for mes in range(1, t + 1):
                valor = C * (1 + i * mes)
                evolucao.append({"mes": mes, "valor": round(valor, 2)})

        else:
            M = C * ((1 + i) ** t)
            for mes in range(1, t + 1):
                valor = C * ((1 + i) ** mes)
                evolucao.append({"mes": mes, "valor": round(valor, 2)})

        return {
            "valor_final": round(M, 2),
            "lucro": round(M - C, 2),
            "evolucao": evolucao
        }

    resultado = {
        "simulacao1": calcular(compare_request.simulacao1),
        "simulacao2": calcular(compare_request.simulacao2),
        "simulacao3": calcular(compare_request.simulacao3)
    }

    simulation = Simulation(
        id=None,
        user_id=current_user.id,
        type="comparison",
        input_data=compare_request.model_dump(),
        result_data=resultado
    )

    return simulation

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
def simulate_investment_inflation(investment_inflation: InvestmentInflation, current_user: User = Depends(get_current_user)):


    C = investment_inflation.valor_inicial
    i = investment_inflation.taxa_mensal / 100
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
                "valor": round(valor, 2),          
                "valor_real": round(valor_ajustado, 2)
            })

    M_real = M / ((1 + inflacao) ** t) #valor final real

    lucro_nominal = M - C
    lucro_real = M_real - C

    simulation = Simulation(
        id=None,
        user_id=current_user.id,
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