import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

def get_spotify_access_token():
    with open('refresh_token.txt', 'r') as file:
        refresh_token = file.read()

    client_id = 'your_spotify_client_id'
    client_secret = 'your_spotify_client_secret'

    # Log the client_id and client_secret for debugging purposes
    logger.debug(f"Client ID: {client_id}")
    logger.debug(f"Client Secret: {client_secret}")

    url = 'https://accounts.spotify.com/api/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': client_id,
        'client_secret': client_secret
    }

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()

    if response.status_code != 200 or 'access_token' not in response_data:
        logger.error(f"Error refreshing token: {response.status_code} {response.text}")
        raise Exception('Could not refresh Spotify access token')

    if 'refresh_token' in response_data:
        with open('refresh_token.txt', 'w') as file:
            file.write(response_data['refresh_token'])

    return response_data['access_token']

def spotify_api_request(method, url, headers=None, params=None, data=None):
    response = requests.request(
        method=method,
        url=url,
        headers=headers,
        params=params,
        data=data
    )
    return response