from uuid import UUID

from fastapi import Depends
from sqlalchemy import select, delete, text
from sqlalchemy.ext.asyncio import AsyncSession

from api.shemas.components import ComponentsModel
from api.shemas.presentation import PresentationDataModel, PresentationResultModel, PresentationBaseModel, PresentationUpdateModel
from api.shemas.slide import SlideModel, SlideUpdateModel
from db.postgres import get_db
from services.hash_password import hash_password
from models.models import Presentation, Slides, Components, User


class DBManager:

    def __init__(self, connection: AsyncSession) -> None:
        self.connection = connection

    async def delete_presentation(self, presentation_id: UUID, user_id: UUID) -> None:
        await self.connection.execute(
            delete(Presentation)
            .where(Presentation.id == presentation_id)
            .where(Presentation.user_id == user_id)
        )
        await self.connection.commit()
    
    async def get_presentations(self, user_id: UUID) -> list[PresentationBaseModel]:
        query = select(Presentation).where(Presentation.user_id == user_id)
        presentations = (await self.connection.scalars(query)).all()
        return [PresentationBaseModel(name=pres.name, id=pres.id) for pres in presentations]

    async def get_presentation(self, user_id: UUID, presentation_id: UUID) -> list:
        query = (select(
            Presentation.id,
            Presentation.created_at,
            Presentation.name,
            Presentation.background,
            Slides.id.label('slide_id'),
            Slides.number,
            Components.id.label('component_id'),
            Components.content,
            Components.type,
            Components.top,
            Components.left
        ).join(Slides, Slides.presentation_id == Presentation.id)
        .join(Components, Components.slide_id == Slides.id)
        .where(Presentation.user_id == user_id)
        .where(Presentation.id == presentation_id))

        result = await self.connection.execute(query)
        res = []

        for row in result:
            presentation_id, created_at, name, background, slide_id, slide_number, component_id, content, component_type, top, left = row
            presentation_id = str(presentation_id)
            slide_id = str(slide_id)

            existing_presentation = next((p for p in res if p['id'] == presentation_id), None)

            if not existing_presentation:
                new_presentation = {
                    'id': presentation_id,
                    'date': created_at,
                    'background': background,
                    'name': name,
                    'slides': []
                }
                res.append(new_presentation)
                existing_presentation = new_presentation

            existing_slide = next((s for s in existing_presentation['slides'] if s['slide_id'] == slide_id), None)

            if existing_slide:
                existing_slide['components'].append({
                    'id': component_id,
                    'content': content,
                    'type': component_type,
                    'top': top,
                    'left': left
                })
            else:
                new_slide = {
                    'slide_id': slide_id,
                    'number': slide_number,
                    'components': [{
                        'id': component_id,
                        'content': content,
                        'type': component_type,
                        'top': top,
                        'left': left
                    }]
                }
                existing_presentation['slides'].append(new_slide)
        return res

    async def create_presentation(self, data: PresentationDataModel) -> PresentationResultModel:
        new_p = Presentation(user_id=data.user_id, name=data.name, background=data.background)
        self.connection.add(new_p)
        await self.connection.flush()
        res = PresentationResultModel(id=new_p.id, name=data.name, slides=[])
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
                    top=component.top,
                    left=component.left
                )
                self.connection.add(new_c)
                await self.connection.flush()
                new_slide.components.append(ComponentsModel(id=new_c.id, **component.model_dump()))

            res.slides.append(new_slide)
        await self.connection.commit()

        return res

    async def update_presentation(self, data: PresentationUpdateModel):
        res = await self.create_presentation(data)
        await self.delete_presentation(data.id, data.user_id)
        return res

    async def get_user(self, body):
        return (
        await self.connection.scalars(
            select(User).where(
                User.username == body.username,
                User.hashed_password == hash_password(body.password),
            )
        )
        ).one_or_none()
    
    async def create_user(self, body):
        new_u = User(username=body.username, hashed_password=hash_password(body.password))
        self.connection.add(new_u)
        await self.connection.commit()
        return new_u.id
            


def get_db_manager(conn: AsyncSession = Depends(get_db)) -> DBManager:
    return DBManager(conn)
