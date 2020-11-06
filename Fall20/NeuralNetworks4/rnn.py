import numpy as np
import tensorflow as tf
from tensorflow import keras
# from tensorflow.keras import layers
# TODO: error : ValueError: Error when checking input: expected embedding_1_input to have 2 dimensions, but got array with shape (196024, 40, 55)
# from keras.optimizers import RMSprop

with open('1984.txt', 'r') as file:
    text = file.read().lower()
print('text length', len(text))
chars = sorted(list(set(text))) # getting all unique chars
print('total chars: ', len(chars))
char_indices = dict((c, i) for i, c in enumerate(chars))
indices_char = dict((i, c) for i, c in enumerate(chars))

maxlen = 40
step = 3
sentences = []
next_chars = []
for i in range(0, len(text) - maxlen, step):
    sentences.append(text[i: i + maxlen])
    next_chars.append(text[i + maxlen])
x = np.zeros((len(sentences), maxlen, len(chars)), dtype=np.bool)
y = np.zeros((len(sentences), len(chars)), dtype=np.bool)
for i, sentence in enumerate(sentences):
    for t, char in enumerate(sentence):
        x[i, t, char_indices[char]] = 1
    y[i, char_indices[next_chars[i]]] = 1

model = keras.Sequential()
# Add an Embedding layer expecting input vocab of size 1000, and
# output embedding dimension of size 64.
model.add(keras.layers.Embedding(input_dim=1000, output_dim=64))

# Add a RNN layer with 128 internal units.
model.add(keras.layers.SimpleRNN(128))

# Add a Dense layer with 10 units.
model.add(keras.layers.Dense(10))

model.summary()

# predict some text 

optimizer = keras.optimizers.RMSprop(lr=0.01)
model.compile(loss='categorical_crossentropy', optimizer=optimizer)


model.fit(x, y, batch_size=128, epochs=5)
