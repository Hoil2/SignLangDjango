from django.shortcuts import render
#from django.views.decorators import gzip
#from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
#from django.http import HttpResponse

import cv2
#import os
import base64
import json
import numpy as np
from .test_app import * #.을 붙여야 함

model = myModel()

def post_list(request):
    return render(request, 'blog/post_list.html', {})

@csrf_exempt
def ajax(request):
    #data = request.POST.get('img', None)
    if request.method == 'POST':
        json_data = json.loads(request.body)
        #print(json_data[0][0]['x'])
        img = makeLandmarkImage(json_data)
        #img = readb64(data)
        word = model.predictImages(img)
        if word == None:
            word = ''
        
    content = { 'word': word } 
    
    #return HttpResponse(json.dumps(content), content_type="application/json")
    return JsonResponse(content)

def readb64(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img