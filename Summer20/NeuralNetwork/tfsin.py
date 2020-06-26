from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
import math
import numpy as np
import random
import matplotlib.pyplot as plt

number = 100

# randomPoints on the sin graph
# number - number of points
# angles - tuple for range of angles
def randomPoints(number, angles= (-360,360)):
    angleList = []
    sinList = []
    while(number>0):
        angle = random.uniform(angles[0],angles[1])
        angle = angle * math.pi / 180 # convert to radians
        angleList.append([angle])
        sinList.append([math.sin(angle)])
        number = number -1
    return angleList, sinList

# only specific points on the sin graph
# number - number of points
# angles - target angle
def selectPoints(number, angle=30):
        angleList = []
        sinList = []
        while(number>0):
            radangle = angle * math.pi / 180 # convert to radians
            angleList.append([radangle])
            sinList.append([math.sin(radangle)])
            angleList.append([-radangle])
            sinList.append([math.sin(-radangle)])
            angle = angle + 60
            number = number -1
        return angleList, sinList

angles = (-360,360)
angleList, sinList = randomPoints(10000, angles)
#angleList, sinList = selectPoints(10000)

model = models.Sequential()
model.add(layers.Dense(10, activation='tanh', input_shape=(1,)))
model.add(layers.Dense(1, activation=None))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])
history = model.fit(np.array(angleList),np.array(sinList), epochs=200)
plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
plt.xlabel('Epoch')
plt.ylabel('MSE')
plt.ylim([0.0, 0.2])
plt.legend(loc='lower right')

angleTest, sinTest = randomPoints(10)
print(model.predict(np.array(angleTest)))
print(sinTest)

plt.show()
