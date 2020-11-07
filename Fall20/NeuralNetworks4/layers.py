from tensorflow.keras import Model, layers, Input
import numpy as np

temp_im_test = np.random.rand(1,64,64,3)

input_shape_img = (64,64,3)

img_input = Input(shape=input_shape_img)

# convolutional layers with 32 neurons and (3,3) kernel each
conv1_1 = layers.Conv2D(32, (3, 3), activation='relu', padding='same', name='block1_conv1')(img_input)
conv1_2 = layers.Conv2D(32, (3, 3), activation='relu', padding='same', name='block1_conv2')(conv1_1)

# maxpool2D layer with (2,2) filter and stride (2,2)
max1 = layers.MaxPool2D((2, 2), strides=(2, 2), name='block1_max_pool')(img_input)

# avgpool2D layer with (2,2) filter and stride (2,2)
avg1 = layers.AveragePooling2D((2, 2), strides=(2, 2), name='block1_avg_pool')(img_input)

# globalmax layer
globalmax1 = layers.GlobalMaxPool2D()

# flattens input to 1D array
flatten1 = layers.Flatten()(avg1)

# dropout layer modifies input layer so some values become 0
drop1 = layers.Dropout(.2)(flatten1)

# standard dense layer
dense1 = layers.Dense(10)(drop1)

# compiles model with input: img_input and output as output from dense1
model = Model(inputs = img_input, outputs= dense1)
model.compile(optimizer='sgd', loss='mse')

# shows model
model.summary()

# show result on one input
values = model.predict(temp_im_test)
print("shape of input" + str(temp_im_test.shape))
print("shape of output" + str(values.shape))
print(temp_im_test[0])
print(values[0])
