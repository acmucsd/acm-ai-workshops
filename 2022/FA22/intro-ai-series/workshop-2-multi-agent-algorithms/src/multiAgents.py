# multiAgents.py
# --------------
# Licensing Information:  You are free to use or extend these projects for
# educational purposes provided that (1) you do not distribute or publish
# solutions, (2) you retain this notice, and (3) you provide clear
# attribution to UC Berkeley, including a link to http://ai.berkeley.edu.
# 
# Attribution Information: The Pacman AI projects were developed at UC Berkeley.
# The core projects and autograders were primarily created by John DeNero
# (denero@cs.berkeley.edu) and Dan Klein (klein@cs.berkeley.edu).
# Student side autograding was added by Brad Miller, Nick Hay, and
# Pieter Abbeel (pabbeel@cs.berkeley.edu).


from pure_eval import Evaluator
from util import manhattanDistance
from game import Directions
import random, util

from game import Agent
from pacman import GameState

class ReflexAgent(Agent):
    """
    A reflex agent chooses an action at each choice point by examining
    its alternatives via a state evaluation function.

    The code below is provided as a guide.  You are welcome to change
    it in any way you see fit, so long as you don't touch our method
    headers.
    """


    def getAction(self, gameState: GameState):
        """
        You do not need to change this method, but you're welcome to.

        getAction chooses among the best options according to the evaluation function.

        Just like in the previous project, getAction takes a GameState and returns
        some Directions.X for some X in the set {NORTH, SOUTH, WEST, EAST, STOP}
        """
        # Collect legal moves and successor states
        legalMoves = gameState.getLegalActions()

        # Choose one of the best actions
        scores = [self.evaluationFunction(gameState, action) for action in legalMoves]
        bestScore = max(scores)
        bestIndices = [index for index in range(len(scores)) if scores[index] == bestScore]
        chosenIndex = random.choice(bestIndices) # Pick randomly among the best

        "Add more of your code here if you want to"

        return legalMoves[chosenIndex]

    def evaluationFunction(self, currentGameState: GameState, action):
        """
        Design a better evaluation function here.

        The evaluation function takes in the current and proposed successor
        GameStates (pacman.py) and returns a number, where higher numbers are better.

        The code below extracts some useful information from the state, like the
        remaining food (newFood) and Pacman position after moving (newPos).
        newScaredTimes holds the number of moves that each ghost will remain
        scared because of Pacman having eaten a power pellet.

        Print out these variables to see what you're getting, then combine them
        to create a masterful evaluation function.
        """
        # Useful information you can extract from a GameState (pacman.py)
        successorGameState = currentGameState.generatePacmanSuccessor(action)
        newPos = successorGameState.getPacmanPosition()
        newFood = successorGameState.getFood()
        newGhostStates = successorGameState.getGhostStates()
        newScaredTimes = [ghostState.scaredTimer for ghostState in newGhostStates]

        "*** YOUR CODE HERE ***"
        return successorGameState.getScore()

def scoreEvaluationFunction(currentGameState: GameState):
    """
    This default evaluation function just returns the score of the state.
    The score is the same one displayed in the Pacman GUI.

    This evaluation function is meant for use with adversarial search agents
    (not reflex agents).
    """
    return currentGameState.getScore()

class MultiAgentSearchAgent(Agent):
    """
    This class provides some common elements to all of your
    multi-agent searchers.  Any methods defined here will be available
    to the MinimaxPacmanAgent, AlphaBetaPacmanAgent & ExpectimaxPacmanAgent.

    You *do not* need to make any changes here, but you can if you want to
    add functionality to all your adversarial search agents.  Please do not
    remove anything, however.

    Note: this is an abstract class: one that should not be instantiated.  It's
    only partially specified, and designed to be extended.  Agent (game.py)
    is another abstract class.
    """

    def __init__(self, evalFn = 'scoreEvaluationFunction', depth = '2'):
        self.index = 0 # Pacman is always agent index 0
        self.evaluationFunction = util.lookup(evalFn, globals())
        self.depth = int(depth)

class MinimaxAgent(MultiAgentSearchAgent):
    """
    Your minimax agent (question 2)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the minimax action from the current gameState using self.depth
        and self.evaluationFunction.

        Here are some method calls that might be useful when implementing minimax.

        gameState.getLegalActions(agentIndex):
        Returns a list of legal actions for an agent
        agentIndex=0 means Pacman, ghosts are >= 1

        gameState.generateSuccessor(agentIndex, action):
        Returns the successor game state after an agent takes an action

        gameState.getNumAgents():
        Returns the total number of agents in the game

        gameState.isWin():
        Returns whether or not the game state is a winning state

        gameState.isLose():
        Returns whether or not the game state is a losing state
        """
        "*** YOUR CODE HERE ***"

        actions = gameState.getLegalActions(0)
        successor_states = [gameState.generateSuccessor(0, act) for act in actions]
        result_action = dict(zip(successor_states, actions))
        maxVal = -float('inf')
        maxAction = actions[0]

        for state, act in result_action.items():
            currVal = self.value(state, self.depth, 1)
            if maxVal != max(currVal, maxVal):
                maxVal = max(currVal, maxVal)
                maxAction = act
        return maxAction

    def value(self, gameState, currDepth, agent):
        # Base case (Terminate state)
        if currDepth == 0 or gameState.isLose() or gameState.isWin():
            return self.evaluationFunction(gameState) #static evalutation
        if agent == 0:
            return self.maxValue(gameState, currDepth, agent)
        else:
            return self.minValue(gameState, currDepth, agent)
        
    def maxValue(self, gameState, currDepth, agent):
        actions = gameState.getLegalActions(agent) # all possible actions
        successor_states = [gameState.generateSuccessor(agent, act) for act in actions]
        maxVal = -float("inf") 
        for act in successor_states:
            val = self.value(act, currDepth, 1)
            maxVal = max(maxVal, val)
        return maxVal

    def minValue(self, gameState, currDepth, agent):
        actions = gameState.getLegalActions(agent) # all possible actions
        successor_states = [gameState.generateSuccessor(agent, act) for act in actions] 
            
        minVal = float("inf")
        for act in successor_states:
            if agent + 1 == gameState.getNumAgents():
                val = self.value(act, currDepth - 1, 0)
            else:
                val = self.value(act, currDepth, agent + 1)
            minVal = min(minVal, val)
        return minVal
           
