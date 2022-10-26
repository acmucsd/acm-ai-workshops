import gym
import heapq
from heapq import *
import numpy as np
from gym.utils.save_video import save_video
'''
Search Algorithms
'''

class Search:
    def __init__(self, environment):
        self.environment = environment

    def get_coordinate(self, observation, map_side_length):
        return (int(observation / map_side_length), observation % map_side_length)

    def get_opposite_action(self, action):
        return (action - 2) % 4

    def action_to_coordinate(self, action, coord):
        row, col = coord
        if action == 0:
            col -= 1
        elif action == 1:
            row += 1
        elif action == 2:
            col += 1
        elif action == 3:
            row -= 1
        
        if row < 0 or col < 0 or row > 7 or col > 7:
            return (row, col), False

        return (row, col), True

    def backtrack_path(self, board, target, current):
        b_at = target
        path = [b_at]
        path_actions = [None]
        
        while b_at != (0, 0) and b_at != current:
            act = self.get_opposite_action(board[b_at])
            prev, _ = self.action_to_coordinate(act, b_at)
            path.insert(0, prev)
            path_actions.insert(0, board[b_at])
            b_at = prev

        at = current
        backtrack_actions = []

        while at not in path:
            backtrack_act = self.get_opposite_action(board[at])
            prev_coord, _ = self.action_to_coordinate(backtrack_act, at)

            backtrack_actions.append(backtrack_act)
            at = prev_coord
        
        ind = path.index(at)
        return backtrack_actions + path_actions[ind:-1]

    def follow_action_sequence(self, env, actions):
        for a in actions:
            observation, reward, terminated, truncated, info = env.step(a)
            if terminated:
                return env, reward, terminated
        return env, reward, terminated

    def h_value(self, coord, goal):
        return abs(coord[0] - goal[0]) + abs(coord[1] - goal[1])

    def dfs(self, env, map, map_side_length):
        print("Algo: Depth-First Search")
        board = np.ones((map_side_length, map_side_length), dtype=int) * -1
        observation, info = env.reset(seed=42)
        curr = self.get_coordinate(observation, map_side_length)
        stack = [curr]
        while len(stack) > 0:
            e_coord = stack.pop()
            terminated = False
            if e_coord != curr:
                backtrack_actions = self.backtrack_path(board, e_coord, curr)
                env, rew, terminated = self.follow_action_sequence(env, backtrack_actions)
                curr = e_coord

            if terminated:
                # print('Found path by taking following actions: ', acs)
                save_video(
                    env.render(),
                    "videos/dfs",
                    fps=env.metadata["render_fps"],
                    #step_starting_index=step_starting_index,
                    #episode_index=episode_index,
                    name_prefix=map
                )    
                env.close()
                return board
            
            for i in range(4):
                next_c, success = self.action_to_coordinate(i, curr)
                if success and board[next_c] == -1:
                    stack.append(next_c)
                    board[next_c] = i
        env.close() 
        print("No sol found")
        return None


    def bfs(self, env, map, map_side_length):
        print("Algo: Breadth-First Search")
        board = np.ones((map_side_length, map_side_length), dtype=int) * -1
        observation, info = env.reset(seed=42)
        curr = self.get_coordinate(observation, map_side_length)
        queue = [curr]
        while len(queue) > 0 :
            e_coord = queue.pop(0)
            terminated = False
            if e_coord != curr:
                backtrack_actions = self.backtrack_path(board, e_coord, curr)
                env, rew, terminated = self.follow_action_sequence(env, backtrack_actions)
                curr = e_coord

            if terminated:
                # print('Found path by taking following actions: ', acs)
                save_video(
                    env.render(),
                    "videos/bfs",
                    fps=env.metadata["render_fps"],
                    #step_starting_index=step_starting_index,
                    #episode_index=episode_index,
                    name_prefix=map
                )    
                env.close()
                return board
            
            for i in range(4):
                next_c, success = self.action_to_coordinate(i, curr)
                if success and board[next_c] == -1:
                    queue.append(next_c)
                    board[next_c] = i
        env.close() 
        print("No sol found")
        return None


    def ucs(self, env, map, map_side_length):
        print("Algo: Uniform Cost Search")

    def a_star(self, env, map, map_side_length, cost_board, start, goal):
        print("Algo: A* Search")
        board = np.ones((map_side_length, map_side_length), dtype=int) * -1
        visited = np.zeros((map_side_length, map_side_length), dtype=bool)
        observation, info = env.reset(seed=42)
        curr = start
        frontier = [(cost_board[curr] + self.h_value(curr, goal), 0, curr)]
        heapify(frontier)
        while len(frontier) > 0:
            curr_tuple = heappop(frontier)
            curr_G = curr_tuple[1]
            e_coord = curr_tuple[2]
            
            while visited[e_coord]:
                curr_tuple = heappop(frontier)
                curr_G = curr_tuple[1]
                e_coord = curr_tuple[2]

            if e_coord != start:
                board[e_coord] = curr_tuple[3]

            terminated = False
            if e_coord != curr:
                backtrack_actions = self.backtrack_path(board, e_coord, curr)
                env, rew, terminated = self.follow_action_sequence(env, backtrack_actions)
                curr = e_coord

            if terminated:
                # print('Found path by taking following actions: ', acs)
                save_video(
                    env.render(),
                    "videos/a_star",
                    fps=env.metadata["render_fps"],
                    #step_starting_index=step_starting_index,
                    #episode_index=episode_index,
                    name_prefix=map
                )    
                env.close()
                return board
            
            visited[curr] = True

            for i in range(4):
                next_c, valid = self.action_to_coordinate(i, curr)
                if valid and not visited[next_c]:
                    heappush(frontier, (curr_G  + cost_board[next_c] + self.h_value(next_c, goal), curr_G  + cost_board[next_c], next_c, i))
                    # board[next_c] = i
