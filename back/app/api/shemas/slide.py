from uuid import UUID

from pydantic import BaseModel, ConfigDict

from api.shemas.components import ComponentsCreateModel, ComponentsModel


class SlideUpdateModel(BaseModel):
    id: UUID
    number: int


class SlideCreateModel(BaseModel):
    number: int
    components: list[ComponentsCreateModel]


class SlideModel(SlideUpdateModel):
    components: list[ComponentsModel]
