# database.py
from sqlmodel import SQLModel, create_engine, Session
from models.user import User
from models.simulation import Simulation

DATABASE_URL = "sqlite:///./easyinvest.db"

engine = create_engine(
    DATABASE_URL,
    echo=True,  # mostra as queries
    connect_args={"check_same_thread": False}  # necessário para SQLite
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
