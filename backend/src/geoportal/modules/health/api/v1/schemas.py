from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    """
    Response model for the health check endpoint.
    Indicates the operational status of the service.
    """

    status: str = Field(
        description='The operational status of the API.', examples=['healthy']
    )
