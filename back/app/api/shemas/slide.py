from uuid import UUID

from pydantic import BaseModel, ConfigDict

from api.shemas.components import ComponentsCreateModel, ComponentsModel


class SlideCreateModel(BaseModel):
    number: int
    components: list[ComponentsCreateModel]


class SlideModel(BaseModel):
    id: UUID
    number: int
    components: list[ComponentsModel]
