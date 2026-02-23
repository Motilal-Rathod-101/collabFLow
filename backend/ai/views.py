import os
import time
import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tasks.models import Task
from projects.models import Project


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        message = request.data.get("message", "")
        user = request.user

        # Fetch user data
        tasks = Task.objects.filter(assignee=user)[:5]
        projects = Project.objects.filter(members__user=user)[:5]

        task_text = "\n".join(
            [f"- {t.title} ({t.status})" for t in tasks]
        ) or "No tasks"

        project_text = "\n".join(
            [f"- {p.name}" for p in projects]
        ) or "No projects"

        #  Structured AI Context 
        context = f"""
        You are CollabFlow AI Assistant.

        Your job:
        - Understand user's work status.
        - Analyze tasks and projects.
        - Give intelligent suggestions.
        - Detect workload and priorities.
        - Help user decide next action.

        Rules:
        - Reply in clean plain text.
        - Use "-" bullets.
        - Max 8 lines.
        - Be helpful and practical.

        User Projects:
        {project_text}

        User Tasks:
        {task_text}
        """

        #  OpenRouter API
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "meta-llama/llama-3.1-8b-instruct",
            "temperature": 0.2,
            "messages": [
                {"role": "system", "content": context},
                {"role": "user", "content": f"""
                    User question: {message}

                    Based on tasks and projects above,
                    give smart assistance and next actions.
                    """}
            ],
        }

        reply = "AI could not generate response."

        # Retry logics
        for attempt in range(2):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=30,
                )

                if response.status_code == 200:
                    data = response.json()

                    reply = data["choices"][0]["message"]["content"]
                    break
                else:
                    print("OpenRouter Error:", response.text)
                    time.sleep(1)

            except requests.exceptions.RequestException as e:
                print("Network Error:", e)
                time.sleep(1)

        return Response({"reply": reply})