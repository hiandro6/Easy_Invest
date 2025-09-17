from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Simulation(BaseModel):
    id: Optional[int]
    user_id: int
    type: str 
    input_data: dict
    result_data: dict
    created_at: datetime = datetime.now()