import numpy as np

def linear_activation(z):
    return z


def tanh_activation(z):
    return np.tanh(z)


def averageOf3(input1, input2, input3):
    w1 = 1.0 / 3.0
    w2 = 1.0 / 3.0
    w3 = 1.0 / 3.0
    bias = 0
    z = input1 * w1 + input2 * w2 + input3 * w3 + bias
    y = linear_activation(z)
    return y


# 2 layer NN for implementation of OR gate
def orgate(input1, input2):
    bias = -1
    weighted_input = 2*input1 + 2*input2 + bias
    y = linear_activation(weighted_input)
    if y<0:
        return False
    else:
        return True

def boolToBinary(bool1,bool2):
    binary = []
    if bool1:
        binary.append(1)
    else:
        binary.append(0)
    if bool2:
        binary.append(1)
    else:
        binary.append(0)
    return binary[0], binary[1]

input1, input2 = boolToBinary(True,True)
print(orgate(input1,input2))

print(averageOf3(1, 0, 3))