from core.models import User
from django.core.management.base import BaseCommand
from workspaces.models import Workspace, WorkspaceMember
from tasks.models import Task
from projects.models import Project, ProjectMember 
from comments.models import Comment
from django.utils.timezone import now


class Command(BaseCommand):
    help = "Seed database with dummy data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # USERS
        user1, _ = User.objects.get_or_create(
            username="motilal",
            email="motilalrathod@gmail.com",
            defaults={"first_name": "Motilal", "last_name": "Rathod"},
        )
        user1.set_password("123456")
        user1.save()

        user2, _ = User.objects.get_or_create(
            username="prajwal",
            email="prajwal@example.com",
            defaults={"first_name": "Prajwal", "last_name": "Kasture"},
        )
        user2.set_password("123456")
        user2.save()

        user3, _ = User.objects.get_or_create(
            username="nilesh",
            email="nilu111sanap@gmail.com",
            defaults={"first_name": "Nilesh", "last_name": "Sanap"},
        )
        user3.set_password("123456")
        user3.save()

        # WORKSPACES
        ws1, _ = Workspace.objects.get_or_create(
            name="College Projects Workspace",
            owner=user3
        )

        ws2, _ = Workspace.objects.get_or_create(
            name="Personal Project Workspace",
            owner=user3
        )

        # WORKSPACE MEMBERS
        for ws in [ws1, ws2]:
            WorkspaceMember.objects.get_or_create(user=user1, workspace=ws, role="admin")
            WorkspaceMember.objects.get_or_create(user=user2, workspace=ws, role="admin")
            WorkspaceMember.objects.get_or_create(user=user3, workspace=ws, role="admin")

        # PROJECTS
        proj1, _ = Project.objects.get_or_create(
            name="CodeClub Platform",
            workspace=ws1,
            defaults={"description": "A student community platform for coding resources."}
        )

        proj2, _ = Project.objects.get_or_create(
            name="Simon Says Game",
            workspace=ws1,
            defaults={"description": "Browser-based memory game with growing difficulty."}
        )

        proj3, _ = Project.objects.get_or_create(
            name="Airbnb Clone",
            workspace=ws2,
            defaults={"description": "Full-stack Airbnb clone with booking and auth."}
        )

        proj4, _ = Project.objects.get_or_create(
            name="ChainStock Analysis",
            workspace=ws2,
            defaults={"description": "Automation testing framework for regression and performance."}
        )

        
        for project in [proj1, proj2, proj3, proj4]:
            ProjectMember.objects.get_or_create(user=user1, project=project, role="admin")
            ProjectMember.objects.get_or_create(user=user2, project=project, role="admin")
            ProjectMember.objects.get_or_create(user=user3, project=project, role="admin")

        # TASKS
        task1, _ = Task.objects.get_or_create(
            title="Design Homepage UI",
            project=proj1,
            assignee=user1,
            defaults={
                "description": "Create a clean and responsive homepage layout.",
                "status": "IN_PROGRESS",
                "type": "FEATURE",
                "priority": "HIGH",
                "due_date": now(),
            }
        )

        task2, _ = Task.objects.get_or_create(
            title="Implement User Authentication",
            project=proj1,
            assignee=user2,
            defaults={
                "description": "Add login and signup functionality with validation.",
                "status": "TODO",
                "type": "TASK",
                "priority": "MEDIUM",
                "due_date": now(),
            }
        )

        task3, _ = Task.objects.get_or_create(
            title="Fix Navigation Bugs",
            project=proj1,
            assignee=user1,
            defaults={
                "description": "Resolve routing issues between dashboard and profile pages.",
                "status": "TODO",
                "type": "BUG",
                "priority": "HIGH",
                "due_date": now(),
            }
        )

        Comment.objects.get_or_create(
            task=task1,
            user=user2,
            content="Looks good! Maybe use a lighter color scheme."
        )

        Comment.objects.get_or_create(
            task=task1,
            user=user3,
            content="Ensure it's mobile responsive as well."
        )

        Comment.objects.get_or_create(
            task=task2,
            user=user1,
            content="Don't forget to add password validation."
        )

        simple_tasks = [
            {
                "title": "Plan the work",
                "description": "Understand the project and plan tasks clearly.",
                "status": "TODO",
                "type": "TASK",
                "priority": "MEDIUM",
            },
            {
                "title": "Start development",
                "description": "Work on main features of the project.",
                "status": "IN_PROGRESS",
                "type": "FEATURE",
                "priority": "HIGH",
            },
            {
                "title": "Test and fix issues",
                "description": "Test the project and fix bugs.",
                "status": "TODO",
                "type": "BUG",
                "priority": "LOW",
            },
        ]

        projects = Project.objects.all()

        for project in projects:
            if project.tasks.exists():
                continue

            members = WorkspaceMember.objects.filter(workspace=project.workspace)
            if not members.exists():
                continue

            members = list(members)

            for i, task_data in enumerate(simple_tasks):
                Task.objects.create(
                    title=task_data["title"],
                    description=task_data["description"],
                    project=project,
                    assignee=members[i % len(members)].user,
                    status=task_data["status"],
                    type=task_data["type"],
                    priority=task_data["priority"],
                    due_date=now(),
                )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
