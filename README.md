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

6. 서버 실행  
$ python manage.py runserver

7. 브라우저로 127.0.0.1:8000 접속

만약 로컬에서 실행 중에 오류가 발생한다면  
settings.py에서 DEBUG가 False인지 확인  
로컬에서는 DEBUG가 True여야 실행 가능