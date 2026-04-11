export function generateSchedule(classes, days, timeSlots) {
  const schedule = [];
  const occupied = {};

  for (const cls of classes) {
    let assigned = 0;
    let attempts = 0;
    while (assigned < cls.sessionsPerWeek && attempts < 200) {
      attempts++;
      const day = days[Math.floor(Math.random() * days.length)];
      const time =
        timeSlots[Math.floor(Math.random() * (timeSlots.length - 1))];
      const key = `${day}-${time}-${cls.room}`;
      const conflict = !!occupied[key];
      occupied[key] = true;
      schedule.push({
        id: `${cls.id}-${assigned}`,
        classId: cls.id,
        className: cls.name,
        subject: cls.subject,
        room: cls.room,
        day,
        time,
        duration: cls.duration,
        conflict,
      });
      assigned++;
    }
  }
  return schedule;
}