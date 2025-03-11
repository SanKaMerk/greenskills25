from uuid import UUID

from pydantic import BaseModel


class ComponentsCreateModel(BaseModel):
    type: str
    content: str
    width: int | None = None
    height: int | None = None
    top: int | None = None
    left: int | None = None


class ComponentsModel(ComponentsCreateModel):
    id: UUID
