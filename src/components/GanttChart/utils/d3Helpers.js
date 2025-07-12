import * as d3 from 'd3';
import { BAND_PADDING } from './constants';

export const makeScales = (tasks, rightWidth, chartHeight) => {
  // 1️⃣ Находим минимальную дату старта задач
  const rawMinDate = d3.min(tasks.filter(d => d.start), d => d.start);
  
  // 2️⃣ Корректируем её до ближайшего понедельника назад
  const minDate = d3.timeMonday.floor(rawMinDate);

  // 3️⃣ Аналогично находим максимальную дату конца
  const rawMaxDate = d3.max(tasks.filter(d => d.end), d => d.end);
  
  // 4️⃣ Чтобы захватить полный последний понедельник — сдвигаем на 1 неделю вперёд
  const maxDate = d3.timeMonday.offset(d3.timeMonday.ceil(rawMaxDate), 1);

  // 5️⃣ Строим масштаб времени (ось X)
  const x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, rightWidth]);

  // 6️⃣ Масштаб по вертикали (ось Y)
  const y = d3.scaleBand()
    .domain(tasks.map(d => d.name))
    .range([0, chartHeight])
    .padding(BAND_PADDING);

  return { x, y, minDate, maxDate };
};

export const wrapText = (textSelection, width) => {
  textSelection.each(function() {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1;
    const y = text.attr("y");
    const x = text.attr("x");
    const dy = 0;

    let tspan = text.text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", `${dy}em`);

    while (words.length > 0) {
      word = words.pop();
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${++lineNumber * lineHeight}em`)
          .text(word);
      }
    }
  });
};
