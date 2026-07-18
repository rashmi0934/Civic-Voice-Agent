from app.agents.validation_agent import validation_agent


complaint = """
There has been no electricity in our village for two days.
"""


result = validation_agent.run(complaint)


print(result)


print("\nAs dictionary:")

print(result.to_dict())