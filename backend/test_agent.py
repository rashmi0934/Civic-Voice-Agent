from app.agents.processing_agent import processing_agent

complaint = """
The drain near Government School in Sector 5 has been overflowing
for three days.
"""

result = processing_agent.process(complaint)

print(type(result))
print(result)