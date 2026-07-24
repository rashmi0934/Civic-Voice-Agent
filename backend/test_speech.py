from app.services.speech_service import speech_service


audio_file = "test_complaint.wav"


result = speech_service.transcribe(

    audio_file

)


print("\n")
print("=" * 60)
print("SPEECH TRANSCRIPTION RESULT")
print("=" * 60)


print("\nDetected Language:")

print(

    result["language"]

)


print("\nTranscribed Text:")

print(

    result["text"]

)