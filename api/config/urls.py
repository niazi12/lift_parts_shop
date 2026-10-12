from django.conf import settings
from django.contrib import admin
from django.urls import path

from core.api import api

admin.site.site_header = "Lift Parts Shop"
admin.site.site_title = "Lift Parts Shop"

urlpatterns = [
    path("api/v1/", api.urls),
    path(settings.ADMIN_PATH, admin.site.urls),
]
