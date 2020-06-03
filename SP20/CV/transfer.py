import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import datasets, models, layers, losses, applications

# load data and preprocess it
(train_images, train_labels), (test_images, test_labels) = datasets.fashion_mnist.load_data()

train_images, test_images = train_images / 255.0, test_images / 255.0

# resize image to 32 x 32 using bicubic interpolation
train_images = train_images.reshape(train_images.shape[0], 28, 28, 1)
train_images = tf.image.resize(train_images,[32,32], method='bicubic')
train_images = tf.image.grayscale_to_rgb(train_images)
plt.imshow(train_images[1])

test_images = test_images.reshape(test_images.shape[0], 28, 28, 1)
test_images = tf.image.resize(test_images,[32,32], method='bicubic')
test_images = tf.image.grayscale_to_rgb(test_images)

# load MobileNetV2
base_model = applications.MobileNetV2(input_shape=(32, 32, 3), include_top=False, weights='imagenet')
base_model.trainable = False

# design of actual NN
model = models.Sequential([base_model])

model.add(layers.Flatten())
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dense(10, activation='softmax'))

# train NN
model.compile(optimizer='adam',
              loss=losses.sparse_categorical_crossentropy,
              metrics=['accuracy'])

# graph the learning process
history = model.fit(train_images, train_labels, epochs=30,
                    validation_data=(test_images, test_labels))

plt.plot(history.history['accuracy'], label='accuracy')
plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.ylim([0.5, 1])
plt.legend(loc='lower right')

test_loss, test_acc = model.evaluate(test_images,  test_labels, verbose=2)

plt.show()


