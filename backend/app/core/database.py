from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

from sqlalchemy.engine import URL

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=settings.DB_USER,
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=int(settings.DB_PORT),
    database=settings.DB_NAME,
)


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

from sqlalchemy.orm import Session


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()