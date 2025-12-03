from pydantic import BaseModel
from typing import Literal

class InvestmentInflation(BaseModel):
    valor_inicial: float
    taxa_mensal: float
    prazo_meses: int
    tipo_juros: Literal["simples", "compostos"]
    cenario: Literal["otimista", "neutro", "pessimista"]