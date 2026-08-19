import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User, RoleEnum

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_error
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_error
    user_id = payload.get("sub")
    if not user_id:
        raise credentials_error
    user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
    if not user:
        raise credentials_error
    return user


def require_candidate(user: User = Depends(get_current_user)) -> User:
    if user.role != RoleEnum.candidate:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate access only")
    return user


def require_hr(user: User = Depends(get_current_user)) -> User:
    if user.role != RoleEnum.hr:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HR access only")
    return user
