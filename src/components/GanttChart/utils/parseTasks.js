import * as d3 from 'd3-time';

export const parseCSVData = (rows) => {
  const tasks = [];

  rows.forEach((row) => {
    const name = row['Название задачи'];
    const start = row['Дата начала'] ? new Date(row['Дата начала']) : null;
    const end = row['Дата конца'] ? new Date(row['Дата конца']) : null;
    const responsibles = row['Ответственные'] ? row['Ответственные'].split(',').map((s) => s.trim()) : [];

    // Новый способ - только через срок согласования
    const approvalDuration = row['Срок согласования'] ? parseInt(row['Срок согласования'], 10) : 0;

    if (!start || !end) {
      // Подзаголовок
      tasks.push({ name, level: 0 });
    } else {
      // Обычная задача
      tasks.push({ name, start, end, responsibles, level: 1 });

      // Добавляем согласование, если срок > 0
      if (approvalDuration && approvalDuration > 0) {
        const approvalStart = d3.timeDay.offset(end, 1);
        const approvalEnd = d3.timeDay.offset(approvalStart, approvalDuration - 1);
        tasks.push({
          name: `${name} - согласование`,
          start: approvalStart,
          end: approvalEnd,
          responsibles: ['MTC'],
          level: 2,
        });
      }
    }
  });

  return tasks;
};
