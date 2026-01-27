from django.core.management.base import BaseCommand
from core.models import User
from workspaces.models import Workspace, WorkspaceMember
from projects.models import Project, ProjectMember
from tasks.models import Task
from comments.models import Comment
from django.utils.text import slugify
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
            slug=slugify("College Projects Workspace"),
            owner=user3,
            defaults={"description": "Workspace for college academic projects and team-based learning."},
        )

        ws2, _ = Workspace.objects.get_or_create(
            name="Personal Project Workspace",
            slug=slugify("Personal Project Workspace"),
            owner=user3,
            defaults={"description": "Workspace for personal learning projects and portfolio development."},
        )

        # WORKSPACE MEMBERS
        WorkspaceMember.objects.get_or_create(user=user1, workspace=ws1, role="ADMIN")
        WorkspaceMember.objects.get_or_create(user=user2, workspace=ws1, role="ADMIN")
        WorkspaceMember.objects.get_or_create(user=user3, workspace=ws1, role="ADMIN")

        WorkspaceMember.objects.get_or_create(user=user1, workspace=ws2, role="ADMIN")
        WorkspaceMember.objects.get_or_create(user=user2, workspace=ws2, role="ADMIN")
        WorkspaceMember.objects.get_or_create(user=user3, workspace=ws2, role="ADMIN")

        # PROJECTS
        proj1, _ = Project.objects.get_or_create(
            name="CodeClub Platform",
            workspace=ws1,
            team_lead=user3,
            defaults={
                "description": "A student community platform where members can share coding resources, events, and project ideas.",
                "priority": "HIGH",
                "status": "ACTIVE",
                "progress": 70,
            },
        )

        proj2, _ = Project.objects.get_or_create(
            name="Simon Says Game",
            workspace=ws1,
            team_lead=user3,
            defaults={
                "description": "A browser-based memory game where users repeat color sequences that grow progressively harder.",
                "priority": "MEDIUM",
                "status": "ACTIVE",
                "progress": 50,
            },
        )

        proj3, _ = Project.objects.get_or_create(
            name="Airbnb Clone",
            workspace=ws2,
            team_lead=user3,
            defaults={
                "description": "A full-stack Airbnb-inspired platform with property listings, booking flow, and user authentication.",
                "priority": "HIGH",
                "status": "ACTIVE",
                "progress": 80,
            },
        )

        proj4, _ = Project.objects.get_or_create(
            name="ChainStock Analysis",
            workspace=ws2,
            team_lead=user3,
            defaults={
                "description": "An automation testing framework using Selenium and Playwright for regression and performance testing.",
                "priority": "MEDIUM",
                "status": "ACTIVE",
                "progress": 60,
            },
        )

        # PROJECT MEMBERS
        for project in [proj1, proj2, proj3, proj4]:
            ProjectMember.objects.get_or_create(user=user1, project=project)
            ProjectMember.objects.get_or_create(user=user2, project=project)
            ProjectMember.objects.get_or_create(user=user3, project=project)

        # TASKS
        Task.objects.get_or_create(
            title="Design Homepage UI",
            project=proj1,
            assignee=user1,
            defaults={
                "description": "Create a clean and responsive homepage layout for the platform.",
                "status": "IN_PROGRESS",
                "type": "FEATURE",
                "priority": "HIGH",
                "due_date": now(),
            },
        )

        Task.objects.get_or_create(
            title="Implement User Authentication",
            project=proj1,
            assignee=user2,
            defaults={
                "description": "Add login and signup functionality using simple form validation.",
                "status": "TODO",
                "type": "TASK",
                "priority": "MEDIUM",
                "due_date": now(),
            },
        )

        Task.objects.get_or_create(
            title="Fix Navigation Bugs",
            project=proj1,
            assignee=user1,
            defaults={
                "description": "Resolve routing issues between dashboard and profile pages.",
                "status": "TODO",
                "type": "BUG",
                "priority": "HIGH",
                "due_date": now(),
            },
        )

        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
