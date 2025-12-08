from pydantic import BaseModel

class CotacaoRequest(BaseModel):
    par: str
    valor: float
