import gym
from gym.utils.save_video import save_video
'''
Search Algorithms
'''

class Search:
    def __init__(self, environment):
        self.environment = environment

    def backtrack():
        return

    def dfs(self, env, map):
        print("Algo: Depth-First Search")
        # TODO: Implement DFS
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
                        name_prefix=map
                    )    
                    env.close()
                    return acs
                if done:
                    break
                stack.append(acs +[i] )
        env.close() 
        print("No sol found")
        return None


    def bfs(self, env, map):
        print("Algo: Breadth-First Search")
        # TODO: Implement BFS
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
                        name_prefix=map
                    )    
                    env.close()
                    return acs
                if done:
                    break
                queue.append(acs +[i] )
        env.close() 
        print("No sol found")
        return None


    def ucs(self, env, map):
        print("Algo: Uniform Cost Search")
        # TODO: Implement UCS


    def a_star(self, env, map):
        print("Algo: A* Search")
        # TODO: Implement A*