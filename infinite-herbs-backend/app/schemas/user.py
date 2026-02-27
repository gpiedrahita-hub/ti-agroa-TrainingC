from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# Base User Schema
class UserBase(BaseModel):
    userName: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    firstName: str = Field(..., min_length=2, max_length=100)
    lastName: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="user", pattern="^(admin|user|viewer)$")


# Crear Usuario
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    isActive: Optional[bool] = None


# Actualizar Usuario
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    firstName: Optional[str] = Field(None, min_length=2, max_length=100)
    lastName: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, pattern="^(admin|user|viewer)$")
    isActive: Optional[bool] = None


# Usuario en Response
class UserResponse(UserBase):
    id: str
    isActive: bool
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True


# Login
class LoginRequest(BaseModel):
    userName: str
    password: str


class LoginResponse(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "bearer"
    user: UserResponse


# Refresh Token
class RefreshTokenRequest(BaseModel):
    refreshToken: str


class RefreshTokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
