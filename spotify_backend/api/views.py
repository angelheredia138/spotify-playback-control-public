import os
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .utils import get_spotify_access_token, spotify_api_request
import logging
from django.views.decorators.csrf import csrf_exempt

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_access_token():
    token_url = "https://accounts.spotify.com/api/token"
    try:
        with open('refresh_token.txt', 'r') as f:
            refresh_token = f.read().strip()
    except FileNotFoundError:
        logger.error("Refresh token not found. Please log in again.")
        return None

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET,
    }
    response = requests.post(token_url, data=data)
    logger.debug(f"Token request data: {data}")
    logger.debug(f"Token response: {response.status_code} {response.content}")
    if response.status_code != 200:
        logger.error(f"Failed to retrieve access token: {response.content}")
        return None
    access_token = response.json().get('access_token')
    logger.debug(f"New access token: {access_token}")
    return access_token

@api_view(['GET'])
def spotify_auth(request):
    auth_url = (
        f"https://accounts.spotify.com/authorize"
        f"?client_id={settings.SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={settings.SPOTIFY_REDIRECT_URI}"
        f"&scope=user-modify-playback-state"
    )
    return Response({'auth_url': auth_url})

@api_view(['GET'])
def spotify_callback(request):
    code = request.GET.get('code')
    token_url = "https://accounts.spotify.com/api/token"
    response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.SPOTIFY_REDIRECT_URI,
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET,
    })
    if response.status_code != 200:
        logger.error(f"Error during token exchange: {response.content}")
        return JsonResponse({'error': 'Token exchange failed'}, status=400)

    tokens = response.json()
    access_token = tokens.get('access_token')
    refresh_token = tokens.get('refresh_token')

    # Store the refresh token securely
    with open('refresh_token.txt', 'w') as f:
        f.write(refresh_token)

    logger.debug(f"Received tokens: {tokens}")
    return Response({'access_token': access_token, 'refresh_token': refresh_token})


@api_view(['POST'])
def play(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.put(
        'https://api.spotify.com/v1/me/player/play',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Play command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Play response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)


@api_view(['POST'])
def pause(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.put(
        'https://api.spotify.com/v1/me/player/pause',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Pause command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Pause response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)


@api_view(['POST'])
def skip(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.post(
        'https://api.spotify.com/v1/me/player/next',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Skip command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Skip response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)

@api_view(['POST'])
def set_volume(request):
    access_token = get_spotify_access_token()
    volume_percent = request.data.get('volume_percent')

    if volume_percent is not None:
        response = spotify_api_request(
            'PUT',
            f'https://api.spotify.com/v1/me/player/volume?volume_percent={volume_percent}',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if response.status_code == 204:
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to set volume'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Volume percent not provided'}, status=400)
@api_view(['POST'])
def previous(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.post(
        'https://api.spotify.com/v1/me/player/previous',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Previous command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Previous response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)
@api_view(['POST'])
def restart(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.put(
        'https://api.spotify.com/v1/me/player/seek?position_ms=0',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Restart command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Restart response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)

@api_view(['POST'])
def shuffle(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    state = request.data.get('state')
    response = requests.put(
        f'https://api.spotify.com/v1/me/player/shuffle?state={state}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 204:
        logger.debug("Shuffle command successful.")
        return JsonResponse({'status': 'success'}, status=204)
    else:
        try:
            logger.debug(f"Shuffle response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)
@api_view(['GET'])
def currently_playing(request):
    access_token = get_access_token()
    if not access_token:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

    response = requests.get(
        'https://api.spotify.com/v1/me/player/currently-playing?market=US',  # Add your market here
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 200:
        logger.debug("Currently playing fetched successfully.")
        return JsonResponse(response.json(), status=200)
    else:
        try:
            logger.debug(f"Currently playing response: {response.json()}")
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            logger.error("Failed to decode JSON response.")
            return JsonResponse({'error': 'Failed to decode response'}, status=500)

@api_view(['GET'])
def get_playlists(request):
    try:
        access_token = get_spotify_access_token()
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
        if response.status_code == 200:
            playlists = response.json()
            return Response(playlists)
        else:
            logger.error(f"Error fetching playlists: {response.status_code} {response.text}")
            return Response(status=response.status_code, data=response.json())
    except Exception as e:
        logger.error(f"Exception in get_playlists: {e}")
        return Response(status=500, data={'error': str(e)})

@csrf_exempt
def play_playlist(request, playlist_id):
    access_token = get_spotify_access_token()
    url = f"https://api.spotify.com/v1/me/player/play"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "context_uri": f"spotify:playlist:{playlist_id}"
    }
    response = requests.put(url, headers=headers, json=data)
    return JsonResponse(response.json())
@api_view(['GET'])
def get_playback_state(request):
    access_token = get_spotify_access_token()
    response = spotify_api_request(
        'GET',
        'https://api.spotify.com/v1/me/player',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'status': 'error', 'message': 'Failed to fetch playback state'}, status=response.status_code)