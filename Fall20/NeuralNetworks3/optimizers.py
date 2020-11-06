import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import numpy as np
import tensorflow as tf

# lets generate some data using a function mapping from R^2 -> R^1 (2d coordinates to scalar values)
def generate_data(size = 1000, range=[0.1, 1.1]):
    
    # generates size many ordered data points from 0 to 1 with a bit of noise using random.uniform
    def generate_linear_noisy():
        return np.linspace(range[0], range[1], num=size) + np.random.uniform(-0.0005, 0.0005, (size,))
    
    X_train = np.array([generate_linear_noisy(), generate_linear_noisy(), generate_linear_noisy()]).T
    
    # the function modeled here is some complicated: F(x, y, z) -> x^2 * y - x^1.5 * z + sqrt(y / x)
    Y_train = (X_train[:,0] * X_train[:, 0] * X_train[:, 1] - X_train[:, 0] ** 1.5 * X_train[:, 2] + np.sqrt(X_train[:,1] / X_train[:, 0])).reshape(size, 1)
    return X_train, Y_train

X_train, Y_train = generate_data(1000)
X_test, Y_test = generate_data(250)

optimizers = [
    tf.keras.optimizers.SGD(learning_rate=0.0005),
    tf.keras.optimizers.Adam(learning_rate=0.0005),
    tf.keras.optimizers.Adadelta(learning_rate=0.0005),
    tf.keras.optimizers.RMSprop(learning_rate=0.0005),
]
optimizer_names = [
    "Stochastic Gradient Descent",
    "Adam",
    "Adadelta",
    "RMSProp"
]


for optimizer, name in zip(optimizers, optimizer_names):
    # set the seed so we can make accurate comparisons between optimizers
    tf.random.set_seed(0)

    # Create our model
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(2, activation='linear'),
        tf.keras.layers.Dense(64, activation='linear'),
        tf.keras.layers.Dense(64, activation='linear'),
        tf.keras.layers.Dense(32, activation='linear'),
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer=optimizer,
        loss='mse',
        metrics=['mse']),
    print("\n== {} ==".format(name))
    # fit the model onto our dataset and run for 50 epochs
    mse = np.mean((model.predict(X_test) - Y_test) ** 2)
    print("MSE on Test set before Traning {:0.5f}".format(mse))
    model.fit(X_train, Y_train, epochs=50, verbose=0)
    mse = np.mean((model.predict(X_test) - Y_test) ** 2)
    print("MSE on Test set After Traning {:0.5f}".format(mse))
