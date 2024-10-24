# Import necessary modules and classes
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from .database import Base


class zcount_timeline(Base):
    __tablename__ = "zoea_count_timeline"

    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, unique=True)
    count_data = Column(Integer)
    mortality = Column(Float)
    cumulative_mortality = Column(Float)

