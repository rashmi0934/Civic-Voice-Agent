from dataclasses import dataclass
from typing import Any


@dataclass
class AgentResponse:

    success: bool

    agent: str

    data: Any = None

    error: str | None = None

    def to_dict(self):

        return {
            "success": self.success,
            "agent": self.agent,
            "data": self.data,
            "error": self.error
        }