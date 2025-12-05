from pydantic import BaseModel, Field
from typing import Any, Optional
from datetime import datetime

class Simulation(BaseModel):
    id: Optional[int] = None 
    user_id: Optional[int] = None
    type: str
    input_data: Any
    result_data: Any
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True
