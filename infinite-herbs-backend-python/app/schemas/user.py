from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ===== Permissions =====
class PermissionBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, alias="key")


class PermissionResponse(PermissionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ===== Roles =====
RoleName = Literal["admin", "user", "viewer"]


class RoleBase(BaseModel):
    name: RoleName


class RoleResponse(RoleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    permissions: List[PermissionResponse] = []


# ===== Users =====
class UserBase(BaseModel):
    userName: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    firstName: str = Field(..., min_length=2, max_length=100)
    lastName: str = Field(..., min_length=2, max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    isActive: Optional[bool] = None
    role: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    firstName: Optional[str] = Field(None, min_length=2, max_length=100)
    lastName: Optional[str] = Field(None, min_length=2, max_length=100)
    isActive: Optional[bool] = None
    role: Optional[str] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    isActive: bool
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    role: RoleResponse


# ===== Auth =====
class LoginRequest(BaseModel):
    userName: str
    password: str


class LoginResponse(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class RefreshTokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"