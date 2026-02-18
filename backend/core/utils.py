# core/utils.py
from django.conf import settings
from django.core.mail import send_mail

def send_project_invitation_email(invite):
    signup_link = f"{settings.FRONTEND_URL}/signup?token={invite.token}"

    subject = "You are invited to join a project on CollabFlow"
    message = (
        f"Hello,\n\n"
        f"You have been invited to join the project: {invite.project.name}\n\n"
        # f"You have been invited to join the project: {invite.workspace.name}\n\n"
        f"Signup using this link:\n{signup_link}\n\n"
        f"If you didn’t request this, you can ignore this email."
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[invite.email],
        fail_silently=False,
    )
