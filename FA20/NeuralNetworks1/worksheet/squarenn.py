# fill in this neural network and activation function to calculate the square of the sum of 2 inputs
def activation(z):
    raise NotImplementedError

def squareNN(x1, x2):
    # this should be a simple 2 layer network, one input layer and one output layer, figure out how many neurons are in each layer, the weights, and biases!
    # This should take x1 and x2 and return the square of the sum of the 2 inputs, but obviously in neural network style!
    raise NotImplementedError


# Your network works if you don't get any errors!
assert squareNN(1, 1) == 4
assert squareNN(-1, 1) == 0
assert squareNN(10, 2.5) == 156.25
assert squareNN(0, 0) == 0