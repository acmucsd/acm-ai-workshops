import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import numpy as np
import tensorflow as tf
from tensorflow.keras import regularizers
# lets generate some data using a function mapping from R^2 -> R^1 (2d coordinates to scalar values)
def generate_data(size = 1000, range=[-1, 1]):
    
    # generates size many ordered data points from 0 to 1 with a bit of noise using random.uniform
    def generate_linear_noisy():
        return np.linspace(range[0], range[1], num=size) + np.random.uniform(-0.0005, 0.0005, (size,))
    
    X_train = np.array([generate_linear_noisy(), generate_linear_noisy()]).T
    
    # the function modeled here is some complicated: F(x, y) -> sin(x) * cos(y)
    Y_train = (np.sin(X_train[:, 0]) + np.cos(X_train[:, 1])).reshape(size, 1)
    return X_train, Y_train

X_train, Y_train = generate_data(1000, range=[-1, 1])
# our test data set will include an unseen / untrained range to test generalizabiltiy
# this will be simialir to how our NN modelling competition will work
X_test, Y_test = generate_data(250, range=[-3, 3])

def create_model():
    """
    creates our neural network and returns it
    """
    tf.random.set_seed(0)
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(2, activation='relu'),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
        loss='mse',
        metrics=['mse']),
    return model

model = create_model()
print("\n== {} without regularization ==".format("Adam"))
# fit the model onto our dataset and run for 50 epochs
mse = np.mean((model.predict(X_test) - Y_test) ** 2)
print("MSE on Test set before Traning {:0.5f}".format(mse))
model.fit(X_train, Y_train, epochs=50, verbose=0)
mse = np.mean((model.predict(X_test) - Y_test) ** 2)
print("MSE on Test set After Traning {:0.5f}".format(mse))

def create_model_regularized():
    """
    creates our neural network with regularized layers and returns it
    """
    tf.random.set_seed(0)
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(2, activation='relu'),
        tf.keras.layers.Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.1)),
        tf.keras.layers.Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.1)),
        tf.keras.layers.Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.1)),
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
        loss='mse',
        metrics=['mse']),
    return model

# Create our model
model = create_model_regularized()
print("\n== {} with regularization will usually decrease error ==".format("Adam"))
# fit the model onto our dataset and run for 50 epochs
mse = np.mean((model.predict(X_test) - Y_test) ** 2)
print("MSE on Test set before Traning {:0.5f}".format(mse))
model.fit(X_train, Y_train, epochs=50, verbose=0)
mse = np.mean((model.predict(X_test) - Y_test) ** 2)
print("MSE on Test set After Traning {:0.5f}".format(mse))