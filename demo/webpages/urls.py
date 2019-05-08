from django.urls import path
from . import views

urlpatterns = [

path('', views.homepage, name='homeN'), #three parameters passed: what is the path, where and what view to point to and name to reference it
path('help/', views.helppage, name='helpN'),
path('contact/', views.contactuspage, name='contactN'),

]
