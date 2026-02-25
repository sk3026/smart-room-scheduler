const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["09:00", "10:00", "11:00", "12:00", "13:00"];

export function generateMatrix(scheduleData) {
  const matrix = {};

  days.forEach((day) => {
    matrix[day] = {};
    slots.forEach((slot) => {
      matrix[day][slot] = null;
    });
  });

  scheduleData.forEach((item) => {
    const time = item.start_time.slice(0, 5);

    if (matrix[item.day] && matrix[item.day][time] !== undefined) {
      matrix[item.day][time] = {
        id: item.id,
        teacher: item.teacher_name,
        subject: item.subject_name,
      };
    }
  });

  return { matrix, days, slots };
}