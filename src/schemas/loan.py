from pydantic import BaseModel
from typing import Optional, Literal


class Loan(BaseModel):
    id: Optional[int] = None
    valor_desejado: float
    prazo_meses: int
    taxa_juros: float
    tipo_juros: Literal['simples', 'compostos']
    valor_final: Optional[float] = None