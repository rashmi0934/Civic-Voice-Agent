from app.managers.agent_manager import agent_manager


complaint = """
There is dirty water coming from taps in Sector 15.
Children have become sick because of it.
Please repair the pipeline immediately.
"""


result = agent_manager.submit_complaint(
    complaint
)


print("\n")
print("=" * 60)
print("FINAL RESULT")
print("=" * 60)

print(result)