import os
import django
import random
from datetime import time

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import User
from departments.models import Department
from rooms.models import Room
from subjects.models import Subject
from schedules.models import Schedule


print("Resetting database...")


# -------- CLEAR OLD DATA --------
Schedule.objects.all().delete()
Room.objects.all().delete()
Subject.objects.all().delete()
Department.objects.all().delete()
User.objects.exclude(username="admin").delete()


# -------- DEPARTMENTS --------
cse = Department.objects.create(name="CSE")
ece = Department.objects.create(name="ECE")
me = Department.objects.create(name="Mechanical")


# -------- ADMIN --------
admin, _ = User.objects.get_or_create(
    username="admin",
    defaults={"role": "SUPERADMIN"}
)

admin.set_password("test123")

# 🔥 ADD THESE LINES (VERY IMPORTANT)
admin.is_staff = True
admin.is_superuser = True

admin.save()


# -------- HODS --------
User.objects.create_user("hod_cse", password="test123", role="HOD", department=cse)
User.objects.create_user("hod_ece", password="test123", role="HOD", department=ece)
User.objects.create_user("hod_me", password="test123", role="HOD", department=me)


# -------- TEACHERS --------
teachers = []

for i in range(1,6):
    teachers.append(User.objects.create_user(f"cse_teacher{i}", password="test123", role="TEACHER", department=cse))

for i in range(1,5):
    teachers.append(User.objects.create_user(f"ece_teacher{i}", password="test123", role="TEACHER", department=ece))

for i in range(1,5):
    teachers.append(User.objects.create_user(f"me_teacher{i}", password="test123", role="TEACHER", department=me))


# -------- ROOMS --------
room_numbers = [
"A101","A102","A103","A104",
"B201","B202","B203","B204",
"C301","C302","C303","C304"
]

rooms = []
departments = [cse, ece, me]

for r in room_numbers:
    rooms.append(
        Room.objects.create(
            room_number=r,
            capacity=40,
            department=random.choice(departments)
        )
    )


# -------- SUBJECTS --------
subjects = []

subjects.append(Subject.objects.create(name="DBMS", department=cse))
subjects.append(Subject.objects.create(name="Operating Systems", department=cse))
subjects.append(Subject.objects.create(name="Data Structures", department=cse))

subjects.append(Subject.objects.create(name="Signals and Systems", department=ece))
subjects.append(Subject.objects.create(name="Digital Electronics", department=ece))

subjects.append(Subject.objects.create(name="Machine Design", department=me))
subjects.append(Subject.objects.create(name="Thermodynamics", department=me))
subjects.append(Subject.objects.create(name="Fluid Mechanics", department=me))
subjects.append(Subject.objects.create(name="Microprocessors", department=me))


# -------- SCHEDULE GENERATION --------
days = ["Monday","Tuesday","Wednesday","Thursday","Friday"]

slots = [
time(8,0),
time(9,0),
time(10,0),
time(11,0),
time(12,0),
time(13,0),
time(14,0),
time(15,0),
time(16,0)
]

for room in rooms:
    for day in days:
        for slot in slots:

            if slot == time(12,0):
                continue

            if random.random() > 0.55:
                continue

            teacher = random.choice(teachers)

            dept_subjects = [s for s in subjects if s.department == teacher.department]

            if not dept_subjects:
                continue

            subject = random.choice(dept_subjects)

            Schedule.objects.create(
                room=room,
                teacher=teacher,
                subject=subject,
                day=day,
                start_time=slot,
                end_time=time(slot.hour+1,0)
            )


print("Database seeded successfully")
print("Admin login:")
print("username: admin")
print("password: test123")