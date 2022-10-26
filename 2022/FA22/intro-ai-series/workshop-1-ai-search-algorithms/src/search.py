import gym
from gym.utils.save_video import save_video
'''
Search Algorithms
'''

class Search:
    def __init__(self, environment):
        self.environment = environment

    def dfs(self):
        print("Algo: Depth-First Search")
        # TODO: Implement DFS
        MAPS = {"4x4":["SGFF", "FHFH", "FFFH", "HFFF"],
        "8x8":["SFFFFFFF", "FFFFFFFF", "FFGHFFFF", "FFFFFHFF",
               "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFF"]}
        MAP = "8x8" # can be 8x8 or 4x4

        ACTIONS = {0: "LEFT", 1: "DOWN", 2: "RIGHT", 3: "UP"}
        RENDER_MODE="rgb_array_list"
        env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
        env.action_space.seed(42)
        observation, info = env.reset(seed=42)
        stack = [[]]
        while len(stack) > 0 :
            acs = stack.pop(0)
            for i in range(4):
                rew = -1
                done = False
                obs, info = env.reset(seed=42)
                for a in acs:
                    obs,rew, terminated, truncated, _ = env.step(a)
                    if terminated or truncated:
                        done=True
                        break
                if rew > 0.0:
                    print('Found path by taking following actions: ', acs)
                    save_video(
                        env.render(),
                        "videos/dfs",
                        fps=env.metadata["render_fps"],
                        #step_starting_index=step_starting_index,
                        #episode_index=episode_index,
                        name_prefix=MAP
                    )    
                    env.close()
                    return acs
                if done:
                    break
                stack.append(acs +[i] )
        env.close() 
        print("No sol found")
        return None


    def bfs(self):
        print("Algo: Breadth-First Search")
        # TODO: Implement BFS
        MAPS = {"4x4":["SGFF", "FHFH", "FFFH", "HFFF"],
        "8x8":["SFFFFFFF", "FFFGFFFF", "FFFHFFFF", "FFFFFHFF",
               "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFF"]}
        MAP = "8x8" # can be 8x8 or 4x4

        ACTIONS = {0: "LEFT", 1: "DOWN", 2: "RIGHT", 3: "UP"}
        RENDER_MODE="rgb_array_list"
        env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
        env.action_space.seed(42)
        observation, info = env.reset(seed=42)
        queue = [[]]
        while len(queue) > 0 :
            acs = queue.pop(0)
            for i in range(4):
                rew = -1
                done = False
                obs, info = env.reset(seed=42)
                for a in acs:
                    obs,rew, terminated, truncated, _ = env.step(a)
                    if terminated or truncated:
                        done=True
                        break
                if rew > 0.0:
                    print('Found path by taking following actions: ', acs)
                    save_video(
                        env.render(),
                        "videos/bfs",
                        fps=env.metadata["render_fps"],
                        #step_starting_index=step_starting_index,
                        #episode_index=episode_index,
                        name_prefix=MAP
                    )    
                    env.close()
                    return acs
                if done:
                    break
                queue.append(acs +[i] )
        env.close() 
        print("No sol found")
        return None


    def ucs(self):
        print("Algo: Uniform Cost Search")
        # TODO: Implement UCS


    def a_star(self):
        print("Algo: A* Search")
        # TODO: Implement A*