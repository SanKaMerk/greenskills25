from uuid import UUID

from pydantic import BaseModel

from api.shemas.slide import SlideModel, SlideCreateModel


class PresentationCreateModel(BaseModel):
    description: str
    theme: str


class PresentationDataModel(BaseModel):
    user_id: UUID
    slides: list[SlideCreateModel]


class PresentationResultModel(BaseModel):
    id: UUID
    slides: list[SlideModel]
