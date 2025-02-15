from sqlalchemy.orm import configure_mappers

from . import models

__all__ = ["models"]

configure_mappers()
