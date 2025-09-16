from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class Simulation(BaseModel):
    id: int
    user_id: int
    type: str
    input_data: Optional[Dict[str, Any]]
    result_data: Optional[Dict[str, Any]]
    created_at: datetime
