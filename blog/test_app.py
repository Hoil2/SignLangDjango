# -*- coding: utf-8 -*-
from django.contrib.staticfiles.storage import staticfiles_storage
import tensorflow as tf
import numpy as np
import cv2
import mediapipe as mp

def rgb2gray(rgb):
    return np.dot(rgb[...,:3], [0.2989, 0.5870, 0.1140])

def normaliz_data(np_data, size):
    scaled_images  = np_data.reshape(-1, 30, size, size, 1)
    return scaled_images

class Conv3DModel(tf.keras.Model):
    def __init__(self):
        super(Conv3DModel, self).__init__()
        # Convolutions
        self.conv1 = tf.compat.v2.keras.layers.Conv3D(32, (3, 3, 3), activation='relu', name="conv1", data_format='channels_last')
        self.pool1 = tf.keras.layers.MaxPool3D(pool_size=(2, 2, 2), data_format='channels_last')
        self.conv2 = tf.compat.v2.keras.layers.Conv3D(64, (3, 3, 3), activation='relu', name="conv1", data_format='channels_last')
        self.pool2 = tf.keras.layers.MaxPool3D(pool_size=(2, 2,2), data_format='channels_last')

        self.convLSTM =tf.keras.layers.ConvLSTM2D(40, (3, 3))
        self.flatten =  tf.keras.layers.Flatten(name="flatten")

        # Dense layers
        self.d1 = tf.keras.layers.Dense(128, activation='relu', name="d1")
        self.out = tf.keras.layers.Dense(4, activation='softmax', name="output")
    
    def call(self, x):
        x = self.conv1(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.pool2(x)
        x = self.convLSTM(x)
        x = self.flatten(x)
        x = self.d1(x)
        return self.out(x)

#예측 단어
classes = [
    "왼쪽", "오른쪽", "화장실", "오늘"
    ]

width = 1280
height = 720

#모델 만들기
class myModel():
    def __init__(self):
        print("초기화")
        self.new_model = Conv3DModel()
        self.new_model.compile(loss='sparse_categorical_crossentropy',
                        optimizer=tf.keras.optimizers.RMSprop())
        modelURL = staticfiles_storage.path('model/model_128_landmark')
        self.new_model.load_weights(modelURL)

        self.mpHands = mp.solutions.hands
        self.mpDraw = mp.solutions.drawing_utils

        self.to_predict = []
        self.thickness = 10
        self.size = 128

    def predictImages(self, frame):
        self.classe =''
        try:
            '''
            # 검은색 바탕 이미지 생성
            black = np.zeros(frame.shape, np.uint8)
        
            imgRGB = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(imgRGB)
            #손을 인식하면 처리 되는 코드

            cnt = 0
            posList = []
            if results.multi_hand_landmarks:
                for handLandmarks in results.multi_hand_landmarks:
                    #ID에 따라 관절부위에 원의 크기, 색상을 지정할 수 있음
                    posList.append([0 for i in range(21)])
                    for id, lm in enumerate(handLandmarks.landmark): # 관절 마다 반복
                        h, w, c = frame.shape
                        cx, cy = int(lm.x * w), int(lm.y * h)
                        posList[cnt][id] = (cx, cy)

                        #cv2.circle(black, (cx, cy), thickness, (255,255,255), cv2.FILLED)
                    
                    #인식된 손에 점과 선을 그려 넣음
                    self.mpDraw.draw_landmarks(black, handLandmarks)
                    cnt += 1
            
            for i in range(len(posList)):
                    cv2.line(black, posList[i][0], posList[i][1], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][0], posList[i][5], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][0], posList[i][17], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][1], posList[i][2], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][2], posList[i][3], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][3], posList[i][4], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][5], posList[i][6], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][6], posList[i][7], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][7], posList[i][8], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][5], posList[i][9], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][9], posList[i][10], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][10], posList[i][11], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][11], posList[i][12], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][9], posList[i][13], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][13], posList[i][14], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][14], posList[i][15], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][15], posList[i][16], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][13], posList[i][17], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][17], posList[i][18], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][18], posList[i][19], (255,255,255), self.thickness)
                    cv2.line(black, posList[i][19], posList[i][20], (255,255,255), self.thickness)
            '''
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            #gray = rgb2gray(black);
            self.to_predict.append(cv2.resize(gray, (self.size, self.size)))
            
            if len(self.to_predict) == 30:
                frame_to_predict = np.array(self.to_predict, dtype=np.float32)
                frame_to_predict = normaliz_data(frame_to_predict, self.size)
                #print(frame_to_predict)
                
                predict = self.new_model.predict(frame_to_predict)
                self.classe = classes[np.argmax(predict)]
                
                #print('Classe = ',classe, 'Precision = ', np.amax(predict)*100,'%')
                self.to_predict = []
                return self.classe
                #sleep(0.1) # Time in seconds
            return None
        except Exception as e:
            print('predictImages error', e)
            pass

def cXY(pos):
    return (int(pos['x']*width), int(pos['y']*height))

def makeLandmarkImage(posList):
    thickness = 10
    shape = (h, w, channels) = (height, width, 3)
    black = np.zeros(shape, np.uint8)
    for i in range(len(posList)):
        cv2.line(black, cXY(posList[i][0]), cXY(posList[i][1]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][0]), cXY(posList[i][5]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][0]), cXY(posList[i][17]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][1]), cXY(posList[i][2]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][2]), cXY(posList[i][3]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][3]), cXY(posList[i][4]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][5]), cXY(posList[i][6]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][6]), cXY(posList[i][7]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][7]), cXY(posList[i][8]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][5]), cXY(posList[i][9]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][9]), cXY(posList[i][10]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][10]), cXY(posList[i][11]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][11]), cXY(posList[i][12]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][9]), cXY(posList[i][13]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][13]), cXY(posList[i][14]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][14]), cXY(posList[i][15]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][15]), cXY(posList[i][16]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][13]), cXY(posList[i][17]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][17]), cXY(posList[i][18]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][18]), cXY(posList[i][19]), (255,255,255), thickness)
        cv2.line(black, cXY(posList[i][19]), cXY(posList[i][20]), (255,255,255), thickness)
    return black

