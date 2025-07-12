// parseTasks.js

export const parseCSVData = (rows) => {
  return rows
    .filter(row => row['Название задачи'])
    .map((row, index) => {
      const approvalDuration = parseInt(row['Срок согласования'], 10);
      return {
        index,
        name: row['Название задачи'],
        start: row['Дата начала'] ? new Date(row['Дата начала']) : null,
        end: row['Дата конца'] ? new Date(row['Дата конца']) : null,
        responsibles: row['Ответственные']
          ? row['Ответственные'].split(';').map((s) => s.trim()).filter(Boolean)
          : [],
        approvalDuration: isNaN(approvalDuration) ? 0 : approvalDuration,
        level: 1
      };
    });
};
