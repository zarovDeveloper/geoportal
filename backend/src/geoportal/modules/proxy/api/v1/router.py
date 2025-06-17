import httpx
from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import StreamingResponse

from src.geoportal.config.get_settings import get_settings
from src.geoportal.config.settings import Settings

router = APIRouter(
    prefix='/proxy',
    tags=['Proxy'],
)

client = httpx.AsyncClient()


@router.get('/mapserver/{path:path}')
async def proxy_mapserver_get(
    path: str,
    request: Request,
    settings: Settings = Depends(get_settings),
):
    """
    Proxies GET requests to the MapServer service.
    It captures the full path and query parameters.
    """
    mapserver_base_url = settings.mapserver.URL.rstrip('/')

    target_url = f'{mapserver_base_url}/{path}'
    if request.url.query:
        target_url += f'?{request.url.query}'

    try:
        headers_to_forward = {
            k: v
            for k, v in request.headers.items()
            if k.lower()
            not in [
                'host',
                'connection',
                'user-agent',
                'content-length',
                'content-type',
            ]
        }
        headers_to_forward['user-agent'] = 'GeoportalBackendProxy/1.0'

        mapserver_req = client.build_request(
            method='GET',
            url=target_url,
            headers=headers_to_forward,
        )

        mapserver_resp = await client.send(mapserver_req, stream=True)

        response_headers = {
            k: v
            for k, v in mapserver_resp.headers.items()
            if k.lower()
            not in ['content-length', 'transfer-encoding', 'content-encoding']
        }

        return StreamingResponse(
            mapserver_resp.aiter_bytes(),
            status_code=mapserver_resp.status_code,
            media_type=mapserver_resp.headers.get('Content-Type'),
            headers=response_headers,
        )

    except httpx.RequestError as exc:
        return Response(
            content=f'Error connecting to MapServer: {exc}',
            status_code=502,
            media_type='text/plain',
        )
    except Exception as exc:
        return Response(
            content=f'An unexpected error occurred: {exc}',
            status_code=500,
            media_type='text/plain',
        )
