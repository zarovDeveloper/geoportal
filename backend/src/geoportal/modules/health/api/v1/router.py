from fastapi import APIRouter
from .schemas import HealthCheckResponse

router = APIRouter()

@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Perform a Health Check",
    description="Responds with the current operational status of the API.",
    tags=["Health"],
)
async def health_check():
    """
    Endpoint to check the health of the API.
    """
    return HealthCheckResponse(status="healthy")
