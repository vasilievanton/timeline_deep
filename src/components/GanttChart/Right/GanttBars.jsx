import * as d3 from 'd3'; // Импортируем библиотеку d3 для рисования SVG
import { timeDay } from 'd3-time'; // Утилита для округления дат по дням
import { RESPONSIBLE_COLORS } from '../utils/constants'; // Константы с цветами исполнителей

/**
 * GanttBars - рендерит все "блоки задач" на диаграмме
 * @param g - D3 selection группы в SVG, куда рисовать
 * @param x - шкала времени по X
 * @param y - шкала по задачам по Y
 * @param tasks - массив задач
 * @param theme - MUI тема для цветов
 * @param onEdit - функция обработки клика на задаче
 */
const GanttBars = (g, x, y, tasks, theme, onEdit) => {
  const minTextWidth = 80; // Минимальная ширина для рисования текста прямо на баре

  // Фильтруем задачи: исключаем заголовки (level 0) и те у которых нет дат
  const filteredTasks = tasks.filter(d => d.level !== 0 && d.start && d.end);

  // Создаем группу для каждой задачи
  const taskGroups = g
    .selectAll('.task-bar-group')         // выбираем все группы задач
    .data(filteredTasks)                   // связываем данные
    .enter()                               // для новых элементов
    .append('g')                           // добавляем группу <g>
    .attr('class', 'task-bar-group')       // задаем класс для стилей
    .attr('transform', (d) => {
      // === Вычисляем положение X и Y для группы ===

      // Y позиция — центрируем бар по вертикали в ячейке сетки
      const yPos = y(d.name) + (y.step() - (d.level === 2 ? y.bandwidth() * 0.6 : y.bandwidth())) / 2;
      // X позиция — начало дня, округленное вниз
      const xPos = x(timeDay.floor(d.start));

      return `translate(${xPos}, ${yPos})`; // итоговый атрибут transform
    });

  // === Для каждой группы задачи ===
  taskGroups
    .each(function (d) {
      const group = d3.select(this); // текущая группа

      // --- Вычисляем координаты и размеры блока ---
      const startDate = timeDay.floor(d.start);
      const endDate = timeDay.offset(timeDay.floor(d.end), 1); // делаем бар включительно по конец дня

      // Вычисляем ширину блока по шкале X
      const barWidth = Math.max(2, x(endDate) - x(startDate)); // минимальная ширина = 2

      // Высота блока — чуть меньше для level 2 (например, согласование)
      const barHeight = d.level === 2
        ? y.bandwidth() * 0.6
        : y.bandwidth();

      // === Добавляем прямоугольник блока ===
      group
        .append('rect')
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', d.responsibles && d.responsibles.length
          ? (RESPONSIBLE_COLORS[d.responsibles[0]] || RESPONSIBLE_COLORS.Default)(theme)
          : RESPONSIBLE_COLORS.Default(theme))
        .attr('rx', 4) // скругление углов
        .attr('ry', 4)
        .attr('opacity', d.level === 2 ? 0.6 : 1) // полупрозрачность для согласования
        .on('mouseover', function () {
          // Показываем текст при наведении
          group.selectAll('.hover-text, .hover-bg')
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', function () {
          // Скрываем текст при уходе мыши
          group.selectAll('.hover-text, .hover-bg')
            .transition().duration(200)
            .style('opacity', 0);
        })
        .on('click', () => onEdit && onEdit(d)); // При клике вызываем коллбек редактирования

      // --- Подготавливаем текст даты ---
      const label = `${d3.timeFormat('%d.%m')(d.start)} - ${d3.timeFormat('%d.%m')(d.end)}`;

      // === Если блок длинный — текст внутри ===
      if (barWidth >= minTextWidth) {
        group
          .append('text')
          .attr('class', 'hover-text')
          .text(label)
          .attr('x', barWidth / 2)              // по центру X
          .attr('y', barHeight / 2 + 4)         // по центру Y
          .style('text-anchor', 'middle')       // центрирование
          .style('font', '12px sans-serif')
          .style('fill', theme.palette.common.white)
          .style('pointer-events', 'none')      // мышь проходит сквозь текст
          .style('opacity', 0);                  // по умолчанию скрыт
      } else {
        // === Если блок короткий — показываем всплывашку сверху ===
        const bgHeight = 20;
        const bgWidth = 90;

        // Подложка
        group
          .append('rect')
          .attr('class', 'hover-bg')
          .attr('x', (barWidth - bgWidth) / 2)
          .attr('y', -bgHeight - 5)
          .attr('width', bgWidth)
          .attr('height', bgHeight)
          .attr('fill', theme.palette.grey[800])
          .attr('rx', 4)
          .attr('ry', 4)
          .style('opacity', 0);

        // Текст поверх подложки
        group
          .append('text')
          .attr('class', 'hover-text')
          .text(label)
          .attr('x', barWidth / 2)
          .attr('y', -bgHeight / 2 - 5 + 6)
          .style('text-anchor', 'middle')
          .style('font', '12px sans-serif')
          .style('fill', theme.palette.common.white)
          .style('pointer-events', 'none')
          .style('opacity', 0);
      }
    });
};

export default GanttBars;
