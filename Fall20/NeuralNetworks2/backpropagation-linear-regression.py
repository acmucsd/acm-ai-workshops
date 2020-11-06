import numpy as np
import tensorflow as tf

# Backprop From Scratch for linear regression

def sigmoid(x):
    return 1.0/(1+np.exp(-x))

# Gradient of loss function: L'(W1, b1, W2, b2).
def L_prime(X, Y, W1, b1, W2, b2):
    """ L'(W,b) function. 
    X:  Feature matrix.    Shape: [n,2].
    Y:  Label vector.      Shape: [n,1].
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
    P = Y*(W2.T.dot(H.T)+b2).T                           # Shape: [n, 1].
#     print(P.shape)
    # Calculate the gradients: dL/dW1, dL/db1, dL/dW2, dL/db2.
    dL_by_dW2 = H.T.dot((P-1)*Y)                            # Shape: [3,1].
    
#     dL_by_db2 =  (P-1).T.dot(Y)                           # Shape: [1,1].
    dL_by_db2 = np.ones((n,1)).T.dot((P-1)*Y)
    
#     print(W2.shape)
    dL_by_dH  = ((P-1)*Y).dot(W2.T)                           # Shape: [n,3].
    dL_by_dW1  = X.T.dot(dL_by_dH*H*(1-H))                   # Shape: [2,3].
#     print(dL_by_dW1.shape)
    dL_by_db1  = (dL_by_dH*H*(1-H)).T.dot(np.ones((n,1)))                        # Shape: [3,1].
#     print(dL_by_db1.shape)
    return dL_by_dW1, dL_by_db1, dL_by_dW2, dL_by_db2

# Loss function
def L(X, Y, W1, b1, W2, b2):
    """ L(W,b) function. 
    X:  Feature matrix.    Shape: [n,2].
    Y:  Label vector.      Shape: [n,1].
    W1: Weight matrix W1.  Shape: [2,3].
    b1: Bias vector b1.    Shape: [3,1].
    W2: Weight matrix W2.  Shape: [3,1].
    b2: Bias vector b2.    Shape: [1,1].
    Return the loss.       Shape: Scalar.
    """
    # Get dimensions.
    n = X.shape[0]
    
    # Calculate feed-forward values.
#     print(X.shape)
    
    H = sigmoid(W1.T.dot(X.T) + b1).T                             # Shape: [n, 3].
#     print(H.shape)
#     print(W2.T.dot(H.T).shape)
    P = sigmoid(Y*(W2.T.dot(H.T)+b2).T)                             # Shape: [n, 1].
    
#     print((W2.T.dot(H.T)+b2).shape)
#     print(P.shape)
    # Get the loss.
    L =    -np.sum(np.log(P))                        # Shape: Scalar.
    
    return L

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


# gradient descent
# supposed to find where loss is minimized

learning_rate = 0.0001
n_iter = 20000                        # Number of iterations
np.random.seed(0)
W1 = np.random.randn(2,3)/((2*3)**2)   # Weight matrix 1.
b1 = np.random.randn(3,1)/((3*1)**2)   # Bias vector 1.
W2 = np.random.randn(3,1)/((3*1)**2)   # Weight matrix 2.
b2 = np.random.randn(1,1)/((1*1)**2)   # Bias vector 2.

# We will keep track of training loss over iterations.
iterations = [0]
L_list = [L(X_train, Y_train, W1, b1, W2, b2)]

for i in range(n_iter):
    
    # gradient descent 
    
    gradient_W1, gradient_b1, gradient_W2, gradient_b2 = L_prime(X_train, Y_train, W1, b1, W2, b2)
    
    W1_new = W1 - learning_rate * gradient_W1
    b1_new = b1 - learning_rate * gradient_b1
    W2_new = W2 - learning_rate * gradient_W2
    b2_new = b2 - learning_rate * gradient_b2
    
    iterations.append(i+1)
    L_list.append(L(X_train, Y_train, W1_new, b1_new, W2_new, b2_new))
    
    # L1-norm of weight/bias changing.
    norm = np.abs(W1_new-W1).sum() + np.abs(b1_new-b1).sum() + np.abs(W2_new-W2).sum() + np.abs(b2_new-b2).sum() 
    
    if i%500 == 0:
        print('i: {:6d} L: {:.3f} norm:{:.6f}'.format(i, L_list[-1], norm))
        
    W1 = W1_new
    b1 = b1_new
    W2 = W2_new
    b2 = b2_new
    
print ('W1 matrix: \n' + str(W1))
print ('b1 vector: \n' + str(b1))
print ('W2 matrix: \n' + str(W2))
print ('b2 vector: \n' + str(b2))


