import React, { useLayoutEffect, useRef } from 'react';
import Bento from './Bento.jsx';

export const dayLabel = date => date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const time = date => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function Today({ missions, now }) {
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const scheduled = missions.filter(m => m.start && m.end);
  const todayEvents = scheduled.filter(m => sameDay(new Date(m.start), now));
  const tomorrowEvents = scheduled.filter(m => sameDay(new Date(m.start), tomorrow));
  const scroller = useRef(null);
  useLayoutEffect(() => { if (scroller.current) scroller.current.scrollTop = Math.max(0, now.getHours() - 1) * 40; }, []);
  const agenda = (label, date, records) => <section className="agenda"><header><h3>{label}</h3><span>{dayLabel(date)}</span></header>{records.length ? records.map(m => <a key={m.id} href={`#/operations/${m.id}`}><time>{time(new Date(m.start))}–{time(new Date(m.end))}</time><strong>{m.title}</strong></a>) : <p className="muted">No missions scheduled.</p>}</section>;
  return <section className="page today-page"><header className="page-heading"><div><h1>Today</h1><p>{now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div><a className="button" href="#/operations">All missions</a></header><Bento kind="today" panels={[
    { title: 'Preparation', summary: <p>{missions.length ? `${missions.length} local drafts. Readiness not assessed.` : 'No mission data available.'}</p>, content: <><p className="eyebrow">Next 48 hours</p>{missions.length ? missions.filter(m => !m.start || (new Date(m.start) >= now && new Date(m.start) - now <= 48 * 3600000)).map(m => <div className="list-row" key={m.id}><a href={`#/operations/${m.id}`}>{m.title}</a><span className="muted">Readiness not assessed</span></div>) : <div className="empty"><h3>No missions to prepare</h3><p>Mission drafts will appear here.</p><a href="#/operations/new">Create a mission</a></div>}</> },
    { title: 'Operational exceptions', summary: <p>No exception data available.</p>, content: <div className="empty"><h3>No exception data</h3><p>Operational sources are not connected.</p></div> },
    { title: 'Daily schedule', summary: <><p className="muted">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>{agenda('Today', now, todayEvents)}{agenda('Tomorrow', tomorrow, tomorrowEvents)}</>, content: <div className="schedule"><p className="timezone">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p><header className="day-heading"><h3>Today</h3><span>{dayLabel(now)}</span></header><div className="hourly" data-hourly-calendar tabIndex={0} role="region" aria-label="Today's hourly calendar" ref={scroller}><div className="timeline">{Array.from({ length: 24 }, (_, hour) => <div className="hour" key={hour} style={{ top: hour * 40 }}><time>{String(hour).padStart(2, '0')}:00</time></div>)}{todayEvents.map(m => { const start = new Date(m.start); const end = new Date(m.end); return <a key={m.id} className="calendar-event" href={`#/operations/${m.id}`} style={{ top: (start.getHours() + start.getMinutes() / 60) * 40, minHeight: Math.max(40, (end - start) / 3600000 * 40) }}>{time(start)}–{time(end)}<strong>{m.title}</strong></a>; })}<div className="now-line" style={{ top: (now.getHours() + now.getMinutes() / 60) * 40 }}><time>{time(now)}</time></div></div></div>{agenda('Tomorrow', tomorrow, tomorrowEvents)}</div> },
  ]} /></section>;
}
