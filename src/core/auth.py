from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session
from database import get_session
from models.user import User
from core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    # --- 1) Decodifica o token ---
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Token malformado")

        # Sempre converter para int
        user_id = int(user_id)

    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    # --- 2) Busca usuário no banco ---
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return user
