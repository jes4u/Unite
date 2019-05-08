#Simple function generationg a random number 
from random import random

def rand():
	if random() < 0.7:
		return "UW rocks!"
	else:
		return "WUSTL rocks!"

print(rand())