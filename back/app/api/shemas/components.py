from uuid import UUID

from pydantic import BaseModel


class ComponentsCreateModel(BaseModel):
    type: str
    content: str
    width: int
    height: int


class ComponentsModel(ComponentsCreateModel):
    id: UUID
