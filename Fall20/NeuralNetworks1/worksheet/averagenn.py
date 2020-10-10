import numpy as np

# fill in this neural network and activation function to calculate the of average of 5 values using numpy and vectorization
def activation(z):
    raise NotImplementedError

def average5NN(x):
    # this should be a simple 2 layer network, one input layer and one output layer, figure out how many neurons are in each layer, the weights, and biases! 

    # This should take input column vector x and apply an appropriate weight matrix and add a bias, apply the activation and then return the result

    weights = np.array([]) # fill me in!

    bias = 100 # fix me!

    weighted_input = 0 # fill me in!

    raise NotImplementedError


# Your network works if you don't get any errors!
assert average5NN(np.array([1, 1, 1, 1, 1])) == 1
assert average5NN(np.array([1, -1, 1, -1, 0])) == 0
assert average5NN(np.array([100, 200, 300, 400, -400])) == 1.2