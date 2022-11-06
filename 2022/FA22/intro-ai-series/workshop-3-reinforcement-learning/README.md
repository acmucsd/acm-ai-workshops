<!-- 
    If you have any questions about this template, feel free to ask
    your Director for help!
-->


<!-- 
    SECTION: Header
    ---------
    Request new headers from you Director to fit your workshop!
-->

![Intro to AI: Reinforcement Learning](./figures/W2_Header_Light.png#gh-light-mode-only)
![Intro to AI: Reinforcement Learning](./figures/W2_Header_Dark.png#gh-dark-mode-only)

The official ACM AI **Intro to AI: Reinforcement Learning Workshop** repository. We demonstrate how to run reinforcement learning algorithms in a custom Pacman environment from Berkeley's [CS 188](https://inst.eecs.berkeley.edu/~cs188/fa22/projects/proj3/).

<!-- 
    SECTION: Table of Contents
    ---------
    Mandatory Sections:
        - File Directory Structure
        - Workshop Recording
            - if you recorded your workshop, please make it available here
        - Getting Started
            - Give an interesting description of your workshop!
            - E.g. you can use the marketing descriptiong (w/o the emojis
              and make the nouns general ('you' becomes 'the reader'))
        - Resources
            - Images, papers, etc
    Do NOT Include:
        - Author Info
            - This should only be in the main README for your series
    Other Possible Sections:
        - Anything else you'd like, but try not to be redundant!
            - Make sure it's not already in the main series README or
              another section
-->

<!-- 
    SECTION: Workshop Video
    ---------
    Most, if not all, workshops should have recordings. Once the recording
    is posted to the ACMUCSD YT channel (https://www.youtube.com/channel/UCyjPATFqc3FwOiuqJ2UG1Eg), replace the text with an <img> element.
-->

# 1. Getting Started

<!-- 
    You can write something up or use the marketing description.
-->

## 1.1 Environment Setup

```
conda env create -f environment.yaml
conda activate ai
```

Workshop "Intro to AI: Reinforcement Learning" consists of 2 components:
- [Notebook](<!-- Local Path to Notebook -->) with completed code and explanations.
- [Summary Graphic](<!-- Local Path to Summary Graphic -->) to summarize key points of the workshop. (To be added after workshop)

Please refer to [CS 188](https://inst.eecs.berkeley.edu/~cs188/fa22/projects/proj2/#welcome-to-multi-agent-pacman) for exact details on the code.

## 1.2 Testing the Code

Try running
```
python gridworld.py -m
```
to play in the gridworld environment manually and get a grasp on the environment.

Algorithms:

Q2 - Value Iteration

Q3 - Q-Learning and Epsilon-Greedy

Q4 - Deep Q-Learning

<!-- 
    Note: The above list will depend on your specific workshop.
-->


# 2. Workshop Video

*Will be added as soon as uploaded to YouTube*

<!--
<div align="center">
<a href="YT Video Link">
<img
    src="YT Max Res Thumbnail Link"
    alt="Screen reader-compatible alt text"
    width="500px"
/>
</a>
</div>
-->

<!-- 
    SECTION: File Directory Structure
    ---------
    Write out your File Directory Structure below (make sure it's up-to-date)
-->

# 3. File Directory Structure

```bash
intro-ai-series
    | -- figures
        | -- DefaultW1_Header_Dark.png
        | -- DefaultW1_Header_Light.png
    | -- src
        | -- multiAgents.py # implement the algorithms
        | -- pacman.py # main file that runs pacman games
        | -- util.py # useful utility function with data structures for implementing algorithms (optional o use)
        | -- autograder.py # run this for determining the correctness of code
    | -- README.md
```

<!-- 
    SECTION: Getting Started
    ---------
    Brief description of your workshop here
-->
