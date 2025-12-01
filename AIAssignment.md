# Homework 5 AI Synthesis Activity

Only complete one of the assignments below! You can delete the other assignment in this document once you've made your choice.

## Activity B: You did NOT use AI

### Part 1

> Explain some improvement you want to make within your code. Perhaps you have a code block that could be more concise, or a part of your code could be improved with a library or be performed with a more efficient algorithm.

I want to make the /box route easier to understand. Right now I repeat the same checks, like “is this date valid?" or “is level between 1 and 100?” over and over. It would be nicer if I had one helper that did all this so the code is shorter and clearer. If this was implemented, then the route could just call that helper and move on, instead of repeating the same logic everywhere. That would make the code shorter, clearer, and easier to fix if the rules change.


### Part 2

> Ask AI how to improve your code, by picking a part of your program you are interested in improving and asking something along the lines of "how can I improve this code?" This does not have to be verbatim; you could ask more specific questions for improvement, like "what JavaScript libraries could improve the efficiency of my code?" Screenshot or link the response.

https://chatgpt.com/share/692d0ed3-26c4-800c-bb34-e2a63b97b126

### Part 3

> Evaluate the response the AI generates. You may need to do some research to do this evaluation, to see if the syntax generates correctly or if any libraries the AI suggests are appropriate for the current task. Report on whether the AI's solution fits within your project, or if it would need modifications to work properly.

The AI suggested replacing the repetitive manual checks in /box with a shared schema or validation middleware. That advice seems plausible, as our current route repeats the same checks over and over again. A library like Zod or Joi could simplify that, and even our own helper function would do the job. The proposed pattern, with centralized validation and cleaner handlers fits perfectly with this project, as it would lead to no syntax issues and could be dropped in with only minor rewiring of the route. The response is pretty accurate, but since my code already works properly, I will not be using the AI suggestion.

**_ You do NOT need to use the AI suggestion within your final submission, if your code already works properly. If the scope of your inquiry in this activity leads you to replace parts of your code, switch to the other version of this activity instead. _**
