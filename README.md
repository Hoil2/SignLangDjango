# django 수어 번역기 서버

## 실행 방법
1. cd 명령어로 SignLangDjango로 이동

2. 가상 환경 구성  
$ C:\Python37\python -m venv myvenv  
(C:\Python37은 python이 설치된 경로임)

3. 가상 환경 실행  
$ myvenv\Scripts\activate

4. pip 최신 버전 업데이트  
$ python -m pip install --upgrade pip

5. 필요한 패키지 설치  
$ pip install django~=2.0.0  
$ pip install mediapipe  
$ pip install tensorflow  
$ pip install opencv-python  
$ pip install django-ipware  

6. 서버 실행  
$ python manage.py runserver

7. 브라우저로 127.0.0.1:8000 접속

만약 로컬에서 실행 중에 오류가 발생한다면  
settings.py에서 DEBUG가 False인지 확인  
로컬에서는 DEBUG가 True여야 실행 가능

## Googld MediaPipe
![image](https://user-images.githubusercontent.com/71717840/204175327-a1621341-9eb4-4f30-8c47-fc56b81b7fdf.png) <br>
Googld MediaPipe를 사용한 손의 뼈대 추출

## 프레임 추출
![image](https://user-images.githubusercontent.com/71717840/204175373-2d8c8e4c-a77f-4607-8c85-51caecfc1a68.png) <br>

## 테스트
![image](https://user-images.githubusercontent.com/71717840/204175410-fc33b9e9-3f8b-4488-a0da-5a87bae67e3f.png) <br>

## 동작 화면
![1639330471474](https://user-images.githubusercontent.com/71717840/206896238-834f50a0-c7b7-470e-a1e0-777bf4d3d471.jpg)
![1639330471517](https://user-images.githubusercontent.com/71717840/206896240-d373c793-d8c8-437c-b801-47eb039dd694.jpg)

## 인식 동작

![idle](https://user-images.githubusercontent.com/71717840/203706121-ecd93ab8-c792-4407-bf32-dba22e037d88.gif) <br>
<b>가만히 있는 모션</b> <br><br>


![office](https://user-images.githubusercontent.com/71717840/203706350-6a36aee0-e384-4954-b33e-d4b41c641e60.gif) <br>
<b>사무실</b> <br><br>

![ezgif com-gif-maker](https://user-images.githubusercontent.com/71717840/203706485-8eb50c0c-3af6-463a-b2e8-47b4503bc1df.gif) <br>
<b>융소과</b> <br><br>

![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/71717840/203706939-3fe5b284-88a3-4551-87a9-40733198957d.gif)
<br>
<b>효행관</b> <br><br>

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/71717840/203706739-5c800c20-0286-43e8-b8c5-d066f6c61b61.gif)<br>
<b>정보</b> <br><br>

![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/71717840/203706966-0020ccf2-c351-4375-992c-bb3321b6f75f.gif)<br>
<b>위치</b><br><br>
