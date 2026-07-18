from app.services.llm_service import llm_service

print("Current Model:")
print(llm_service.get_model())

print()

response = llm_service.generate(
    "Say hello in one sentence."
)

print(response)

print()

print(llm_service.health_check())