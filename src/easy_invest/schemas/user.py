from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int]
    name: str
    email: str
    hashed_password: str
    created_at: datetime = datetime.now()