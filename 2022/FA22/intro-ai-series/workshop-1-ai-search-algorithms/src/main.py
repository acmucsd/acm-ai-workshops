from search import *
import numpy as np

def main():
    search = Search(environment="FrozenLake-v2")
    MAPS = {"4x4":["SFFF", "FHFH", "FFFH", "HFFG"],
    "8x8":["SFFFFFFF", "FFFFFFFF", "FFFHFFFF", "FFFFFHFF", 
            "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFG"]}
    MAP = "8x8" # can be 8x8 or 4x4
    map_side_length = 8

    RENDER_MODE="rgb_array_list"
    env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
    
    search.dfs(env, MAP, map_side_length)
    search.bfs(env, MAP, map_side_length)

    cost_board = np.array([
        np.zeros(8),
        np.zeros(8),
        [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
        [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    ])
    search.ucs(env, MAP, map_side_length)
    search.a_star(env, MAP, map_side_length, cost_board, (0, 0), (7, 7))

if __name__ == "__main__":
    main()