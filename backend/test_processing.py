from app.agents.processing_agent import processing_agent

complaint = """
There is dirty water coming from taps in Sector 15.
Children have become sick because of it.
Please repair the pipeline immediately.
"""

result = processing_agent.run(complaint)

print(result)