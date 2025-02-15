from uuid import UUID

import requests


from fastapi import APIRouter, Depends, Query
from starlette import status

from api.shemas.components import ComponentsCreateModel
from api.shemas.presentation import PresentationCreateModel, PresentationDataModel
from api.shemas.slide import SlideCreateModel
from core.config import settings
from services.db_service import DBManager, get_db_manager

router = APIRouter()


@router.post(
    "/generate",
    status_code=status.HTTP_201_CREATED,
)
async def generate_presentation(
        payload: PresentationCreateModel,
        # user: UserModel = Depends(get_current_user),
        db_manager: DBManager = Depends(get_db_manager),
):
    user_id = '35130806-fc7b-46ec-ae7e-ec6d4bbc847f'
    response = requests.post(
        f"{settings.ML_SERVICE_URL}/main",
        json={'topic': payload.theme, 'description': payload.description}
    )
    presentation = PresentationDataModel(user_id=user_id, slides=[])
    for index, slide_data in enumerate(response.json()['slides']):
        slide = SlideCreateModel(number=index, components=[])
        for component in slide_data['elements']:
            slide.components.append(
                ComponentsCreateModel(
                  type=component['type'],
                  content=component['content'],
                  width=component['width'],
                  height=component['height'],
                )
            )
        presentation.slides.append(slide)
    return await db_manager.create_presentation(presentation)


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def generate_presentation(
    presentation_id: UUID = Query(None),
    # user: UserModel = Depends(get_current_user),
    db_manager: DBManager = Depends(get_db_manager),
):
    user_id = '35130806-fc7b-46ec-ae7e-ec6d4bbc847f'
    return await db_manager.delete_presentation(presentation_id)
