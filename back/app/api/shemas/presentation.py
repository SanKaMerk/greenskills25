from uuid import UUID

from pydantic import BaseModel

from api.shemas.slide import SlideModel, SlideCreateModel


class PresentationBaseModel(BaseModel):
    name: str
    id: UUID

class PresentationCreateModel(BaseModel):
    description: str
    theme: str


class PresentationUpdateModel(PresentationBaseModel):
    slides: list[SlideCreateModel]
    user_id: UUID | None = None
    background: int


class PresentationDataModel(BaseModel):
    user_id: UUID
    name: str
    slides: list[SlideCreateModel]
    background: int | None = None


class PresentationResultModel(PresentationBaseModel):
    slides: list[SlideModel]

