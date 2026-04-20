// ── Konstanta Waktu ──────────────────────────────────────────

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

// Slot waktu 45 menit, skip istirahat
export const TIME_SLOTS = [
  { slot: 1, start: "07:00", end: "07:45" },
  { slot: 2, start: "07:45", end: "08:30" },
  { slot: 3, start: "08:30", end: "09:15" },
  // Istirahat 09:15 - 10:00 (skip)
  { slot: 4, start: "10:00", end: "10:45" },
  { slot: 5, start: "10:45", end: "11:30" },
  { slot: 6, start: "11:30", end: "12:15" },
  // Ishoma 12:15 - 13:00 (skip)
  { slot: 7, start: "13:00", end: "13:45" },
  { slot: 8, start: "13:45", end: "14:30" },
];

// Mata pelajaran yang butuh double period
const DOUBLE_PERIOD_KEYWORDS = [
  "olahraga", "pjok", "prakarya", "lab", "praktikum",
  "seni", "tik", "komputer", "kimia lab", "biologi lab", "fisika lab",
];

export function isDoublePeriod(subjectName) {
  const lower = subjectName.toLowerCase();
  return DOUBLE_PERIOD_KEYWORDS.some((k) => lower.includes(k));
}

// ── Generator Utama ──────────────────────────────────────────

/**
 * generateSchedule
 *
 * @param {Array} classes   - [{ id, name, grade }] misal [{id:'1', name:'X-A', grade:10}]
 * @param {Array} teachers  - [{ id, name, subjects:[{subjectId, hoursPerWeek}] }]
 * @param {Array} subjects  - [{ id, name }]
 * @returns {Array} schedules - array jadwal yang siap disimpan ke Firestore
 */
