import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

function ResizeIcon({ active }) {
  return <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={active ? 'M3 8h5V3M8 8 2 2m15 10h-5v5m0-5 6 6' : 'M12 3h5v5m0-5-6 6M8 17H3v-5m0 5 6-6'} /></svg>;
}

/** Stable panels keep their mounted forms and calendar as the grid rearranges. */
export default function Bento({ panels, kind = 'mission' }) {
  const root = useRef(null);
  const before = useRef(new Map());
  const returnTo = useRef(null);
  const calendarScroll = useRef(0);
  const [expanded, setExpanded] = useState(null);
  function change(index) {
    if (index === expanded || !root.current) return;
    before.current = new Map([...root.current.querySelectorAll('[data-panel]')].map(el => [el.dataset.panel, el.getBoundingClientRect()]));
    if (expanded === null) calendarScroll.current = root.current.querySelector('[data-hourly-calendar]')?.scrollTop ?? 0;
    returnTo.current = index ?? expanded;
    setExpanded(index);
  }
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const animations = [];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const panel of el.querySelectorAll('[data-panel]')) {
        const from = before.current.get(panel.dataset.panel);
        const to = panel.getBoundingClientRect();
        if (from && from.width && from.height && to.width && to.height) animations.push(panel.animate([
          { transformOrigin: 'top left', transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})` },
          { transformOrigin: 'top left', transform: 'none' },
        ], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' }));
      }
    }
    before.current.clear();
    if (returnTo.current !== null) {
      el.querySelector(`[data-control="${returnTo.current}"]`)?.focus({ preventScroll: true });
      if (expanded === null) {
        const calendar = el.querySelector('[data-hourly-calendar]');
        if (calendar) calendar.scrollTop = calendarScroll.current;
      }
    }
    return () => animations.forEach(animation => animation.cancel());
  }, [expanded]);
  useEffect(() => {
    const el = root.current;
    function escape(event) {
      if (event.key === 'Escape' && expanded !== null && !event.defaultPrevented && !document.querySelector('dialog[open]')) {
        event.preventDefault(); change(null);
      }
    }
    el?.addEventListener('keydown', escape);
    return () => el?.removeEventListener('keydown', escape);
  });
  return <div ref={root} className={`bento ${kind}`} data-expanded={expanded !== null || undefined} style={{ '--support-rows': panels.length - 1 }}>
    {panels.map((panel, index) => {
      const active = index === expanded;
      const supporting = expanded !== null && !active;
      const overview = kind === 'mission' && expanded === null;
      return <section className="panel" data-panel={index} data-active={active || undefined} data-supporting={supporting || undefined} key={panel.title} aria-label={panel.title}>
        <header className="panel-heading"><h2>{panel.title}</h2><button className="resize" data-control={index} aria-expanded={active} aria-label={`${active ? 'Minimize' : 'Expand'} ${panel.title}`} onClick={() => change(active ? null : index)}>{active ? 'Minimize' : 'Expand'}<ResizeIcon active={active} /></button></header>
        {(supporting || overview) && <div className="panel-summary">{panel.summary}</div>}
        <div className="panel-body" hidden={supporting || overview}>{panel.content}</div>
      </section>;
    })}
  </div>;
}
