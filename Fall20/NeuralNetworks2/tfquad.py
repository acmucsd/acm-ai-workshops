from tensorflow.keras import datasets, models, layers, losses
import tensorflow as tf
import numpy as np
import random
import matplotlib.pyplot as plt

# randomPoints on the sin graph
# number - number of points
# bounds - tuple for range of values
# bool - either 1 or 0
def generatePoints(number, bounds):
    inputList = []
    outputList = []
    while(number>0):
        value = random.uniform(bounds[0],bounds[1])
        inputList.append([value])
        outputList.append([value**2])
        number = number - 1
    return inputList, outputList

# generate training data
bounds = (-3,3) # represents full system dynamics

inputList, outputList = generatePoints(20000, bounds)

# neural network code
model = models.Sequential()
model.add(layers.Dense(3, activation='exponential', input_shape=(1,),kernel_initializer=tf.keras.initializers.Zeros(), bias_initializer=tf.keras.initializers.Zeros()))
model.add(layers.Dense(3, activation='exponential',kernel_initializer=tf.keras.initializers.Zeros(), bias_initializer=tf.keras.initializers.Zeros()))
model.add(layers.Dense(1, activation=None,kernel_initializer=tf.keras.initializers.Zeros(), bias_initializer=tf.keras.initializers.Zeros()))
model.compile(optimizer='Adam',
                loss=losses.MeanSquaredError(),
                metrics=['mean_squared_error'])

history = model.fit(np.array(inputList),np.array(outputList), epochs=2000)
print(model.get_weights())

# plots out learning curve
# plt.plot(history.history['mean_squared_error'], label='mean_squared_error')
# plt.xlabel('Epoch')
# plt.ylabel('MSE')
# plt.ylim([0.0, 0.2])
# plt.legend(loc='lower right')
# plt.show()

bounds = (-3.5,3.5)
# generate test data
inputTest, outputTest = generatePoints(20, bounds)
# print(model.predict(np.array(inputTest)))
# print(outputTest)

# graph of the test, train points
graph = plt.figure()
ax = graph.add_subplot(111)

x = np.linspace(-3.5,3.5,50)
y = x**2

plt.plot(x,y, label= 'y = x^2', markersize = 2, c='c')
ax.scatter(inputList, outputList, label = 'training', c='b')
ax.scatter(inputTest,model.predict(np.array(inputTest)), label = 'testing', c='r')
plt.legend(loc='lower right')
plt.show()
