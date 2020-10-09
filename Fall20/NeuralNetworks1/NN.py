import numpy as np

def linear_activation(z):
    return z

def parametric_activation(a,z):
    if z<=0:
        return a*z
    else:
        return z

def tanh_activation(z):
    return np.tanh(z)
    
# 2 layer NN for implementation of OR gate
def orgate(x):
    weights = np.array([2,2])
    bias = -1
    weighted_input = np.matmul(weights,x) + bias
    y = linear_activation(weighted_input)
    return y

x = np.array([0,0])
print(orgate(x))

# 4 layer NN for computing whether absolute difference is between 1 and 3
# if between 1 and 3 outputs >0 else output <=0
def multilayer(x):
    w1 = np.array([1,-1])
    b1 = 0
    weighted_input1 = np.matmul(w1,x) + b1
    output1 = parametric_activation(-1,weighted_input1)
    w2 = np.array([1])
    b2 = -2
    weighted_input2 = np.matmul(w2,[output1]) + b2
    output2 = parametric_activation(-1,weighted_input2)
    w3 = np.array([-1])
    b3 = 1
    weighted_input3 = np.matmul(w3,[output2]) + b3
    y = tanh_activation(weighted_input3)
    return y

x = np.array([4,5.5])
print(multilayer(x))
