from django.core.management.base import BaseCommand
from schedules.models import Schedule
from rooms.models import Room
from users.models import User
from subjects.models import Subject
from datetime import time
import random


class Command(BaseCommand):

    help = "Generate random room schedules (60% filled)"

    def handle(self, *args, **kwargs):

        print("Deleting previous schedules...")

        old = Schedule.objects.count()
        Schedule.objects.all().delete()

        print(f"Deleted {old} schedules")

        rooms = list(Room.objects.all())
        teachers = list(User.objects.filter(role="TEACHER"))
        subjects = list(Subject.objects.all())

        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ]

        slots = [
            (9,10),
            (10,11),
            (11,12),

            # lunch break

            (13,14),
            (14,15),
            (15,16),
            (16,17)
        ]

        created = 0
        vacant = 0

        # track teacher busy slots
        teacher_busy = {}

        for day in days:
            for s in slots:

                teacher_busy[(day, s[0])] = set()

        for room in rooms:
            for day in days:
                for s in slots:

                    key = (day, s[0])

                    # 60% fill probability
                    if random.random() > 0.6:
                        vacant += 1
                        continue

                    # available teachers
                    available_teachers = [
                        t for t in teachers
                        if t.id not in teacher_busy[key]
                    ]

                    if not available_teachers:
                        vacant += 1
                        continue

                    teacher = random.choice(available_teachers)
                    subject = random.choice(subjects)

                    Schedule.objects.create(
                        room=room,
                        teacher=teacher,
                        subject=subject,
                        day=day,
                        start_time=time(s[0],0),
                        end_time=time(s[1],0)
                    )

                    teacher_busy[key].add(teacher.id)

                    created += 1

        print("Schedule generation complete")
        print("-----------------------------")
        print("Schedules created:", created)
        print("Vacant slots:", vacant)