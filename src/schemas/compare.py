from typing import Literal
from pydantic import BaseModel

class ComparisonItem(BaseModel):
    valor_inicial: float
    taxa_mensal: float
    prazo_meses: int
    tipo_juros: Literal["simples", "compostos"]

class CompareRequest(BaseModel):
    simulacao1: ComparisonItem
    simulacao2: ComparisonItem
    simulacao3: ComparisonItem