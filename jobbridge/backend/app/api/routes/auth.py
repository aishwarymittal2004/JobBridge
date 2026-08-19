from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.db.session import get_db
from app.models.user import User, RoleEnum
from app.schemas.user import (
    CandidateSignup,
    HRSignup,
    LoginRequest,
    RefreshRequest,
    TokenPair,
    UserOut,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

print("AUTH ROUTER LOADED")

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


# =====================================================
# Helper Function
# =====================================================

def _issue_tokens(user: User) -> TokenPair:
    """
    Generate access and refresh tokens
    for authenticated users.
    """
    return TokenPair(
        access_token=create_access_token(
            str(user.id),
            user.role.value,
        ),
        refresh_token=create_refresh_token(
            str(user.id),
            user.role.value,
        ),
        user=UserOut.model_validate(user),
    )


# =====================================================
# Candidate Signup
# =====================================================

@router.post(
    "/candidate/signup",
    response_model=TokenPair,
    status_code=status.HTTP_201_CREATED,
)
def candidate_signup(
    payload: CandidateSignup,
    db: Session = Depends(get_db),
):
    try:
        print("========== CANDIDATE SIGNUP ==========")
        print("Name:", payload.name)
        print("Email:", payload.email)

        existing_user = (
            db.query(User)
            .filter(User.email == payload.email)
            .first()
        )

        if existing_user:
            print("Email already exists")
            raise HTTPException(
                status_code=400,
                detail="Email already registered",
            )

        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=RoleEnum.candidate,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print("User created successfully")
        print("User ID:", user.id)

        return _issue_tokens(user)

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        db.rollback()

        print("DATABASE ERROR")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}",
        )

    except Exception as e:
        db.rollback()

        print("UNEXPECTED ERROR")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}",
        )


# =====================================================
# HR Signup
# =====================================================

@router.post(
    "/hr/signup",
    response_model=TokenPair,
    status_code=status.HTTP_201_CREATED,
)
def hr_signup(
    payload: HRSignup,
    db: Session = Depends(get_db),
):
    try:
        existing_user = (
            db.query(User)
            .filter(User.email == payload.email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered",
            )

        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=RoleEnum.hr,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return _issue_tokens(user)

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =====================================================
# Login
# =====================================================

@router.post(
    "/login",
    response_model=TokenPair,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return _issue_tokens(user)


# =====================================================
# Refresh Token
# =====================================================

@router.post(
    "/refresh",
    response_model=TokenPair,
)
def refresh(
    payload: RefreshRequest,
    db: Session = Depends(get_db),
):
    data = decode_token(payload.refresh_token)

    if not data:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    if data.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token type",
        )

    import uuid

    user = (
        db.query(User)
        .filter(
            User.id == uuid.UUID(data["sub"])
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return _issue_tokens(user)


# =====================================================
# Logout
# =====================================================

@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout():
    return None