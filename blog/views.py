from django.shortcuts import render
#from django.views.decorators import gzip
#from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
#from django.http import HttpResponse
from ipware import get_client_ip

import cv2
#import os
import base64
import json
import numpy as np
from .test_app import * #.을 붙여야 함
import datetime
import threading

modelList = {}
ipList = []
lastRun = {}

def mainPage(request):
    return render(request, 'blog/index.html', {})
    
@csrf_exempt
def translationPage(request):
    return render(request, 'blog/ts.html', {})

@csrf_exempt
def init(request):
    if request.method == 'POST':
        ip, is_routable = get_client_ip(request)
        print("초기화")
        if ip is None:
            print('ip 얻을 수 없음')
        else :
            if ip not in ipList:
                ipList.append(ip)
                lastRun[ip] = ''
                modelList[ip] = myModel()
                print("ip 등록 ", ip)

    content = { 'ip':  ip }
    return JsonResponse(content)

@csrf_exempt
def ajax(request):
    #data = request.POST.get('img', None)
    if request.method == 'POST':
        ip, _ = get_client_ip(request)
        #print("마지막 실행 시간: ", lastRun[0])
        
        lastRun[ip] = datetime.datetime.now() #마지막 실행 시간 기록
        

        #print("현재 ip: ", ip)
        #print("ipList index: ",ipList[ip])
        json_data = json.loads(request.body)

        #print(json_data[0][0]['x'])
        img = makeLandmarkImage(json_data)
        #img = readb64(data)
        try:
            word, acc = modelList[ip].predictImages(img)
        except KeyError:
            modelList[ip] = myModel()
            word, acc = modelList[ip].predictImages(img)
            
        if word == None:
            word = ''
            acc = 0
        
    content = { 'word': word,
                'acc': acc } 
    
    #return HttpResponse(json.dumps(content), content_type="application/json")
    return JsonResponse(content)

def readb64(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def removeUserInfo():
    print("유저 정보 삭제 실행")
    for ip in ipList:
        diff = datetime.datetime.now() - lastRun[ip]
        if diff.seconds / 60 > 30:
            print(ip, " 정보 삭제")
            del ipList[ip]
            del modelList[ip]
            del lastRun[ip]
    threading.Timer(600, removeUserInfo).start()

threading.Timer(600, removeUserInfo).start()