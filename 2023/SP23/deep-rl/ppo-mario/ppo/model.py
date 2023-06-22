import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions.categorical import Categorical
import numpy as np


class PPOActor(nn.Module):
    def __init__(self, act_n, obs_shape, lr, embed=512, scheduler_gamma=None):
        super(PPOActor, self).__init__()

        # get device and send to it
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # ------------------------------------------------------
        # define layers

        self.conv = nn.Sequential(
            nn.Conv2d(obs_shape[0], 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
        )

        self.out = nn.Sequential(
            nn.Linear(self._get_conv_out(obs_shape), embed),
            nn.ReLU(),
            nn.Linear(embed, act_n),
            nn.Softmax(dim=-1)
        )

        # -------------------------------------------------------

        # keep optimizer internal since we're keeping the
        # actor and critic separate
        self.optimizer = optim.Adam(self.parameters(), lr=lr)

        # optionally make scheduler
        if scheduler_gamma != None:
            self.scheduler = optim.lr_scheduler.LinearLR(self.optimizer, start_factor=1.0, end_factor=scheduler_gamma, total_iters=8000)

    def _get_conv_out(self, obs_shape):
        o = self.conv(torch.zeros(1, *obs_shape))
        return int(np.prod(o.size()))

    def forward(self, x):
        num_batches = x.size(0)

        x = self.conv(x)
        x = x.view(num_batches, -1)
        x = self.out(x)
        x = Categorical(x)

        return x

class PPOCritic(nn.Module):
    def __init__(self, obs_shape, lr, embed=512, scheduler_gamma=None):
        super(PPOCritic, self).__init__()

        # get device and send to it
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # ------------------------------------------------------
        # define layers

        self.conv = nn.Sequential(
            nn.Conv2d(obs_shape[0], 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
            nn.Conv2d(32, 32, 3, stride=2, padding=1),
        )

        self.out = nn.Sequential(
            nn.Linear(self._get_conv_out(obs_shape), embed),
            nn.Tanh(),
            nn.Linear(embed, 1),
        )

        # ------------------------------------------------------

        # keep optimizer internal since we're keeping the
        # actor and critic separate
        self.optimizer = optim.Adam(self.parameters(), lr=lr)

        # optionally make scheduler
        if scheduler_gamma != None:
            self.scheduler = optim.lr_scheduler.LinearLR(self.optimizer, start_factor=1.0, end_factor=scheduler_gamma, total_iters=8000)

    def _get_conv_out(self, obs_shape):
        o = self.conv(torch.zeros(1, *obs_shape))
        return int(np.prod(o.size()))

    def forward(self, x):
        num_batches = x.size(0)

        x = self.conv(x)
        x = x.view(num_batches, -1)
        x = self.out(x)

        return x
