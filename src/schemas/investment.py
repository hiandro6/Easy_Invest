from pydantic import BaseModel
from typing import Optional, Literal


class Investment(BaseModel):
    id: Optional[int]
    valor_inicial: float
    taxa_mensal: float
    prazo_meses: int
    tipo_juros: Literal['simples', 'composto']