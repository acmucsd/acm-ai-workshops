import numpy as np

class PPOExperience():
    def __init__(self, batch_size: int, buffer_size: int = 100):
        self.states = []
        self.actions = []
        self.probs = []
        self.vals = []
        self.rewards = []
        self.dones = []

        self.batch_size = batch_size
        self.buffer_size = buffer_size

    def gen_batches(self):

        # get all possible starting indices of batch size
        # e.g. memlen 20, batch_size 5 => [0, 5, 10, 15]
        batch_starts = np.arange(0, self.buffer_size, self.batch_size)
        
        # shuffle indices so that we get random memories in each batch
        idxs = np.arange(self.buffer_size, dtype=np.int64)
        np.random.shuffle(idxs)

        # collections of indices w/o repeat for each starting value
        batch_idxs = [idxs[start : start + self.batch_size] for start in batch_starts]

        # return batch indices since we'll iterate over these in usage
        return  np.array(self.states), np.array(self.actions), np.array(self.probs), \
                np.array(self.vals), np.array(self.rewards), np.array(self.dones), \
                batch_idxs
    
    def store_memory(self, state, action, prob, val, reward, done):
        
        self.states.append(state)
        self.actions.append(action)
        self.probs.append(prob)
        self.vals.append(val)
        self.rewards.append(reward)
        self.dones.append(done)

    def clear_memory(self):

        self.states = []
        self.actions = []
        self.probs = []
        self.vals = []
        self.rewards = []
        self.dones = []

    def __len__(self):
        return len(self.states)