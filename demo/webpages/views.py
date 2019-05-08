from django.shortcuts import render
import json

# Create your views here.

def homepage(request):
	
	return render(request, "index.html", {"blah" : []})

def helppage(request):
	return render(request, "helppage.html", {})

def contactuspage(request):
	return render(request, "contactus.html", {})