import numpy as np

def activation(z):
    return z

def parametric_activation(a,z):
    if z<=0:
        return a*z
    else:
        return z

def tanh_activation(z):
    return np.tanh(z)

# Simple 2 layer neural network that returns the average of a 3 numbers given as a 3x1 column vector
# this function does a "forward pass" of the input x through the 2 layer network and returns the results
def average_nn(x):
    weights = np.array(
        [1/3, 1/3, 1/3] # a weights matrix of size 1 x 3
    )
    bias = 0

    # we perform wx + b, using np.matmul to multiply matrices w and x
    weighted_input = np.matmul(weights, x) + bias
    y = activation(weighted_input)
    return y

x = np.array([2, 3, 4]) # a column vector of size 3 x 1
print("The average of {} is {}".format(x, average_nn(x)))


# seed our random number generator for reproducibility
np.random.seed(0)

w_2 = np.random.rand(10, 3) - 0.5 # 10 x 3 matrix
b_2 = np.random.rand() - 0.5
w_3 = np.random.rand(2, 10) - 0.5 # 2 x 10 matrix
b_3 = np.random.rand() - 0.5

def random_nn_activation(z):
    # try defining different activations here given weighted input z, they will impact the results of our neural network
    # the one given here is Relu - Rectified Linear Unit. See if you can understand what res[res < 0] = 0 means!
    res = z.copy()
    res[res < 0] = 0
    return res

# this is a random neural network with slightly more layers and does the same thing, performs a forward pass of x through the network
# Architecturally, the network has 3 layers of sizes 3, 10, 2.
# see if you can understand whats happening with the matrix multiplications and why our architecture is 3, 10, 2!
def random_nn(x):
    # typically, z represents our "weighted" input to the next layers, a is our activation
    a_1 = x

    z_2 = np.matmul(w_2, a_1) + b_2
    a_2 = random_nn_activation(z_2)

    z_3 = np.matmul(w_3, a_2) + b_3
    a_3 = random_nn_activation(z_3)

    return a_3

# print("On 3 layer network, input {} fed forward gives {}".format(x, random_nn(x)))

# 4 layer NN for computing whether absolute difference is between 1 and 3
# if between 1 and 3 outputs >0 else output <=0
def multilayer(x):

    # layer 2
    w1 = np.array([1,-1])
    b1 = 0
    weighted_input1 = np.matmul(w1,x) + b1

    # output of layer 2
    output2 = parametric_activation(-1, weighted_input1)

    # layer 3
    w2 = np.array([1])
    b2 = -2
    weighted_input2 = np.matmul(w2, [output2]) + b2

    # output of layer 3
    output3 = parametric_activation(-1, weighted_input2)

    # final layer!
    w3 = np.array([-1])
    b3 = 1
    weighted_input3 = np.matmul(w3, [output3]) + b3
    y = tanh_activation(weighted_input3)
    return y

x = np.array([4,5.5])
# print(multilayer(x))
