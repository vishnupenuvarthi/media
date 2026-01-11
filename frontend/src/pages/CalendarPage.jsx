import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateArray } from '@/utils/translator';
import { CalendarPDFViewer } from '@/components/home/CalendarPDFViewer';

const YEAR = 2026;
const DEFAULT_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const DEFAULT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildCalendarDays = (year, month) => {
  const start = dayjs(new Date(Date.UTC(year, month, 1)));
  const daysInMonth = start.daysInMonth();
  const startWeekday = start.day(); // 0 (Sunday) - 6 (Saturday)
  const days = [];

  for (let i = 0; i < startWeekday; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
};

export const CalendarPage = () => {
  const [month, setMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date(Date.UTC(YEAR, 0, 1))));
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'custom', location: '' });
  const { isAuthenticated } = useAuthStore();
  const language = useLanguageStore((state) => state.language);
  const monthLabels = translateArray(language, 'calendar.months');
  const dayLabels = translateArray(language, 'calendar.days');
  const monthsToRender = monthLabels.length ? monthLabels : DEFAULT_MONTHS;
  const daysToRender = dayLabels.length ? dayLabels : DEFAULT_DAYS;
  const t = (key, replacements) => translate(language, `calendar.${key}`, replacements);

  const { data: events = [], refetch, isLoading } = useQuery({
    queryKey: ['calendar-events', YEAR, month],
    queryFn: async () => {
      const { data } = await api.get('/calendar/events', { params: { year: YEAR, month: month + 1 } });
      return data;
    }
  });

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const key = dayjs(event.date).format('YYYY-MM-DD');
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const selectedKey = selectedDate.format('YYYY-MM-DD');
  const selectedEvents = eventsByDate[selectedKey] ?? [];

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDate(dayjs(new Date(Date.UTC(YEAR, month, day))));
    setEditingEvent(null);
    setForm({ title: '', description: '', category: 'custom', location: '' });
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setSelectedDate(dayjs(event.date));
    setForm({
      title: event.title,
      description: event.description ?? '',
      category: event.category ?? 'custom',
      location: event.location ?? ''
    });
  };

  const resetForm = () => {
    setEditingEvent(null);
    setForm({ title: '', description: '', category: 'custom', location: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    const payload = {
      ...form,
      date: selectedDate.toISOString()
    };
    if (editingEvent) {
      await api.put(`/calendar/events/${editingEvent.id}`, payload);
    } else {
      await api.post('/calendar/events', payload);
    }
    await refetch();
    resetForm();
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    await api.delete(`/calendar/events/${editingEvent.id}`);
    await refetch();
    resetForm();
  };

  const days = buildCalendarDays(YEAR, month);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{t('editorialPlanner')}</p>
        <h1 className="text-4xl font-serif">
          {t('heroTitle').replace('2026', YEAR)}
        </h1>
        <p className="text-gray-600">{t('liveDescription')}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {monthsToRender.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setMonth(idx);
              setSelectedDate(dayjs(new Date(Date.UTC(YEAR, idx, 1))));
              resetForm();
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              idx === month ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-7 text-center text-xs uppercase tracking-[0.4em] text-gray-400 mb-3">
            {daysToRender.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const currentKey =
                day !== null ? dayjs(new Date(Date.UTC(YEAR, month, day))).format('YYYY-MM-DD') : null;
              const dayEvents = currentKey ? eventsByDate[currentKey] ?? [] : [];
              const isSelected = currentKey === selectedKey;
              return (
                <button
                  type="button"
                  key={`${month}-${idx}`}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[90px] rounded-xl border text-left px-3 py-2 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  } ${day === null ? 'pointer-events-none bg-transparent border-none' : ''}`}
                >
                  {day && <span className="font-semibold">{day}</span>}
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded-md bg-secondary/10 text-secondary truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] text-gray-500">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{t('selectedDate')}</p>
            <h2 className="text-2xl font-serif">{selectedDate.format('dddd, MMMM D')}</h2>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{t('events')}</p>
            {isLoading && <p className="text-sm text-gray-500">{t('loading')}</p>}
            {!isLoading && selectedEvents.length === 0 && (
              <p className="text-sm text-gray-500">{t('noEvents')}</p>
            )}
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-xl border cursor-pointer ${
                    editingEvent?.id === event.id ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => startEdit(event)}
                >
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {event.category?.toUpperCase()} {event.location ? `· ${event.location}` : ''}
                  </p>
                  {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                {editingEvent ? t('update') : t('add')}
              </p>
              {editingEvent && (
                <button type="button" className="text-sm text-gray-500 underline" onClick={resetForm}>
                  {t('newEntry')}
                </button>
              )}
            </div>

            {!isAuthenticated ? (
              <p className="text-sm text-gray-500 mt-2">
                {t('signIn')}
              </p>
            ) : (
              <form onSubmit={handleSave} className="space-y-3 mt-3">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder={t('eventHeadline')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={t('detailsPlaceholder')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary"
                />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder={t('locationPlaceholder')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary"
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary"
                >
                  {['national', 'business', 'sports', 'culture', 'breaking', 'custom'].map((value) => (
                    <option key={value} value={value}>
                      {translate(language, `calendar.categories.${value}`)}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    {editingEvent ? t('updateEvent') : t('addEvent')}
                  </button>
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {t('deleteEvent')}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      </div>

      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Download Calendar PDF</h2>
        <CalendarPDFViewer />
      </div>
    </div >
  );
};

