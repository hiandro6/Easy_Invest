from pydantic import BaseModel
from typing import Optional, Literal


class Loan(BaseModel):
    id: Optional[int]
    valor_desejado: float
    prazo_meses: int
    taxa_juros: float
    valor_final: float
    tipo_juros: Literal['simples', 'composto']