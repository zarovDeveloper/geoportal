from fastapi import APIRouter

from src.geoportal.modules.health.api.v1.schemas import HealthCheckResponse

router = APIRouter(
    prefix='/health',
    tags=['Health'],
)


@router.get(
    '',
    response_model=HealthCheckResponse,
    summary='Perform a Health Check',
    description='Responds with the current operational status of the API.',
    tags=['Health'],
)
async def health_check():
    """
    Endpoint to check the health of the API.
    """
    return HealthCheckResponse(status='healthy')
