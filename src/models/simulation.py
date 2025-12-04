from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime, timezone


class Simulation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")

    type: str  # investment, loan, comparison, etc.

    # Para funcionar em SQLite e MySQL:
    input_data: str       # salvaremos JSON como string
    result_data: str      # salvaremos JSON como string

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: "User" = Relationship(back_populates="simulations")