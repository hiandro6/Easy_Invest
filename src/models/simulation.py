from sqlmodel import SQLModel, Field, Column, JSON, Relationship
from typing import Optional
from datetime import datetime, timezone

class Simulation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")

    type: str

    input_data: dict = Field(sa_column=Column(JSON))
    result_data: dict = Field(sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: "User" = Relationship(back_populates="simulations")