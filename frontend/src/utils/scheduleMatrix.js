const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const slots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
];

export function generateMatrix(scheduleData = []) {

  console.log("RAW SCHEDULE DATA:", scheduleData);

  const matrix = {};

  days.forEach((day) => {

    matrix[day] = {};

    slots.forEach((slot) => {

      matrix[day][slot] = null;

    });

  });

  scheduleData.forEach((item) => {

    if (!item.start_time) return;

    const time = item.start_time.slice(0,5);

    console.log("Processing schedule item:", item);

    if (matrix[item.day] && matrix[item.day][time] !== undefined) {

      matrix[item.day][time] = {

        id: item.id,

        teacher: item.teacher_name,
        subject: item.subject_name,

        teacher_id: item.teacher,
        subject_id: item.subject,

        department: item.department

      };

    }

  });

  console.log("FINAL MATRIX:", matrix);

  return { matrix, days, slots };

}