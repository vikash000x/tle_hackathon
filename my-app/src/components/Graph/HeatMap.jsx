import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const shiftDate = (date, numDays) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

export const HeatMap = ({ values, range }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .color-empty { fill: #f1f5f9; }
      .color-scale-1 { fill: #d1fae5; }
      .color-scale-2 { fill: #6ee7b7; }
      .color-scale-3 { fill: #34d399; }
      .color-scale-4 { fill: #059669; }
      .color-scale-5 { fill: #065f46; }
      .react-calendar-heatmap text {
        font-size: 7px;
        fill: #4b5563;
      }
      .react-calendar-heatmap rect {
        rx: 4;
        ry: 4;
        stroke: #e2e8f0;
        transition: fill 0.2s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  

  const classForValue = (value) => {
    if (!value || !value.count) return 'color-empty';
    if (value.count >= 8) return 'color-scale-5';
    if (value.count >= 6) return 'color-scale-4';
    if (value.count >= 4) return 'color-scale-3';
    if (value.count >= 2) return 'color-scale-2';
    return 'color-scale-1';
  };

  // 👇 Dynamic width based on range
  const getMinHeight = () => {
   
    if (range <= 90) return '400px';

  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📆 Activity in Last {range} Days</h3>
      <div style={{ ...styles.heatmapWrapper, height: getMinHeight() }}>
        <CalendarHeatmap
          startDate={shiftDate(new Date(), -range)}
          endDate={new Date()}
          values={values}
          classForValue={classForValue}
          tooltipDataAttrs={(value) =>
            value.date
              ? {
                  'data-tooltip-id': 'heatmap-tooltip',
                  'data-tooltip-content': `${value.date}: ${value.count} submission${
                    value.count > 1 ? 's' : ''
                  }`,
                }
              : undefined
          }
          showWeekdayLabels={false}
        />
      </div>
      <Tooltip id="heatmap-tooltip" place="top" />
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '100%',
    overflowX: 'auto',
    boxSizing: 'border-box',
  },
  heatmapWrapper: {
    overflowX: 'auto',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '10px',
  },
};
