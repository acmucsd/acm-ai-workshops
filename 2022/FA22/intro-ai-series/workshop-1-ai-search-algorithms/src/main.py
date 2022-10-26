from search import *

def main():
    search = Search(environment="Frozen-Lake")
    MAPS = {"4x4":["SFFF", "FHFH", "FFFH", "HFFG"],
    "8x8":["SFFFFFFF", "FFFFFFFF", "FFFHFFFF", "FFFFFHFF", 
            "FFFHFFFF", "FHHFFFHF", "FHFFHFHF", "FFFHFFFG"]}
    MAP = "8x8" # can be 8x8 or 4x4

    RENDER_MODE="rgb_array_list"
    env = gym.make("FrozenLake-v1", desc=MAPS[MAP], render_mode=RENDER_MODE, is_slippery=False)
    
    search.dfs(env, MAP)
    search.bfs(env, MAP)
    search.ucs(env, MAP)
    search.a_star(env, MAP)

if __name__ == "__main__":
    main()