from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
import math
import numpy as np
import random
import matplotlib.pyplot as plt

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
def selectPoints(number, angle=90):
        angleList = []
        sinList = []
        options = [angle+90,angle+180,angle+270,angle-90,angle-180,angle-270]
        while(number>0):
            angle = random.choice(options)
            radangle = angle * math.pi / 180 # convert to radians
            angleList.append([radangle])
            sinList.append([math.sin(radangle)])
            number = number -1
        return angleList, sinList



# generate training data
angles = (-360,360) # represents full system dynamics
#angles = (0,90) # doesn't represent full system dynamics

angleList, sinList = randomPoints(10000, angles) # good number of points and random points
#angleList, sinList = randomPoints(100, angles) # sparse points and random points
#angleList, sinList = selectPoints(10000) # good number of points but not representative points



# neural network code
model = models.Sequential()
model.add(layers.Dense(10, activation='tanh', input_shape=(1,)))
model.add(layers.Dense(1, activation=None))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])

history = model.fit(np.array(angleList),np.array(sinList), epochs=200)

# plots out learning curve
# plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
# plt.xlabel('Epoch')
# plt.ylabel('MSE')
# plt.ylim([0.0, 0.2])
# plt.legend(loc='lower right')
# plt.show()

# generate test data
angleTest, sinTest = randomPoints(10)
print(model.predict(np.array(angleTest)))
print(sinTest)


# graph of the test, train points
graph = plt.figure()
ax = graph.add_subplot(111)

x = np.linspace(-math.pi*2,math.pi*2,300)
y = np.sin(x)

plt.plot(x,y, label= 'y = sin(x)', markersize = 2, c='c')
ax.scatter(angleList,sinList, label = 'training', c='b')
ax.scatter(angleTest,model.predict(np.array(angleTest)), label = 'testing', c='r')
plt.legend(loc='lower right')
plt.show()
