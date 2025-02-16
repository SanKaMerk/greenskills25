from uuid import UUID

import requests


from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from starlette import status

from api.shemas.components import ComponentsCreateModel
from api.shemas.presentation import PresentationCreateModel, PresentationDataModel, PresentationUpdateModel
from api.shemas.slide import SlideCreateModel
from core.config import settings
from services.db_service import DBManager, get_db_manager
from services.jwt import jwt_auth, JwtTokenT

router = APIRouter()


@router.post(
    "/generate",
    status_code=status.HTTP_201_CREATED,
)
async def generate_presentation(
    payload: PresentationCreateModel,
    # user: UserModel = Depends(get_current_user),
    db_manager: DBManager = Depends(get_db_manager),
    access_token: JwtTokenT = Depends(jwt_auth.validate_token),
):
    user_id = access_token['user_id']
    try:
        response = requests.post(
            f"{settings.ML_SERVICE_URL}/main/",
            json={'topic': payload.theme, 'description': payload.description}
        )
        response.raise_for_status()
        presentation = PresentationDataModel(user_id=user_id, name=payload.theme, slides=[])
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
    except requests.exceptions.ConnectionError:
        return JSONResponse({'error': 'ML service not avaliable'}, status.HTTP_424_FAILED_DEPENDENCY)
    except requests.exceptions.HTTPError as error:
        return JSONResponse({'error': f'bad connection: {error}'}, status.HTTP_424_FAILED_DEPENDENCY)
    except Exception as error:
        return JSONResponse({'error': f'error: {error}'}, status.HTTP_400_BAD_REQUEST)


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_presentation(
    presentation_id: UUID = Query(None),
    # user: UserModel = Depends(get_current_user),
    db_manager: DBManager = Depends(get_db_manager),
    access_token: JwtTokenT = Depends(jwt_auth.validate_token),
):
    user_id = access_token['user_id']
    try:
        return await db_manager.delete_presentation(presentation_id, user_id)
    except Exception as error:
        return JSONResponse({'error': f'error: {error}'}, status.HTTP_400_BAD_REQUEST)


@router.get(
    "/all",
)
async def get_user_presentations(
    # user: UserModel = Depends(get_current_user),
    db_manager: DBManager = Depends(get_db_manager),
    access_token: JwtTokenT = Depends(jwt_auth.validate_token),
):
    user_id = access_token['user_id']
    try:
        return await db_manager.get_presentations(user_id)
    except Exception as error:
        return JSONResponse({'error': f'error: {error}'}, status.HTTP_400_BAD_REQUEST)


@router.get(
    "",
)
async def get_presentation(
    # user: UserModel = Depends(get_current_user),
    presentation_id: str = Query(None),
    db_manager: DBManager = Depends(get_db_manager),
    access_token: JwtTokenT = Depends(jwt_auth.validate_token),
):
    user_id = access_token['user_id']
    try:
        return await db_manager.get_presentation(user_id, presentation_id)
    except Exception as error:
        return JSONResponse({'error': f'error: {error}'}, status.HTTP_400_BAD_REQUEST)


@router.put(
    "",
)
async def update_presentation(
    # user: UserModel = Depends(get_current_user),
    payload: PresentationUpdateModel,
    db_manager: DBManager = Depends(get_db_manager),
    access_token: JwtTokenT = Depends(jwt_auth.validate_token),
):
    user_id = access_token['user_id']
    try:
        payload.user_id = user_id
        return await db_manager.update_presentation(payload)
    except Exception as error:
        return JSONResponse({'error': f'error: {error}'}, status.HTTP_400_BAD_REQUEST)