import numpy as np

def exp(z):
    return np.exp(z)

# example quad that works
# 2 hidden layers each with 3 neurons and exponential activation
def quad(x):

    w1 = np.array([-0.42939982, -0.42939982, -0.1561123 ])
    w1 = w1.reshape(3,1)
    b1 = np.array([-0.53511655, -0.53511655,  1.0261397 ])
    weighted_input1 = np.matmul(w1,x) + b1
    output_input1 = exp(weighted_input1)

    w2 = np.array([[[-0.09753932, -0.09753932, -0.34223053],
       [-0.09753932, -0.09753932, -0.34223053],
       [ 0.68423134,  0.68423134, -1.364272  ]]).T
    b2 = np.array(([0.39727366, 0.39727366, 4.1392593 ])
    weighted_input2 = np.matmul(w2,output_input1) + b2
    output_input2 = exp(weighted_input2)

    w3 = np.array([[0.49944505],
       [0.49944505],
       [3.0982096 ])
    w3 = w3.reshape(1,3)
    b3 = np.array([-11.837644])
    weighted_input3 = np.matmul(w3,output_input2) + b3

    return weighted_input3

print(quad([2]))

def L_prime(X, Y, W1, b1, W2, b2):
    """ L'(W,b) function.
    X:  input           Shape: [n,2].

    Y:  expected_output      Shape: [n,1].
    W1: Weight matrix W1.  Shape: [2,3].
    b1: Bias vector b1.    Shape: [3,1].
    W2: Weight matrix W2.  Shape: [3,1].
    b2: Bias vector b2.    Shape: [1,1].
    Return the gradients: dL/dW1 (Shape: [2,3]), dL/db1 (Shape: [3,1]),
                          dL/dW2 (Shape: [3,1]), dL/db2 (Shape: [1,1]).
    """
    # Get dimensions.
    n = X.shape[0]

    # Calculate feed-forward values.
    H = sigmoid(W1.T.dot(X.T) + b1).T                          # Shape: [n, 3].
    P = Y*(W2.T.dot(H.T)+b2).T                          # Shape: [n, 1].

    # Calculate the gradients: dL/dW1, dL/db1, dL/dW2, dL/db2.
    dL_by_dW3 = H.T.dot((P-1)*Y)                            # Shape: [3,1].

#     dL_by_db3 =  (P-1).T.dot(Y)                           # Shape: [1,1].
    dL_by_db3 = np.ones((n,1)).T.dot((P-1)*Y)

    dL_by_dH  = ((P-1)*Y).dot(W2.T)                           # Shape: [n,3].
    dL_by_dW2  = X.T.dot(dL_by_dH*H*(1-H))                   # Shape: [2,3].


    dL_by_db2  = (dL_by_dH*H*(1-H)).T.dot(np.ones((n,1)))                        # Shape: [3,1].

    return dL_by_dW2, dL_by_db2, dL_by_dW3, dL_by_db3

# initial network initialized to all 0
# output: predicted output, parameters
def originalQuad(x):

    w1 = np.array([0, 0, 0])
    w1 = w1.reshape(3,1)
    b1 = np.array([ 0,  0 , 0])
    weighted_input1 = np.matmul(w1,x) + b1
    output_input1 = exp(weighted_input1)

    w2 = np.array([[ 0 , 0  , 0 ],
       [ 0, 0 ,  0],
       [0,  0, 0]]).T
    b2 = np.array([0, 0 , 0])
    weighted_input2 = np.matmul(w2,output_input1) + b2
    output_input2 = exp(weighted_input2)

    w3 = np.array([[ 0], [0], [0]])
    w3 = w3.reshape(1,3)
    b3 = np.array([0])
    weighted_input3 = np.matmul(w3,output_input2) + b3

    return weighted_input3, [w1,b1,w2,b2,w3,b3]

def intermediateQuad(x, params):
    w1 = params[0]
    b1 = params[1]
    weighted_input1 = np.matmul(w1,x) + b1
    output_input1 = exp(weighted_input1)

    w2 = params[2]
    b2 = params[3]
    weighted_input2 = np.matmul(w2,output_input1) + b2
    output_input2 = exp(weighted_input2)

    w3 = params[4]
    b3 = params[5]
    weighted_input3 = np.matmul(w3,output_input2) + b3

    return weighted_input3, [w1,b1,w2,b2,w3,b3]

# TO DO make backprop function that goes through parameters updating them
