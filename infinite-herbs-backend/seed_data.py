from app.core.security import get_password_hash
from app.db.database import SessionLocal, engine, Base
from app.models.user import User


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"⚠️ Ya existen {existing_users} usuarios en la base de datos")
        return

    users = [
        {
            "userName": "admin",
            "email": "admin@admin.com",
            "hashedPassword": get_password_hash("admin123"),
            "firstName": "Admin",
            "lastName": "System",
            "role": "admin",
            "isActive": True
        },
        {
            "userName": "jdoe",
            "email": "jdoe@admin.com",
            "hashedPassword": get_password_hash("admin123"),
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "isActive": True
        },
        {
            "userName": "mjane",
            "email": "mjane@admin.com",
            "hashedPassword": get_password_hash("admin123"),
            "firstName": "Mary",
            "lastName": "Jane",
            "role": "viewer",
            "isActive": True
        }
    ]

    for user_data in users:
        db_user = User(**user_data)
        db.add(db_user)

    db.commit()
    print("✅ Base de datos inicializada con 3 usuarios de prueba")
    print("\nCredenciales de prueba:")
    print("- admin / admin123 (rol: admin)")
    print("- jdoe / admin123 (rol: user)")
    print("- mjane / admin123 (rol: viewer)")

    db.close()


if __name__ == "__main__":
    seed_database()
