# -*- coding: utf-8 -*-
"""
Created on Mon May 24 22:39:50 2021

@author: hhhhh
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.mainPage, name='mainPage'),
    path('ts', views.translationPage, name='translationPage'),
    path('ajax', views.ajax, name='ajax'),
    path('init', views.init, name='init'),
]