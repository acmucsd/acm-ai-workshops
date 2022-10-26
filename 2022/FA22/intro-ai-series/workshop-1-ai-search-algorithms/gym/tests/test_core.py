from typing import Optional

import numpy as np
import pytest

from gym import core, spaces
from gym.wrappers import OrderEnforcing, TimeLimit


class ArgumentEnv(core.Env):
    observation_space = spaces.Box(low=0, high=1, shape=(1,))
    action_space = spaces.Box(low=0, high=1, shape=(1,))
    calls = 0

    def __init__(self, arg):
        self.calls += 1
        self.arg = arg


class UnittestEnv(core.Env):
    observation_space = spaces.Box(low=0, high=255, shape=(64, 64, 3), dtype=np.uint8)
    action_space = spaces.Discrete(3)

    def reset(self, *, seed: Optional[int] = None, options: Optional[dict] = None):
        super().reset(seed=seed)
        return self.observation_space.sample(), {"info": "dummy"}

    def step(self, action):
        observation = self.observation_space.sample()  # Dummy observation
        return (observation, 0.0, False, {})


class UnknownSpacesEnv(core.Env):
    """This environment defines its observation & action spaces only
    after the first call to reset. Although this pattern is sometimes
    necessary when implementing a new environment (e.g. if it depends
    on external resources), it is not encouraged.
    """

    def reset(self, *, seed: Optional[int] = None, options: Optional[dict] = None):
        super().reset(seed=seed)
        self.observation_space = spaces.Box(
            low=0, high=255, shape=(64, 64, 3), dtype=np.uint8
        )
        self.action_space = spaces.Discrete(3)
        return self.observation_space.sample(), {}  # Dummy observation with info

    def step(self, action):
        observation = self.observation_space.sample()  # Dummy observation
        return (observation, 0.0, False, {})


class OldStyleEnv(core.Env):
    """This environment doesn't accept any arguments in reset, ideally we want to support this too (for now)"""

    def __init__(self):
        pass

    def reset(self):
        super().reset()
        return 0

    def step(self, action):
        return 0, 0, False, {}


class NewPropertyWrapper(core.Wrapper):
    def __init__(
        self,
        env,
        observation_space=None,
        action_space=None,
        reward_range=None,
        metadata=None,
    ):
        super().__init__(env)
        if observation_space is not None:
            # Only set the observation space if not None to test property forwarding
            self.observation_space = observation_space
        if action_space is not None:
            self.action_space = action_space
        if reward_range is not None:
            self.reward_range = reward_range
        if metadata is not None:
            self.metadata = metadata


def test_env_instantiation():
    # This looks like a pretty trivial, but given our usage of
    # __new__, it's worth having.
    env = ArgumentEnv("arg")
    assert env.arg == "arg"
    assert env.calls == 1


properties = [
    {
        "observation_space": spaces.Box(
            low=0.0, high=1.0, shape=(64, 64, 3), dtype=np.float32
        )
    },
    {"action_space": spaces.Discrete(2)},
    {"reward_range": (-1.0, 1.0)},
    {"metadata": {"render_modes": ["human", "rgb_array_list"]}},
    {
        "observation_space": spaces.Box(
            low=0.0, high=1.0, shape=(64, 64, 3), dtype=np.float32
        ),
        "action_space": spaces.Discrete(2),
    },
]


@pytest.mark.parametrize("class_", [UnittestEnv, UnknownSpacesEnv])
@pytest.mark.parametrize("props", properties)
def test_wrapper_property_forwarding(class_, props):
    env = class_()
    env = NewPropertyWrapper(env, **props)

    # If UnknownSpacesEnv, then call reset to define the spaces
    if isinstance(env.unwrapped, UnknownSpacesEnv):
        _ = env.reset()

    # Test the properties set by the wrapper
    for key, value in props.items():
        assert getattr(env, key) == value

    # Otherwise, test if the properties are forwarded
    all_properties = {"observation_space", "action_space", "reward_range", "metadata"}
    for key in all_properties - props.keys():
        assert getattr(env, key) == getattr(env.unwrapped, key)


def test_compatibility_with_old_style_env():
    env = OldStyleEnv()
    env = OrderEnforcing(env)
    env = TimeLimit(env)
    obs = env.reset()
    assert obs == 0
