
from django.urls import path
from .views import spotify_auth, spotify_callback, play, pause, skip, previous, restart, shuffle, get_playlists, currently_playing, play_playlist, set_volume, get_playback_state

urlpatterns = [
    path('spotify-auth/', spotify_auth),
    path('spotify-callback/', spotify_callback),
    path('play/', play),
    path('pause/', pause),
    path('skip/', skip),
    path('previous/', previous),
    path('restart/', restart),
    path('shuffle/', shuffle),
    path('playlists/', get_playlists),
    path('currently-playing/', currently_playing),
    path('play/playlist/<str:playlist_id>/', play_playlist),
    path('volume/', set_volume),
    path('playback-state/', get_playback_state),
]
