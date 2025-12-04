from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

"""class User(BaseModel):
    id: Optional[int]
    name: str
    email: str
    hashed_password: str
    created_at: datetime = datetime.now()"""

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str