import tensorflow as tf
import numpy as np
# backpropogation In Tensorflow of the same neural network using Mean Squared Error instead

# lets generate some data using a function mapping from R^2 -> R^1 (2d coordinates to scalar values)
def generate_data():
    
    # generates 1000 ordered data points from 0 to 1 with a bit of noise using random.uniform
    def generate_linear_noisy():
        return np.linspace(0, 1, num=1000) + np.random.uniform(-0.05, 0.05, (1000,))
    
    X_train = np.array([generate_linear_noisy(), generate_linear_noisy()]).T
    
    # the function modeled here is F(x, y) -> x / 2 + y / 2
    Y_train = (X_train[:,0] * 0.5 + X_train[:,1] * 0.5).reshape(1000, 1)
    return X_train, Y_train

X_train, Y_train = generate_data()


# See how simple this is using keras :)
model = tf.keras.Sequential([
    tf.keras.layers.Dense(2, activation='sigmoid'),
    tf.keras.layers.Dense(3, activation='sigmoid'),
    tf.keras.layers.Dense(1)
])

# we specify we want to use Stochastic Gradient Descent to optimize the loss and minimize it
# the loss we use here is known as Mean Squared Error, basically 1/N * (Y_true - Y_predicted)^2
model.compile(optimizer='SGD',
              loss='mse',
              metrics=['accuracy'])

model.fit(X_train, Y_train, epochs=10)