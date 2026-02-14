# from django.core.mail import send_mail
# from django.conf import settings

# def send_project_invite(email, token):
#     link = f"http://127.0.0.1:8000/api/projects/accept-invite/{token}/"

#     send_mail(
#         "Project Invitation",
#         f"You are invited to join project.\nClick here:\n{link}",
#         settings.EMAIL_HOST_USER,
#         [email],
#     )
