const sampleTasks = [
  { index: 1, name: 'Разработка платформы', level: 0 },

  {
    index: 2,
    name: 'Проработка логики',
    level: 1,
    start: new Date('2025-07-01'),
    end: new Date('2025-07-05'),
    responsibles: ['Deep'],
  },

  {
    index: 3,
    name: 'Детализация механик',
    level: 1,
    start: new Date('2025-07-07'),
    end: new Date('2025-07-10'),
    responsibles: ['Deep'],
    approval: {
      start: new Date('2025-07-11'),
      end: new Date('2025-07-15'),
      responsibles: ['MTC'],
      duration: 5,
    },
  },

  { index: 4, name: 'Дизайн платформы', level: 0 },

  {
    index: 5,
    name: 'Разработка визуального стиля',
    level: 1,
    start: new Date('2025-07-12'),
    end: new Date('2025-07-18'),
    responsibles: ['Deep'],
    approval: {
      start: new Date('2025-07-19'),
      end: new Date('2025-07-20'),
      responsibles: ['MTC'],
      duration: 2,
    },
  },

  {
    index: 6,
    name: 'Верстка экранов',
    level: 1,
    start: new Date('2025-07-19'),
    end: new Date('2025-07-24'),
    responsibles: ['Deep'],
    approval: {
      start: new Date('2025-07-25'),
      end: new Date('2025-07-27'),
      responsibles: ['MTC'],
      duration: 3,
    },
  },

  { index: 7, name: 'Тексты для платформы', level: 0 },

  {
    index: 8,
    name: 'Написание текстов',
    level: 1,
    start: new Date('2025-07-25'),
    end: new Date('2025-07-30'),
    responsibles: ['Deep'],
    approval: {
      start: new Date('2025-07-31'),
      end: new Date('2025-08-03'),
      responsibles: ['MTC'],
      duration: 4,
    },
  },

  { index: 9, name: 'Подготовка e-mail шаблонов', level: 0 },

  {
    index: 10,
    name: 'Дизайн e-mail',
    level: 1,
    start: new Date('2025-07-31'),
    end: new Date('2025-08-03'),
    responsibles: ['Deep'],
  },

  { index: 11, name: 'Программирование', level: 0 },

  {
    index: 12,
    name: 'Backend часть',
    level: 1,
    start: new Date('2025-08-04'),
    end: new Date('2025-08-10'),
    responsibles: ['Deep'],
    approval: {
      start: new Date('2025-08-11'),
      end: new Date('2025-08-12'),
      responsibles: ['MTC'],
      duration: 2,
    },
  },

  {
    index: 13,
    name: 'Frontend часть',
    level: 1,
    start: new Date('2025-08-11'),
    end: new Date('2025-08-16'),
    responsibles: ['Deep'],
  },

  { index: 14, name: 'Тестирование', level: 0 },

  {
    index: 15,
    name: 'Финальное тестирование',
    level: 1,
    start: new Date('2025-08-17'),
    end: new Date('2025-08-20'),
    responsibles: ['Deep'],
  },
];

export default sampleTasks;
