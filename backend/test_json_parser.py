from app.utils.json_parser import JSONParser


response = """
Here is the result:

```json
{
    "category":"Water",
    "urgency":"High",
    "location":"Sector 12"
}

Thank you.
"""

result=JSONParser.parse(response)
print(result)
if result["success"]:
    JSONParser.pretty(result["data"])
else:
    print(result["error"])