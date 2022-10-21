from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
import numpy as np
import random
import matplotlib.pyplot as plt

# randomPoints on the sin graph
# number - number of points
# bounds - tuple for range of values
# func - function to be used
def randomPoints(number, bounds, func):
    inputList = []
    outputList = []
    while(number>0):
        value = random.uniform(bounds[0],bounds[1])
        inputList.append([value])
        outputList.append([func(value)])
        number = number - 1
    return inputList, outputList

def boolfunc(x):
    return x*0 + 1

def linear(x):
    return x

def coolLinear(x):
    return 3*x + 1

# generate training data
bounds = (-10,10) # represents full system dynamics

inputList, outputList = randomPoints(10000, bounds, boolfunc)

# neural network code
model = models.Sequential()
model.add(layers.Dense(1, activation='linear', input_shape=(1,)))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])

history = model.fit(np.array(inputList),np.array(outputList), epochs=200)
print(model.get_weights())

# plots out learning curve
# plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
# plt.xlabel('Epoch')
# plt.ylabel('MSE')
# plt.ylim([0.0, 0.2])
# plt.legend(loc='lower right')
# plt.show()

bounds = (-15,15) # represents full system dynamics

# generate test data
inputTest, outputTest = randomPoints(10, bounds, boolfunc)
print(model.predict(np.array(inputTest)))
print(outputTest)

# graph of the test, train points
graph = plt.figure()
ax = graph.add_subplot(111)

x = np.linspace(-10,10,500)
y = boolfunc(x)

plt.plot(x,y, label= 'y = 1', markersize = 2, c='c')
ax.scatter(inputList, outputList, label = 'training', c='b')
ax.scatter(inputTest,model.predict(np.array(inputTest)), label = 'testing', c='r')
plt.legend(loc='lower right')
plt.show()
