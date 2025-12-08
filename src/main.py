from fastapi import FastAPI, HTTPException, Query, Depends
from dotenv import load_dotenv
import os
import httpx 
import requests
from datetime import datetime, timedelta
from schemas.simulation import Simulation as SimulationSchema
from models.simulation import Simulation as SimulationModel
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
from fastapi.middleware.cors import CORSMiddleware
from schemas.cotacao import CotacaoRequest

#pra exportação de pdf:
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
import tempfile

from finlight_client import FinlightApi, ApiConfig
from finlight_client.models import GetArticlesParams

load_dotenv()

# AWESOME API (COTAÇÃO DAS MOEDAs)
token = os.getenv('AWESOME_API_KEY')
awesome_url = "https://economia.awesomeapi.com.br/json/last"
# Finlight api (noticias)
FINLIGHT_API_KEY = os.getenv("FINLIGHT_API_KEY")  # ou define diretamente
FINLIGHT_URL = "https://api.finlight.me/v1/articles"
# Inicializa o cliente da Finlight
client = FinlightApi(
    config=ApiConfig(
        api_key=FINLIGHT_API_KEY
    )
)


@asynccontextmanager
async def lifespan(app: FastAPI): #executa ao iniciar a API
    create_db_and_tables()
    yield  


app = FastAPI(
    title="Easy Invest API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users/me", response_model=UserRead)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return current_user


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



@app.post("/simulations/investment/pdf")
def generate_investment_pdf(investment: Investment, current_user: User = Depends(get_current_user)):
    C = investment.valor_inicial
    i = investment.taxa_mensal / 100
    t = investment.prazo_meses

    evolucao = []
    if investment.tipo_juros == "simples":
        for mes in range(1, t + 1):
            valor = C * (1 + i * mes)
            evolucao.append([mes, round(valor, 2)])
    else:
        for mes in range(1, t + 1):
            valor = C * ((1 + i) ** mes)
            evolucao.append([mes, round(valor, 2)])

    valor_final = evolucao[-1][1]
    lucro = valor_final - C

    styles = getSampleStyleSheet()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        pdf_path = tmp.name

    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    elements = []

    #título
    elements.append(Paragraph("<b>Relatório de Simulação de Investimento</b>", styles['Title']))
    elements.append(Spacer(1, 20))

    #dados iniciais
    elements.append(Paragraph(f"<b>Valor Inicial:</b> R$ {C}", styles['Normal']))
    elements.append(Paragraph(f"<b>Prazo:</b> {t} meses", styles['Normal']))
    elements.append(Paragraph(f"<b>Taxa Mensal:</b> {investment.taxa_mensal}% ao mês", styles['Normal']))
    elements.append(Paragraph(f"<b>Tipo de Juros:</b> {investment.tipo_juros.title()}", styles['Normal']))
    elements.append(Spacer(1, 20))

    #resultado
    elements.append(Paragraph(f"<b>Valor Final:</b> R$ {round(valor_final, 2)}", styles['Heading3']))
    elements.append(Paragraph(f"<b>Lucro:</b> R$ {round(lucro, 2)}", styles['Heading3']))
    elements.append(Spacer(1, 20))

    #tabela da evolução
    table_data = [["Mês", "Saldo (R$)"]] + evolucao

    table = Table(table_data)
    table.setStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("ALIGN", (1, 1), (-1, -1), "CENTER")
    ])

    elements.append(Paragraph("<b>Evolução Mensal</b>", styles['Heading2']))
    elements.append(table)

    doc.build(elements)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="simulacao_investimento.pdf"
    )


@app.post("/simulations/investment", response_model=SimulationSchema) 
def simulate_investment(investment: Investment, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):

    C = investment.valor_inicial
    i = investment.taxa_mensal / 100
    t = investment.prazo_meses
    evolucao = []

    if investment.tipo_juros == "simples":
        M = C * (1 + i * t)

        for mes in range(1, t + 1):
            valor = C * (1 + i * mes)
            evolucao.append({"mes": mes, "valor": round(valor)})
    elif investment.tipo_juros == "compostos":
        M = C * ((1 + i) ** t)

        for mes in range(1, t + 1):
            valor = C * ((1 + i) ** mes)
            evolucao.append({"mes": mes, "valor": round(valor)})
    M = round(M, 2)
    lucro = round(M - C, 2)

    simulation = SimulationModel(
        user_id=current_user.id,
        type="investment",
        input_data=investment.model_dump(),
        result_data={
            "valor_final": M,
            "lucro": lucro,
            "evolucao": evolucao
        }
    )

    session.add(simulation)
    session.commit()
    session.refresh(simulation)

    return simulation

"""@app.post("/cotacao/")
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
"""




@app.post("/cotacao/")
async def get_cotacao(body: CotacaoRequest):
    par = body.par
    valor = body.valor

    headers = {"X-API-Key": token}

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{awesome_url}/{par}", headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()

    key = list(data.keys())[0]
    bid = float(data[key]["bid"])

    valor_convertido = valor * bid

    return {
        "par": par,
        "valor_original": valor,
        "bid": bid,
        "valor_convertido": valor_convertido
    }



@app.post("/simulations/loan", response_model=SimulationSchema)
def simulate_loan(loan: Loan, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    print("Recebido PELA ROTA LOAN:", loan.model_dump())
    print("Recebido 2 PELA ROTA LOAN:", loan)
    print("TIPO 3 ROTA LOAN:", repr(loan.tipo_juros))
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

    loan.valor_final = round(M, 2)

    simulation = SimulationModel(
    user_id=current_user.id,
    type="loan",
    input_data=loan.model_dump(),
    result_data={
        "valor_final": M,
        "valores_mensais": valores_mensais
    })

    session.add(simulation)
    session.commit()
    session.refresh(simulation)

    return simulation

@app.get("/simulations/history", response_model=list[SimulationSchema]) 
def get_simulation_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    simulations = session.exec(
        select(SimulationModel).where(SimulationModel.user_id == current_user.id)
    ).all()

    return simulations



@app.delete("/simulations/{sim_id}")
def delete_simulation(
    sim_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    simulation = session.get(SimulationModel, sim_id)

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulação não encontrada")

    if simulation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão para apagar esta simulação")

    session.delete(simulation)
    session.commit()

    return {"message": "Simulação apagada com sucesso", "deleted_id": sim_id}


@app.post("/simulations/compare", response_model=SimulationSchema)  
def compare_simulations(compare_request: CompareRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):

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

    simulation = SimulationModel(
        user_id=current_user.id,
        type="comparison",
        input_data=compare_request.model_dump(),
        result_data=resultado
    )

    session.add(simulation)
    session.commit()
    session.refresh(simulation)

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

@app.post("/simulations/investment-inflation", response_model=SimulationSchema)
def simulate_investment_inflation(investment_inflation: InvestmentInflation, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):


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


    elif investment_inflation.tipo_juros == "compostos":
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

    simulation = SimulationModel(
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

    session.add(simulation)
    session.commit()
    session.refresh(simulation)

    return simulation


@app.get("/news")
async def get_news():
    try:
        # Parâmetros da busca
        params = GetArticlesParams(
            query="stocks",
            language="en",
            page_size=3
        )

        # Chama a API via SDK oficial
        result = client.articles.fetch_articles(params=params)

        # result.articles é uma lista de artigos
        articles = []
        for art in result.articles[:3]:
            articles.append({
                "title": art.title,
                "summary": art.summary,
                "image": art.images[0] if art.images else None,
                "link": art.link
            })

        return {"news": articles}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar notícias: {e}")