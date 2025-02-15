from uuid import UUID

from pydantic import BaseModel


class UserModel(BaseModel):
    id: UUID
    role: str
    name: str
    username: str
