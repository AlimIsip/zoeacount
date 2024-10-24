from sqlalchemy.orm import Session

from . import models, schemas
from .models import zcount_timeline


def get_timeline(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.zcount_timeline).offset(skip).limit(limit).all()


def create_timeline_entry(db: Session, count_timeline: schemas.ZCountTimelineCreate):
    db_timeline = models.zcount_timeline(
        count_data = count_timeline.count_data,
        mortality = count_timeline.mortality,
        cumulative_mortality = count_timeline.cumulative_mortality,
    )
    db.add(db_timeline)
    db.commit()
    db.refresh(db_timeline)
    return db_timeline