export function generateSchedule(input, additional = {}) {
  const classes = Array.isArray(input) ? input : input?.classes ?? [];
  const days = Array.isArray(input) ? additional.days || DAYS : input?.days || DAYS;
  const timeSlots = Array.isArray(input)
    ? additional.timeSlots || TIME_SLOTS
    : input?.timeSlots || TIME_SLOTS;

  if (!Array.isArray(input)) {
    // legacy advanced schedule generation using teachers/subjects
    const teachers = input?.teachers || [];
    const subjects = input?.subjects || [];

    const subjectMap = new Map(subjects.map((s) => [s.id, s]));
    const tasks = [];

    // Track target hours per assignment
    const assignmentHours = new Map();

    for (const teacher of teachers) {
      for (const assignment of teacher.subjects || []) {
        const subject = subjectMap.get(assignment.subjectId);
        if (!subject) continue;

        const double = isDoublePeriod(subject.name);
        const hoursPerWeek = assignment.hoursPerWeek ?? 2;

        for (const classId of assignment.classIds || []) {
          const cls = classes.find((c) => c.id === classId);
          if (!cls) continue;

          const assignmentKey = `${teacher.id}_${assignment.subjectId}_${classId}`;
          assignmentHours.set(assignmentKey, {
            teacherId: teacher.id,
            subjectId: assignment.subjectId,
            classId,
            targetHours: hoursPerWeek,
            allocatedHours: 0,
            tasks: [],
          });

          const sessionsNeeded = double
            ? Math.ceil(hoursPerWeek / 2)
            : hoursPerWeek;

          for (let i = 0; i < sessionsNeeded; i++) {
            const task = {
              teacherId:   teacher.id,
              teacherName: teacher.name,
              subjectId:   subject.id,
              subjectName: subject.name,
              classId:     cls.id,
              className:   cls.name,
              grade:       cls.grade,
              room:        cls.room || "R-101",
              double,
              assignmentKey,
              hoursValue: double ? 2 : 1,
            };
            tasks.push(task);
            assignmentHours.get(assignmentKey).tasks.push(task);
          }
        }
      }
    }

    shuffleArray(tasks);

    const teacherBusy = new Map();
    const classBusy = new Map();
    const result = [];
    const unscheduled = [];

    // ──────────────────────────────────────────────────────────
    // PASS 1: Normal Placement (fill greedily)
    // ──────────────────────────────────────────────────────────
    const taskQueue = [...tasks];
    const maxAttemptsPerTask = 3;
    const taskAttempts = new Map();

    for (const day of days) {
      for (let attempt = 0; attempt < 50; attempt++) {
        let madeProgress = false;

        for (let i = 0; i < taskQueue.length; i++) {
          const task = taskQueue[i];
          const attempts = taskAttempts.get(i) || 0;

          if (attempts >= maxAttemptsPerTask) continue;

          const placed = tryPlaceTask(task, day, teacherBusy, classBusy, result, timeSlots);
          if (placed) {
            const assignKey = task.assignmentKey;
            if (assignmentHours.has(assignKey)) {
              const assign = assignmentHours.get(assignKey);
              assign.allocatedHours += task.hoursValue;
            }
            taskQueue.splice(i, 1);
            madeProgress = true;
            break;
          } else {
            taskAttempts.set(i, attempts + 1);
          }
        }

        if (!madeProgress) break;
      }
    }

    // ──────────────────────────────────────────────────────────
    // PASS 2: Check under-allocated assignments
    // ──────────────────────────────────────────────────────────
    const underAllocated = [];
    for (const [key, assign] of assignmentHours) {
      const shortage = assign.targetHours - assign.allocatedHours;
      if (shortage > 0) {
        underAllocated.push({
          key,
          shortage,
          ...assign,
        });
      }
    }

    // Sort by shortage (highest first) for priority placement
    underAllocated.sort((a, b) => b.shortage - a.shortage);

    // ──────────────────────────────────────────────────────────
    // PASS 3: Force-fill under-allocated with priority
    // ──────────────────────────────────────────────────────────
    for (const underAssign of underAllocated) {
      // Try to place remaining tasks for this assignment
      for (const task of underAssign.tasks) {
        if (result.some((r) => r.teacherId === task.teacherId &&
                              r.subjectId === task.subjectId &&
                              r.classId === task.classId)) {
          continue; // Already placed
        }

        // Try all days with a bit more flexibility
        const daysToTry = shuffled([...days]);
        let placed = false;

        for (const day of daysToTry) {
          if (tryPlaceTask(task, day, teacherBusy, classBusy, result, timeSlots)) {
            underAssign.allocatedHours += task.hoursValue;
            placed = true;
            break;
          }
        }

        if (!placed) {
          unscheduled.push(task);
        }
      }
    }

    // Collect remaining unscheduled tasks
    for (const task of taskQueue) {
      const alreadyScheduled = result.some(
        (r) => r.teacherId === task.teacherId &&
               r.subjectId === task.subjectId &&
               r.classId === task.classId
      );
      if (!alreadyScheduled) {
        unscheduled.push(task);
      }
    }

    return { schedules: result, unscheduled };
  }

  // Simple schedule generator for class-only input.
  const result = [];
  const roomBusy = new Set();
  const classBusy = new Set();
  const invalidBoundaries = new Set([2, 5]);

  const sortedClasses = [...classes].sort(
    (a, b) => (b.sessionsPerWeek || 0) - (a.sessionsPerWeek || 0),
  );

  const canPlace = (day, startIndex, slotCount, room, classId) => {
    if (startIndex + slotCount > timeSlots.length) return false;

    for (let offset = 0; offset < slotCount; offset += 1) {
      const index = startIndex + offset;
      if (index > 0 && invalidBoundaries.has(index - 1)) return false;
      const slot = timeSlots[index];
      if (classBusy.has(`${classId}_${day}_${slot.slot}`)) return false;
      if (roomBusy.has(`${room}_${day}_${slot.slot}`)) return false;
    }

    return true;
  };

  const markBusy = (day, startIndex, slotCount, room, classId) => {
    for (let offset = 0; offset < slotCount; offset += 1) {
      const slot = timeSlots[startIndex + offset];
      classBusy.add(`${classId}_${day}_${slot.slot}`);
      roomBusy.add(`${room}_${day}_${slot.slot}`);
    }
  };

  const buildEntry = (cls, day, startIndex, slotCount) => {
    const usedSlots = timeSlots.slice(startIndex, startIndex + slotCount);
    return {
      id: `${cls.id}-${day}-${startIndex}`,
      classId: cls.id,
      className: cls.name || "-",
      subject: cls.subject || "-",
      room: cls.room || "R-101",
      day,
      time: `${usedSlots[0].start} - ${usedSlots[usedSlots.length - 1].end}`,
      duration: slotCount * 45,
      conflict: false,
    };
  };

  for (const cls of sortedClasses) {
    const sessionsPerWeek = Math.max(1, cls.sessionsPerWeek || 1);
    const slotCount = Math.max(1, Math.ceil((cls.duration || 45) / 45));

    for (let session = 0; session < sessionsPerWeek; session += 1) {
      let placed = false;

      for (const day of days) {
        for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex += 1) {
          if (!canPlace(day, slotIndex, slotCount, cls.room, cls.id)) continue;

          markBusy(day, slotIndex, slotCount, cls.room, cls.id);
          result.push(buildEntry(cls, day, slotIndex, slotCount));
          placed = true;
          break;
        }
        if (placed) break;
      }

      if (!placed) {
        result.push({
          id: `${cls.id}-unscheduled-${session}`,
          classId: cls.id,
          className: cls.name || "-",
          subject: cls.subject || "-",
          room: cls.room || "R-101",
          day: "Belum terjadwal",
          time: "-",
          duration: slotCount * 45,
          conflict: true,
        });
      }
    }
  }

  return result;
}

