from search import *

def main():
    search = Search(environment="Frozen-Lake")
    search.dfs()
    search.bfs()
    search.ucs()
    search.a_star()

if __name__ == "__main__":
    main()