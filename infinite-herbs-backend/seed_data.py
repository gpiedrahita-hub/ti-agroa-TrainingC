import os
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from app.core.security import get_password_hash
from app.db.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission


PERMISSIONS = [
    {"key": "dashboard:read", "description": "Read Dashboard"},
    {"key": "users:read", "description": "Read users"},
    {"key": "users:create", "description": "Create users"},
    {"key": "users:update", "description": "Update users"},
    {"key": "users:delete", "description": "Delete users"},
]

ROLES = [
    {"name": "admin", "description": "Administrator"},
    {"name": "user", "description": "Default user"},
    {"name": "viewer", "description": "Viewer"},
]


def upsert_permissions(db):
    stmt = sqlite_insert(Permission).values(PERMISSIONS)
    stmt = stmt.on_conflict_do_update(
        index_elements=[Permission.key],
        set_={"description": stmt.excluded.description},
    )
    db.execute(stmt)


def upsert_roles(db):
    for r in ROLES:
        stmt = sqlite_insert(Role).values(r)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Role.name],
            set_={"description": stmt.excluded.description},
        )
        db.execute(stmt)


def assign_role_permissions(db):
    perms_by_key = {p.key: p for p in db.execute(select(Permission)).scalars().all()}
    roles_by_name = {r.name: r for r in db.execute(select(Role)).scalars().all()}

    admin = roles_by_name["admin"]
    user = roles_by_name["user"]
    viewer = roles_by_name["viewer"]

    admin.permissions = [perms_by_key[p["key"]] for p in PERMISSIONS]
    user.permissions = [perms_by_key["dashboard:read"]]
    viewer.permissions = [perms_by_key["dashboard:read"], perms_by_key["users:read"]]


def upsert_users(db):
    roles_by_name = {r.name: r for r in db.execute(select(Role)).scalars().all()}

    password_plain = os.getenv("SEED_TEST_PASSWORD", "admin123")
    hashed = get_password_hash(password_plain)

    users = [
        {
            "userName": "admin",
            "email": "admin@test.com",
            "firstName": "Admin",
            "lastName": "Test",
            "hashedPassword": hashed,
            "isActive": True,
            "role_id": roles_by_name["admin"].id,
        },
        {
            "userName": "viewer",
            "email": "viewer@test.com",
            "firstName": "Viewer",
            "lastName": "Test",
            "hashedPassword": hashed,
            "isActive": True,
            "role_id": roles_by_name["viewer"].id,
        },
        {
            "userName": "user",
            "email": "user@test.com",
            "firstName": "User",
            "lastName": "Test",
            "hashedPassword": hashed,
            "isActive": True,
            "role_id": roles_by_name["user"].id,
        },
    ]

    for u in users:
        stmt = sqlite_insert(User).values(u)
        stmt = stmt.on_conflict_do_update(
            index_elements=[User.userName],
            set_={
                "email": stmt.excluded.email,
                "firstName": stmt.excluded.firstName,
                "lastName": stmt.excluded.lastName,
                "hashedPassword": stmt.excluded.hashedPassword,
                "isActive": stmt.excluded.isActive,
                "role_id": stmt.excluded.role_id,
            },
        )
        db.execute(stmt)


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        upsert_permissions(db)
        upsert_roles(db)
        db.commit()

        assign_role_permissions(db)
        db.commit()

        upsert_users(db)
        db.commit()

        print("✅ Seed OK: permisos, roles y usuarios creados/actualizados")
        print("Credenciales de prueba:")
        print("- admin / admin123 (rol: admin)")
        print("- user / admin123 (rol: user)")
        print("- viewer / admin123 (rol: viewer)")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()