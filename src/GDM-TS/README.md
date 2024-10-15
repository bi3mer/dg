# GDM-TS

This is a TypeScript implementation of [GDM](https://github.com/bi3mer/GDM). It formulates a [Markov Decision Process](https://en.wikipedia.org/wiki/Markov_decision_process) as a graph. This can be very convenient when the action space is different between states, but very inconvenient when the same actions are used in every state. 

You can find two examples in the [example directory](./example). The first is a deterministic version of Grid World and a stochastic version. I think the stochastic version really shows why you only want to use this approach if actions are different between states. 

The examples also show the algorithms available: random, greedy, [value iteration](https://en.wikipedia.org/wiki/Markov_decision_process#Value_iteration), and [policy iteration](https://en.wikipedia.org/wiki/Markov_decision_process#Policy_iteration). Note both value and policy iteration come with configuration values that are optional that will affect the output. I haven't documented them very well, but feel free to reach out via an issue if you have questions. I hope this little bit of code helps you if you have somehow found your way here.  

## Differences 

GDM creates policies where one input state is associated with only one other state. GDM-TS has the input state attached to an array of possible output states. In the case of policy and value iteration, more than one possible state output occurs when multiple neighbor states have the same utility. In the case of greedy, multiple output states occur when states have the same reward. The random policy returns all possible neighboring states. 

This makes for more dynamic policies and is especially helpful in the context that GDM-TS is being used for: level generation for players. Take a simple example like a tree where A connects to B or C, and B and C have the same utility. With how GDM was implemented, the same state will always be output. It makes the game feel less dynamic on replay. Now, with the array of options, the output could be B or C.