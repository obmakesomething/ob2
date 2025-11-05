import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useTaskStore } from '@/stores/useTaskStore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalendarView: React.FC = () => {
  const { tasks, setSelectedTask } = useTaskStore();

  const events = useMemo(() => {
    return tasks.map((task) => {
      const start = task.started_at
        ? new Date(task.started_at)
        : new Date(task.created_at);

      const end = task.completed_at
        ? new Date(task.completed_at)
        : task.ended_at
        ? new Date(task.ended_at)
        : new Date(start.getTime() + (task.estimated_duration || 30) * 60000);

      return {
        id: task.id,
        title: task.title,
        start,
        end,
        resource: task,
      };
    });
  }, [tasks]);

  const eventStyleGetter = (event: any) => {
    const task = event.resource;
    let backgroundColor = '#3b82f6';

    switch (task.priority) {
      case 'urgent':
        backgroundColor = '#ef4444';
        break;
      case 'high':
        backgroundColor = '#f97316';
        break;
      case 'medium':
        backgroundColor = '#eab308';
        break;
      case 'low':
        backgroundColor = '#3b82f6';
        break;
    }

    if (task.status === 'completed') {
      backgroundColor = '#10b981';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div className="animate-in">
      <h2 className="mb-4">Calendar View</h2>
      <div className="card" style={{ height: 'calc(100vh - 250px)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedTask(event.resource)}
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </div>
    </div>
  );
};
