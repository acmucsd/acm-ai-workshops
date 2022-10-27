from search import *
from maps import MAPS
import numpy as np
import sys
import gym
def generate_path_video(search, algo_name, map_name, env, board, start, goal):
    env.reset(seed=42)
    backtrack_actions = search.backtrack_path(board, goal, start)
    env, rew, terminated = search.follow_action_sequence(env, backtrack_actions)

    if terminated:
        save_video(
            env.render(),
            f"videos/{algo_name}",
            fps=env.metadata["render_fps"],
            name_prefix=f"finalpath{algo_name}{map_name}"
        )
        env.close()
    else:
        print("FAILED.")

def main(map):
    search = Search(environment="FrozenLake-v1", map_side_length=map['map_side_length'])

    RENDER_MODE="rgb_array_list"
    env = gym.make("FrozenLake-v1", desc=map['desc'], render_mode=RENDER_MODE, is_slippery=False)
    
    res_board = search.dfs(env, map['name'], map['map_side_length'])
    generate_path_video(search, "dfs", map['name'], env, res_board, map['start'], map['goal'])

    res_board = search.bfs(env, map['name'], map['map_side_length'])
    generate_path_video(search, "bfs", map['name'], env, res_board, map['start'], map['goal'])

    res_board = search.ucs(env, map['name'], map['map_side_length'], map['cost_board'], map['start'])
    generate_path_video(search, "ucs", map['name'], env, res_board, map['start'], map['goal'])

    res_board = search.a_star(env, map['name'], map['map_side_length'], map['cost_board'], map['start'], map['goal'])
    generate_path_video(search, "a_star", map['name'], env, res_board, map['start'], map['goal'])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the map name.")
        sys.exit(2)

    map_name = sys.argv[1]
    if map_name in MAPS.keys():
        main(MAPS[map_name])
    else:
        print("Please provide a valid map name or define a new one in maps.py.")