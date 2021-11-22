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
import pymysql

modelList = {}
ipList = []
lastRun = {}

inputWords = ""
conn = None
cur = None
portNum = 3306

def mainPage(request):
    init()
    return render(request, 'blog/index.html', {})
    
'''
@csrf_exempt
def translationPage(request):
    sql = "select * from info where deptName='융소과'"
    cur.execute(sql)

    row = cur.fetchone()
    #print("학과 : " + row[0] + " 나이 : " + str(row[1]))
    data = {
        'deptName' : row[0],
        'loc' : row[1],
        'num' : row[2],
        'note' : row[3]
    }

    conn.close()    # 접속 종료
    
    return render(request, 'blog/officeInfo.html', data)
'''

def init():
    conn = pymysql.connect(host="127.0.0.1", port=portNum, user="root", password="1234", db="office", charset="utf8")
    cur = conn.cursor()
    '''
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
    '''

@csrf_exempt
def interface(request):
    return render(request, 'blog/interface.html')

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
            
        if word == None or word == '-':
            word = ''
            acc = 0
        else:
            inputWords += word + " "
            startTime = datetime.datetime.now()
        
        #아무것도 입력받지 못한 시간이 2초가 넘어가면 텍스트 초기화
        diff = datetime.datetime.now() - startTime
        if diff.seconds >= 2:
            inputWords = ""

    content = { 'word': inputWords,
                'acc': acc } 
    
    #return HttpResponse(json.dumps(content), content_type="application/json")
    return JsonResponse(content)

@csrf_exempt
def officeInfo(request):
    
    if request.method == 'GET':
        conn = pymysql.connect(host="127.0.0.1", port=portNum, user="root", password="1234", db="office", charset="utf8")
        cur = conn.cursor()
        location = request.GET['location']
        sql = "select loc, num, note from info where deptName="
        if location == 'CS':
            sql += "'융소과'"
        elif location == 'IC':
            sql += "'정통과'"
        elif location == 'Game':
            sql += "'게임과'"
        elif location == 'IT':
            sql += "'IT과'"
        elif location == 'Nur':
            sql += "'간호과'"

        cur.execute(sql)
        row = cur.fetchone() 
        data = {
            'loc':row[0],
            'num':row[1],
            'note':row[2]
        }
        
    return render(request, 'blog/officeInfo.html', data)

@csrf_exempt
def mapPopup(request):
    return render(request, 'blog/mapPopup.html')
# (사용되지 않음)텍스트를 이미지로 변환하는 코드
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

#threading.Timer(600, removeUserInfo).start()