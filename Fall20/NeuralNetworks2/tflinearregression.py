import tensorflow as tf
import numpy as np
# backpropogation In Tensorflow of the same neural network using Mean Squared Error instead

# lets generate some data using a function mapping from R^2 -> R^1 (2d coordinates to scalar values)
def generate_data():
    
    # generates 10000 ordered data points from 0 to 1 with a bit of noise using random.uniform
    size = 1000
    def generate_linear_noisy():
        return np.linspace(0, 100, num=size) + np.random.uniform(-0.0005, 0.0005, (size,))
    
    X_train = np.array([generate_linear_noisy(), generate_linear_noisy()]).T
    
    # the function modeled here is F(x, y) -> x / 2 + y / 2
    Y_train = (X_train[:,0] * 0.5 + X_train[:,1] * 0.5).reshape(size, 1)
    return X_train, Y_train

X_train, Y_train = generate_data()

# print(X_train, Y_train)
# See how simple this is using keras :)
# Try adding more layers, changing activation to e.g. 'tanh' or 'relu' or 'sigmoid' and compare results!
# You may notice that "linear" works best and thats obvious because our data is fairly linear
# You can also try changing the data generated
model = tf.keras.Sequential([
    tf.keras.layers.Dense(2, activation='linear'),
    # typically, more neurons, the more capable the network, but be wary of overfitting
    tf.keras.layers.Dense(32, activation='linear'), 
    tf.keras.layers.Dense(1)
])

# we specify we want to use something known as the Adam optimizer to optimize the loss and minimize it
# Adam, like SGD, tries to minimize the loss function. In a future workshop we will explain why Adam runs much 
# faster and has higher accuracy
# the loss we use here is known as Mean Squared Error
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
              loss='mse',
              metrics=['mse'])

# fit the model onto our dataset and run for 1000 epochs
model.fit(X_train, Y_train, epochs=1000)
print(X_train[0])

# lets look at 20 data points and see how we do
for x, y in zip(X_train[0:80:4], Y_train[0:80:4]):
    print("X = {}, Y = {}, Predicted - {}".format(x, y, model.predict([[x[0], x[1]]])))