from app.agents.transcription_agent import (

    transcription_correction_agent

)


transcribed_text = """

Garbage has not been picked up from street corner for several days,
creating a false smell and attracting stray animals and most cute,
blocking pedestrian paths and posing a major health risk to residents.
The location is street number 13 near Durga Hospital.

"""


result = transcription_correction_agent.run(

    transcribed_text

)


print("\n")
print("=" * 60)
print("TRANSCRIPTION CORRECTION RESULT")
print("=" * 60)


print("\nAgent Response:")

print(result)


if result.success:

    print("\nCorrected Text:")

    print(

        result.data["corrected_text"]

    )