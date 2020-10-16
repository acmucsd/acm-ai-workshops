import numpy as np

def exp(z):
    return np.exp(z)

def quad(x):

    w1 = np.array([-0.44684765, -0.26917627, -0.7605533 ])
    w1 = w1.reshape(3,1)
    b1 = np.array([ 0.10698541,  0.2805672 , -0.18892972])
    weighted_input1 = np.matmul(w1,x) + b1
    output_input1 = exp(weighted_input1)

    w2 = np.array([[ 1.0461438 , -1.924406  , -0.7762741 ],
       [ 0.29478267, -1.7059612 ,  0.07446282],
       [-0.28934586,  0.14313366,  0.10968902]]).T
    b2 = np.array([0.41603222, 3.0573933 , 0.48342553])
    weighted_input2 = np.matmul(w2,output_input1) + b2
    output_input2 = exp(weighted_input2)

    w3 = np.array([[ 0.37474582], [ 2.522935 ], [-0.91867435]])
    w3 = w3.reshape(1,3)
    b3 = np.array([-2.080302])
    weighted_input3 = np.matmul(w3,output_input2) + b3

    return weighted_input3

print(quad([2]))
