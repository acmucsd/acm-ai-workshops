from search import *
import numpy as np

def generate_path_video(search, algo_name, map_name, env, board, start, goal):
    env.reset(seed=42)
    backtrack_actions = search.backtrack_path(board, goal, start)
    env, rew, terminated = search.follow_action_sequence(env, backtrack_actions)

    if terminated:
        # print('Found path by taking following actions: ', acs)
        save_video(
            env.render(),
            f"videos/{algo_name}",
            fps=env.metadata["render_fps"],
            #step_starting_index=step_starting_index,
            #episode_index=episode_index,
            name_prefix=f"finalpath{algo_name}{map_name}"
        )
        env.close()
    else:
        print("FAILED.")

def main():
    search = Search(environment="FrozenLake-v2")
    MAPS = {"4x4":["SFFF", "FHFH", "FFFH", "HFFG"],
    # "8x8":["SFFFFFFF", "FFFFFFFF", "FFFHFFFF", "FFFFFHFF", 
    #         "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFG"]}
    "8x8":["SFFFFHFF", "FFFHHFFF", "FFFHFFFF", "FFFFFHFF", 
            "FFFHFFFF", "FHHGFFHF", "FHFFHFHF", "FFFHFFFF"]}
    MAP = "8x8" # can be 8x8 or 4x4
    map_side_length = 8

    RENDER_MODE="rgb_array_list"
    env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
    
    res_board = search.dfs(env, MAP, map_side_length)
    generate_path_video(search, "dfs", "8x8", env, res_board, (0, 0), (5, 3))

    res_board = search.bfs(env, MAP, map_side_length)
    generate_path_video(search, "bfs", "8x8", env, res_board, (0, 0), (5, 3))

    # cost_board = np.array([
    #     np.zeros(8),
    #     np.zeros(8),
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    #     [0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
    #     [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    # ])
    # cost_board = np.array([
    #     [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    #     [0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
    #     [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
    #     [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    # ])
    cost_board = np.array([
        [1.0, 1.0, 1.0, 1.0, 1.0, 5.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 5.0, 5.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 5.0, 1.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0, 1.0, 5.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 5.0, 1.0, 1.0, 1.0, 1.0],
        [1.0, 5.0, 5.0, 1.0, 1.0, 1.0, 5.0, 1.0],
        [1.0, 5.0, 1.0, 1.0, 5.0, 1.0, 5.0, 1.0],
        [1.0, 1.0, 1.0, 5.0, 1.0, 1.0, 1.0, 1.0],
    ])
    res_board = search.ucs(env, MAP, map_side_length, cost_board, (0, 0))
    generate_path_video(search, "ucs", "8x8", env, res_board, (0, 0), (5, 3))

    res_board = search.a_star(env, MAP, map_side_length, cost_board, (0, 0), (5, 3))
    generate_path_video(search, "a_star", "8x8", env, res_board, (0, 0), (5, 3))

if __name__ == "__main__":
    main()