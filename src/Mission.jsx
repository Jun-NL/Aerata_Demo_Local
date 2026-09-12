import React, { useState } from 'react';
import Bento from './Bento.jsx';

function Facts({ values }) { return <dl className="facts">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not supplied'}</dd></div>)}</dl>; }

export default function Mission({ mission, onSave }) {
  const [draft, setDraft] = useState(mission ?? { title: '', objective: '', deliverable: '', client: '', site: '', work: '', service: '', operation: '', start: '', end: '', area: '', controls: '', pilot: '', observer: '', aircraft: '', payload: '', notes: '' });
  const [error, setError] = useState('');
  const field = (key, label, type = 'text') => <label className={type === 'textarea' ? 'wide' : ''}>{label}{type === 'textarea' ? <textarea value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} rows={3} /> : <input type={type} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />}</label>;
  function save() {
    if (!draft.title.trim()) { setError('Enter a mission name.'); return; }
    if (draft.start && draft.end && draft.end <= draft.start) { setError('The end must be later than the start.'); return; }
    setError(''); onSave({ ...draft, title: draft.title.trim(), id: draft.id || crypto.randomUUID() });
  }
  return <section className="page mission-page"><header className="page-heading"><div><p className="eyebrow">Mission draft</p><h1>{draft.title || 'New mission'}</h1></div><div className="actions"><a className="button" href="#/operations">Back to Missions</a><button className="primary" onClick={save}>Save local draft</button></div></header>{error && <p role="alert" className="error">{error}</p>}<Bento panels={[
    { title: 'Definition', summary: <Facts values={[["Objective", draft.objective], ["Service", draft.service], ["Window", draft.start ? draft.start.replace('T', ' ') : 'Not scheduled']]} />, content: <><h3>Mission definition</h3><div className="form-grid">{field('title', 'Mission name')}{field('client', 'Client')}{field('site', 'Site')}{field('work', 'Work')}{field('objective', 'Objective', 'textarea')}{field('service', 'Service')}{field('operation', 'Operation type')}{field('deliverable', 'Deliverable', 'textarea')}{field('start', 'Window start', 'datetime-local')}{field('end', 'Window end', 'datetime-local')}</div><p className="muted">Times use {Intl.DateTimeFormat().resolvedOptions().timeZone}.</p></> },
    { title: 'Area & airspace', summary: <Facts values={[["Operating area", draft.area || 'Not attached'], ["Airspace", 'Not assessed']]} />, content: <><h3>Area & airspace</h3><div className="form-grid">{field('area', 'Operating area')}{field('controls', 'Operating controls', 'textarea')}</div><p className="muted">Airspace and applicability are not assessed in this preview.</p></> },
    { title: 'Crew & assets', summary: <Facts values={[["Pilot in command", draft.pilot], ["Observer", draft.observer], ["Aircraft", draft.aircraft], ["Payload", draft.payload]]} />, content: <><h3>Crew & assets</h3><div className="form-grid">{field('pilot', 'Pilot in command')}{field('observer', 'Observer')}{field('aircraft', 'Aircraft')}{field('payload', 'Payload')}</div><p className="muted">Eligibility is not assessed.</p></> },
    { title: 'Documents & release', summary: <Facts values={[["Documents", 'None attached'], ["Release", 'Not assessed']]} />, content: <><h3>Documents & release</h3><Facts values={[["Required document", 'Not attached'], ["Prepared bundle", 'Not prepared'], ["Release", 'Not assessed']]} /><div className="form-grid">{field('notes', 'Notes', 'textarea')}</div><p className="muted">Document storage and release review are not connected.</p></> },
  ]} /></section>;
}