class AlphaBetaAgent(MultiAgentSearchAgent):
    """
    Your minimax agent with alpha-beta pruning (question 3)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the minimax action using self.depth and self.evaluationFunction
        """
        actions = gameState.getLegalActions(0)
        successor_states = [gameState.generateSuccessor(0, act) for act in actions]
        result_action = dict(zip(successor_states, actions))
        maxVal = -float('inf')
        maxAction = actions[0]

        alpha = -float('inf')
        beta = float('inf')

        for state, act in result_action.items():
            currVal = self.value(state, self.depth, 1, alpha, beta)
            if maxVal != max(currVal, maxVal):
                maxVal = max(currVal, maxVal)
                maxAction = act
                alpha = currVal

        return maxAction

    def value(self, gameState, currDepth, agent, alpha, beta):
        # Base case (Terminate state)
        if currDepth == 0 or gameState.isLose() or gameState.isWin():
            return self.evaluationFunction(gameState) #static evalutation
        if agent == 0:
            return self.maxValue(gameState, currDepth, agent, alpha, beta)
        else:
            return self.minValue(gameState, currDepth, agent, alpha, beta)

    def maxValue(self, gameState, currDepth, agent, alpha, beta):
        actions = gameState.getLegalActions(agent) # all possible actions
        maxVal = -float("inf") 
        for act in actions:
            successor_state = gameState.generateSuccessor(agent, act)
            val = self.value(successor_state, currDepth, 1, alpha, beta)
            maxVal = max(maxVal, val)
            # Check for pruning
            if maxVal > beta:
                return maxVal
            alpha = max(alpha, maxVal)
        return maxVal

    def minValue(self, gameState, currDepth, agent, alpha, beta):
        actions = gameState.getLegalActions(agent) # all possible actions
        minVal = float("inf")
        for act in actions:
            successor_state = gameState.generateSuccessor(agent, act)
            if agent + 1 == gameState.getNumAgents():
                val = self.value(successor_state, currDepth - 1, 0, alpha, beta)
            else:
                val = self.value(successor_state, currDepth, agent + 1, alpha, beta)
            minVal = min(minVal, val)
            # Check for pruning
            if minVal < alpha:
                return minVal
            beta = min(beta, minVal)
        return minVal

class ExpectimaxAgent(MultiAgentSearchAgent):
    """
      Your expectimax agent (question 4)
    """

    def getAction(self, gameState: GameState):
        """
        Returns the expectimax action using self.depth and self.evaluationFunction

        All ghosts should be modeled as choosing uniformly at random from their
        legal moves.
        """
        numGhosts = gameState.getNumAgents()
        agentIndex=0
        maxVal = -99999999  
        bestAction = 0
        depth = 1
       
        
        successor={}
        for i in range((numGhosts-1)):
            successor[i]=i+1
        successor[(numGhosts-1)]=0
        nextAgent = successor[agentIndex]
        
        for action in gameState.getLegalActions(agentIndex):
            nextState = gameState.generateSuccessor(agentIndex,action)
            actionVal = self.expectAgentNode(nextAgent,depth,nextState,successor)
            if actionVal>maxVal:
                maxVal = actionVal
                bestAction = action
        
        return bestAction
        
    def expectAgentNode(self,agentIndex,depth,gameState,successor): 
        import numpy as np
        expectVal = [] 
        nextAgent = successor[agentIndex]
    
        if gameState.getLegalActions(agentIndex)==[]:
            return self.evaluationFunction(gameState)
    
        if nextAgent==0:
            for action in gameState.getLegalActions(agentIndex):
                nextState = gameState.generateSuccessor(agentIndex,action)
                expectVal.append(self.maxAgentNode(nextAgent, depth, nextState,successor))
            return np.mean(expectVal)
        else:
            for action in gameState.getLegalActions(agentIndex):
                nextState = gameState.generateSuccessor(agentIndex,action)
                expectVal.append(self.expectAgentNode(nextAgent, depth, nextState,successor))
            return np.mean(expectVal)
            
            
            
    def maxAgentNode(self,agentIndex,depth,gameState,successor):      
        depth += 1
        maxVal=-99999999
        nextAgent = successor[agentIndex]

        if depth==(self.depth+1) or gameState.getLegalActions(agentIndex)==[]:
            return self.evaluationFunction(gameState)
        
        
        for action in gameState.getLegalActions(agentIndex):
            nextState = gameState.generateSuccessor(agentIndex, action)
            maxVal = max(maxVal, self.expectAgentNode(nextAgent,depth,nextState,successor))
        return maxVal

def betterEvaluationFunction(currentGameState: GameState):
    """
    Your extreme ghost-hunting, pellet-nabbing, food-gobbling, unstoppable
    evaluation function (question 5).

    DESCRIPTION: <write something here so we know what you did>
    """
    "*** YOUR CODE HERE ***"
    util.raiseNotDefined()

# Abbreviation
better = betterEvaluationFunction