// ── Penempatan Tugas ─────────────────────────────────────────

function tryPlaceTask(task, dayOrTeacherBusy, classBusyOrDay, resultOrTimeSlots, resultOrUndefined, timeSlots) {
  // Support both old signature (task, teacherBusy, classBusy, result) and new (task, day, teacherBusy, classBusy, result, timeSlots)
  let day, teacherBusy, classBusy, result, slots;
  
  if (typeof dayOrTeacherBusy === 'string') {
    // New signature: (task, day, teacherBusy, classBusy, result, timeSlots)
    day = dayOrTeacherBusy;
    teacherBusy = classBusyOrDay;
    classBusy = resultOrTimeSlots;
    result = resultOrUndefined;
    slots = timeSlots || TIME_SLOTS;
  } else {
    // Old signature: (task, teacherBusy, classBusy, result)
    teacherBusy = dayOrTeacherBusy;
    classBusy = classBusyOrDay;
    result = resultOrTimeSlots;
    slots = TIME_SLOTS;
    // Try all days
    const days  = shuffled([...DAYS]);
    for (const tryDay of days) {
      if (attemptPlaceOnDay(task, tryDay, teacherBusy, classBusy, result, slots)) {
        return true;
      }
    }
    return false;
  }

  // New signature: only try specific day
  return attemptPlaceOnDay(task, day, teacherBusy, classBusy, result, slots);
}

function attemptPlaceOnDay(task, day, teacherBusy, classBusy, result, timeSlots) {
  const slots = shuffled([...timeSlots]);

  for (const slotObj of slots) {
    const slot = slotObj.slot;

    if (task.double) {
      // Double period: butuh slot N dan N+1 berturut-turut
      const nextSlotObj = timeSlots.find((s) => s.slot === slot + 1);
      if (!nextSlotObj) continue;

      // Pastikan slot 1 dan slot 2 tidak bentrok
      if (
        isFree(teacherBusy, task.teacherId, day, slot) &&
        isFree(teacherBusy, task.teacherId, day, slot + 1) &&
        isFree(classBusy,   task.classId,   day, slot) &&
        isFree(classBusy,   task.classId,   day, slot + 1)
      ) {
        // Tandai keduanya sebagai terpakai
        markBusy(teacherBusy, task.teacherId, day, slot);
        markBusy(teacherBusy, task.teacherId, day, slot + 1);
        markBusy(classBusy,   task.classId,   day, slot);
        markBusy(classBusy,   task.classId,   day, slot + 1);

        result.push(buildEntry(task, day, slotObj, nextSlotObj, task.room));
        return true;
      }
    } else {
      // Single period
      if (
        isFree(teacherBusy, task.teacherId, day, slot) &&
        isFree(classBusy,   task.classId,   day, slot)
      ) {
        markBusy(teacherBusy, task.teacherId, day, slot);
        markBusy(classBusy,   task.classId,   day, slot);

        result.push(buildEntry(task, day, slotObj, null, task.room));
        return true;
      }
    }
  }

  return false; // tidak ada slot kosong di hari ini
}

// ── Helpers ──────────────────────────────────────────────────

function isFree(map, id, day, slot) {
  return !map.has(`${id}_${day}_${slot}`);
}

function markBusy(map, id, day, slot) {
  map.set(`${id}_${day}_${slot}`, true);
}

function buildEntry(task, day, slot1, slot2, room) {
  return {
    teacherId:   task.teacherId,
    teacherName: task.teacherName,
    subjectId:   task.subjectId,
    subjectName: task.subjectName,
    classId:     task.classId,
    className:   task.className,
    grade:       task.grade,
    room:        room || "R-101",
    day,
    slot:        slot1.slot,
    startTime:   slot1.start,
    endTime:     slot2 ? slot2.end : slot1.end,
    double:      task.double,
    time:        slot2
      ? `${slot1.start} - ${slot2.end}`
      : `${slot1.start} - ${slot1.end}`,
  };
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffled(arr) {
  return shuffleArray([...arr]);
}