from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.shemas.components import ComponentsModel
from api.shemas.presentation import PresentationDataModel, PresentationResultModel
from api.shemas.slide import SlideModel
from db.postgres import get_db
from models.models import Presentation, Slides, Components


class DBManager:

    def __init__(self, connection: AsyncSession) -> None:
        self.connection = connection

    async def delete_presentation(self, presentation_id: UUID):
        pass

    async def create_presentation(self, data: PresentationDataModel) -> PresentationResultModel:
        new_p = Presentation(user_id=data.user_id)
        self.connection.add(new_p)
        await self.connection.flush()
        res = PresentationResultModel(id=new_p.id, slides=[])
        for slide in data.slides:
            new_s = Slides(number=slide.number, presentation_id=new_p.id)
            self.connection.add(new_s)
            await self.connection.flush()

            new_slide = SlideModel(id=new_s.id, number=slide.number, components=[])
            for component in slide.components:
                new_c = Components(
                    content=component.content,
                    width=component.width,
                    height=component.width,
                    type=component.type,
                    slide_id=new_s.id,
                )
                self.connection.add(new_c)
                await self.connection.flush()
                new_slide.components.append(ComponentsModel(id=new_c.id, **component.model_dump()))

            res.slides.append(new_slide)
        await self.connection.commit()

        return res


def get_db_manager(conn: AsyncSession = Depends(get_db)) -> DBManager:
    return DBManager(conn)
