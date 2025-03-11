import uuid
from typing import Annotated

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from models.meta import Base


pk_uuid = Annotated[uuid.UUID, mapped_column(primary_key=True, default=uuid.uuid4)]
created_at = Annotated[DateTime, mapped_column(DateTime(timezone=True), default=func.now())]
updated_at = Annotated[
    DateTime,
    mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
    ),
]


class Presentation(Base):
    __tablename__ = "presentation"

    id: Mapped[pk_uuid]
    user_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    background: Mapped[int] = mapped_column(nullable=True)
    name: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Slides(Base):
    __tablename__ = "slide"

    id: Mapped[pk_uuid]
    presentation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("presentation.id", ondelete="CASCADE"),
        nullable=False,
    )
    number: Mapped[int] = mapped_column(nullable=False)
    components: Mapped[list["Components"]] = relationship(back_populates="slide")


class Components(Base):
    __tablename__ = "components"

    id: Mapped[pk_uuid]
    slide_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("slide.id", ondelete="CASCADE"), nullable=False)
    slide: Mapped["Slides"] = relationship(back_populates="components")
    type: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    width: Mapped[int] = mapped_column(nullable=True)
    height: Mapped[int] = mapped_column(nullable=True)
    left: Mapped[int] = mapped_column(nullable=True)
    top: Mapped[int] = mapped_column(nullable=True)


class User(Base):
    __tablename__ = "users"

    id: Mapped[pk_uuid]
    username: Mapped[str]
    hashed_password: Mapped[str]


