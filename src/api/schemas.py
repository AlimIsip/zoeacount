from datetime import datetime
from pydantic import BaseModel

class ZCountTimelineBase(BaseModel):
    count_data: int
    mortality: float | None = None
    cumulative_mortality: float | None = None

class ZCountTimelineCreate(ZCountTimelineBase):
    id: int
    date_time: datetime
    pass

class ZCountTimeline(ZCountTimelineBase):
    id: int
    date_time: datetime

    class Config:
        orm_mode = True

