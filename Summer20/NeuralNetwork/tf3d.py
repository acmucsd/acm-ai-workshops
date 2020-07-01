from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
from mpl_toolkits import mplot3d
import numpy as np
import matplotlib.pyplot as plt
import random

def cone(x,y):
    return np.sqrt(x**2 + y**2)

def ripple(x,y):
    return np.sin(10 * (x**2 + y**2)) / 10

def makeTuple(X,Y):
    inputList = []
    for index, value in enumerate(X):
        for index1, value1 in enumerate(value):
            inputList.append([value1, Y[index][index1]])
    return inputList

def unpackTuple(A):
    X = []
    Y = []
    for item in A:
        X.append([item[0]])
        Y.append([item[1]])
    return X, Y

def makeArray(Z):
    zList = []
    for subList in Z:
        for value in subList:
            zList.append([value])
    return zList

def randomPoints(number, bounds):
    inputList = []
    outputList = []
    while(number > 0):
        value1 = random.uniform(bounds[0],bounds[1])
        value2 = random.uniform(bounds[0],bounds[1])
        inputList.append([value1, value2])
        outputList.append([ripple(value1, value2)])
        number = number -1
    return inputList, outputList

bounds = (-1,1)
inputList, outputList = randomPoints(50000, bounds)
X_Train, Y_Train = unpackTuple(inputList)

model = models.Sequential()
model.add(layers.Dense(32, activation='exponential', input_shape=(2,)))
model.add(layers.Dense(48, activation='tanh'))
model.add(layers.Dense(1, activation=None))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])

history = model.fit(np.array(inputList),np.array(outputList), epochs=300)
#print(model.get_weights())


# plots out learning curve
# plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
# plt.xlabel('Epoch')
# plt.ylabel('MSE')
# plt.ylim([0.0, 0.2])
# plt.legend(loc='lower right')
# plt.show()

# generate test data
inputTest, outputTest = randomPoints(10, bounds)
X_Test, Y_Test = unpackTuple(inputTest)
print(model.predict(np.array(inputTest)))
print(outputTest)

x = np.linspace(-1, 1, 800)
y = np.linspace(-1, 1, 800)

X, Y = np.meshgrid(x, y)
Z = ripple(X, Y)

fig = plt.figure()
ax = plt.axes(projection="3d")

ax.plot_wireframe(X, Y, Z, color='c')
ax.scatter3D(X_Test, Y_Test, model.predict(np.array(inputTest)), c='r')
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('z')

plt.show()
