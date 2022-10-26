import gym
from gym.utils.save_video import save_video
from time import sleep
from search import *

'''
Key:
S = Start
F = Frozen
H = Hole
G = Goal
'''

MAPS = {"4x4":["SFFF", "FHFH", "FFFH", "HFFG"],
        "8x8":["SFFFFFFF", "FFFFFFFF", "FFFHFFFF", "FFFFFHFF", 
               "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFG"]}
MAP = "8x8" # can be 8x8 or 4x4

USE_DETERMINISTIC=True # runs a deterministic path which results in Success
TRAJECTORY = {"4x4": [1, 1, 2, 2, 1, 2],
              "8x8": [2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1]}

ACTIONS = {0: "LEFT", 1: "DOWN", 2: "RIGHT", 3: "UP"}
RENDER_MODE="rgb_array_list"


def main():
    env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
    env.action_space.seed(42)
    observation, info = env.reset(seed=42)

    step_starting_index = 0
    episode_index = 0

    if USE_DETERMINISTIC:
        for step, action in enumerate(TRAJECTORY[MAP]):
            observation, reward, terminated, truncated, info = env.step(action) # deterministic action

            print("REWARD:", reward, "| ACTION:", ACTIONS[action])
            sleep(0.01) # for spacing out rendering of frames

            if terminated or truncated:
                save_video(
                    env.render(),
                    "videos",
                    fps=env.metadata["render_fps"],
                    step_starting_index=step_starting_index,
                    episode_index=episode_index,
                    name_prefix=MAP
                )
                step_starting_index = step + 1
                episode_index += 1
                observation, info = env.reset()
        env.close()

    else:
        for step in range(1000):
            action = env.action_space.sample() # randomly sampled action
            observation, reward, terminated, truncated, info = env.step(action)

            print("REWARD:", reward, "| ACTION:", ACTIONS[action])
            sleep(0.01) # for spacing out rendering of frames

            if terminated or truncated:
                save_video(
                    env.render(),
                    "videos",
                    fps=env.metadata["render_fps"],
                    step_starting_index=step_starting_index,
                    episode_index=episode_index,
                    name_prefix=MAP
                )
                step_starting_index = step + 1
                episode_index += 1
                observation, info = env.reset()
        env.close()

if __name__ == "__main__":
    main()