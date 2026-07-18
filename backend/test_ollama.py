from app.services.llm_service import llm_service

answer = llm_service.generate(
    "What is the capital of India?"
)

print(answer)