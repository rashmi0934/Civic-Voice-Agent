from app.agents.duplicate_agent import duplicate_agent


new_complaint = """
There is dirty water coming from the taps in Sector 15.
The water pipeline appears to be damaged.
"""


existing_complaints = [

    """
    Residents of Sector 15 are receiving dirty water
    because of a damaged pipeline.
    """,

    """
    The streetlights in Sector 20 have not been working
    for one week.
    """,

    """
    There is a large pothole near the main market.
    """

]


result = duplicate_agent.run({

    "new_complaint": new_complaint,

    "existing_complaints": existing_complaints

})


print(result)