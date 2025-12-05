from pydantic import BaseModel
from typing import Optional, Literal


class Loan(BaseModel):
    id: Optional[int]
    valor_desejado: float
    prazo_meses: int
    taxa_juros: float
    valor_final: Optional[float] = None
    tipo_juros: Literal['simples', 'compostos']