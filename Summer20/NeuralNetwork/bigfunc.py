from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
import numpy as np
import random
import math
import matplotlib.pyplot as plt

def generatePoints(number, bounds):
    inputList = []
    outputList = []
    while(number>0):
        value = random.uniform(bounds[0],bounds[1])
        inputList.append([value])
        outputList.append([math.sin(value**2)])
        number = number - 1
    return inputList, outputList

bounds = (-5,5) # represents full system dynamics
inputList, outputList = generatePoints(30000, bounds)

# neural network code
model = models.Sequential()
model.add(layers.Dense(32, activation='tanh', input_shape=(1,)))
model.add(layers.Dense(48, activation='tanh'))
model.add(layers.Dense(1, activation=None))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])

history = model.fit(np.array(inputList),np.array(outputList), epochs=300)
#print(model.get_weights())

# plots out learning curve
plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
plt.xlabel('Epoch')
plt.ylabel('MSE')
plt.ylim([0.0, 0.5])
plt.legend(loc='lower right')
plt.show()


bounds = (-7,7)
# generate test data
inputTest, outputTest = generatePoints(20, bounds)
print(model.predict(np.array(inputTest)))
print(outputTest)

graph = plt.figure()
ax = graph.add_subplot(111)

x = np.linspace(-8,8,500)
y = np.sin(x**2)

plt.plot(x,y, label= 'y = sin(x^2)', markersize = 2, c='c')
ax.scatter(inputList, outputList, label = 'training', c='b')
ax.scatter(inputTest,model.predict(np.array(inputTest)), label = 'testing', c='r')
plt.legend(loc='lower right')
plt.show()
