from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.db.database import get_db
from app.schemas.user import LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UserResponse, UserCreate
from app.services.user_service import UserService

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Endpoint de login"""
    user = UserService.authenticate_user(db, credentials.userName, credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.isActive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )

    role = user.role
    permissions = role.permissions

    permissions_claim = []

    for permission in permissions:
        permissions_claim.append({
            "id": permission.id,
            "name": permission.key,
        })

    role_claims = {
        "id": role.id,
        "name": role.name,
        "permissions": permissions_claim,
    }
    # Crear tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id,
              "firstName": user.firstName,
              "lastName": user.lastName,
              "role": role_claims},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.id,
              "firstName": user.firstName,
              "lastName": user.lastName,
              "role": role_claims})

    return LoginResponse(
        accessToken=access_token,
        refreshToken=refresh_token
    )


@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh_token(refresh_data: RefreshTokenRequest):
    """Refrescar access token"""
    payload = decode_token(refresh_data.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de refresh inválido"
        )

    user_id = payload.get("sub")
    first_name = payload.get("firstName")
    last_name = payload.get("lastName")
    role = payload.get("role")

    if not user_id or not first_name or not last_name or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    # Crear nuevo access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id,
              "firstName": first_name,
              "lastName": last_name,
              "role": role},
        expires_delta=access_token_expires
    )

    return RefreshTokenResponse(accessToken=access_token)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Crear nuevo usuario"""
    # Verificar si username ya existe
    existing_user = UserService.get_user_by_username(db, user.userName)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El username ya está registrado"
        )

    # Verificar si email ya existe
    existing_email = UserService.get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    return UserService.create_user(db, user)