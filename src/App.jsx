import React, { useEffect, useState } from 'react';
import Today from './Today.jsx';
import Mission from './Mission.jsx';

const navigation = [
  ['/','Today'], ['/operations','Missions'], ['/clients-work','Clients & Work'],
  ['/people-fleet','People & Fleet'], ['/safety-compliance','Safety & Compliance'],
  ['/commercial','Commercial'], ['/administration','Administration'],
];
const registers = {
  '/clients-work': { title: 'Clients & Work', tabs: ['Clients', 'Work'], nouns: ['client', 'Work record'], lists: ['Client register', 'Work register'], searches: ['Search clients, regions, and work', 'Search Work records'] },
  '/people-fleet': { title: 'People & Fleet', tabs: ['People', 'Fleet'], nouns: ['person', 'asset'], lists: ['People register', 'Fleet register'], searches: ['Search people and operational roles', 'Search fleet'] },
  '/safety-compliance': { title: 'Safety & Compliance', tabs: ['Incidents', 'Checklists', 'Manuals', 'Compliance dossier'], nouns: ['incident', 'checklist', 'manual', 'dossier'], lists: ['Incidents', 'Checklists', 'Manuals', 'Compliance dossier'], searches: ['Search incidents', 'Search checklists', 'Search manuals', 'Search dossiers'] },
  '/commercial': { title: 'Commercial', tabs: ['Quotes'], nouns: ['quote'], lists: ['Quote worklist'], searches: ['Search quotes'] },
};

function Register({ config }) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  return <section className="page register-page"><header className="page-heading"><h1>{config.title}</h1></header>
    <div className="register-tools">{config.tabs.length > 1 && <div className="tabs" role="tablist" aria-label={config.title}>{config.tabs.map((name, index) => <button key={name} id={`tab-${index}`} role="tab" aria-selected={tab === index} aria-controls="record-panels" onClick={() => { setTab(index); setSearch(''); }}>{name}</button>)}</div>}
    <label className="search">{config.searches[tab]}<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label><span className="record-count">0 records</span></div>
    <div id="record-panels" className="master-detail" role={config.tabs.length > 1 ? 'tabpanel' : undefined} aria-labelledby={config.tabs.length > 1 ? `tab-${tab}` : undefined}>
      <section className="panel register-list" aria-label={config.lists[tab]}><h2>{config.lists[tab]}</h2><div className="empty"><h3>{search ? 'No matching records' : 'No records yet'}</h3><p>This preview starts with an empty register.</p></div></section>
      <section className="panel detail" aria-label="Selected record"><div className="empty"><h3>Select a {config.nouns[tab]}</h3><p>Its contents will appear here when records are available.</p></div></section>
    </div>
  </section>;
}

function Missions({ missions }) {
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState('All lifecycles');
  const [readiness, setReadiness] = useState('All readiness states');
  const [schedule, setSchedule] = useState('All dates');
  const filtered = missions.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) && ['All lifecycles', 'Draft'].includes(lifecycle) && ['All readiness states', 'Not assessed'].includes(readiness) && (schedule === 'All dates' || (m.start && new Date(m.start) >= new Date() && new Date(m.start) - new Date() <= 30 * 86400000)));
  return <section className="page register-page"><header className="page-heading"><h1>Missions</h1><a href="#/operations/new" className="button primary">New mission</a></header><div className="panel filter-toolbar"><div className="search-row"><input aria-label="Search missions" type="search" placeholder="Search missions" value={search} onChange={e => setSearch(e.target.value)} /><span className="record-count">{filtered.length} missions</span></div><div className="filters">{[['Readiness', readiness, setReadiness, ['All readiness states', 'Not assessed']], ['Lifecycle', lifecycle, setLifecycle, ['All lifecycles', 'Draft']], ['Schedule', schedule, setSchedule, ['All dates', 'Next 30 days']]].map(([label, value, setter, options]) => <label key={label}>{label}<select value={value} onChange={e => setter(e.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></label>)}</div></div>
    <section className="panel mission-register" aria-label="Mission register"><div className="table-heading"><span>Mission</span><span>Schedule</span><span>Lifecycle</span><span>Readiness</span></div>{filtered.length ? filtered.map(m => <a className="mission-row" href={`#/operations/${m.id}`} key={m.id}><strong>{m.title}</strong><span>{m.start ? new Date(m.start).toLocaleString() : 'Not scheduled'}</span><span>Draft</span><span>Not assessed</span></a>) : <div className="empty"><h3>{search || missions.length ? 'No matching missions' : 'No missions yet'}</h3><p>Create a blank mission to review its workspace.</p><a className="button" href="#/operations/new">New mission</a></div>}</section>
  </section>;
}

function Administration() {
  return <section className="page"><header className="page-heading"><h1>Administration</h1></header><div className="admin-grid"><section className="panel"><h2>Organization</h2><dl className="facts"><div><dt>Organization name</dt><dd>Not configured</dd></div><div><dt>Timezone</dt><dd>{Intl.DateTimeFormat().resolvedOptions().timeZone}</dd></div></dl></section><section className="panel"><h2>Account details</h2><div className="empty"><h3>Admin</h3></div></section><section className="panel"><h2>Role access</h2><p className="muted">Roles and permissions are not connected.</p></section></div></section>;
}

export default function App() {
  const [path, setPath] = useState(() => location.hash.slice(1) || '/');
  const [missions, setMissions] = useState([]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const navigate = () => setPath(location.hash.slice(1) || '/');
    window.addEventListener('hashchange', navigate);
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => { window.removeEventListener('hashchange', navigate); clearInterval(tick); };
  }, []);
  const rootPath = `/${path.split('/')[1] || ''}`;
  const title = navigation.find(([url]) => url === rootPath)?.[1] || 'Page not found';
  useEffect(() => { document.title = `${title} · Aerata preview`; document.querySelector('main h1')?.focus({ preventScroll: true }); }, [path, title]);
  function saveMission(mission) {
    setMissions(records => [...records.filter(record => record.id !== mission.id), mission]);
    location.hash = `/operations/${mission.id}`;
  }
  let content;
  if (path === '/') content = <Today missions={missions} now={now} />;
  else if (path === '/operations') content = <Missions missions={missions} />;
  else if (path.startsWith('/operations/')) {
    const id = path.split('/')[2];
    const mission = missions.find(m => m.id === id);
    content = id === 'new' || mission ? <Mission key={id} mission={mission} onSave={saveMission} /> : <section className="page"><h1>Mission unavailable</h1><p>Local drafts are cleared when this page reloads.</p><a href="#/operations">Back to Missions</a></section>;
  } else if (registers[path]) content = <Register key={path} config={registers[path]} />;
  else if (path === '/administration') content = <Administration />;
  else content = <section className="page"><h1>Page not found</h1><a href="#/">Back to Today</a></section>;
  return <><a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content').focus(); }}>Skip to content</a><div className="shell"><aside className="rail"><a className="brand" href="#/">AERATA</a><nav aria-label="Main navigation">{navigation.map(([url, name]) => <a href={`#${url}`} key={url} aria-current={rootPath === url ? 'page' : undefined}>{name}</a>)}</nav></aside><div className="workspace"><header className="topbar"><span>{now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })} · {Intl.DateTimeFormat().resolvedOptions().timeZone}</span><span className="context-label">{title}</span><a className="reviewer" href="#/administration">Admin</a></header><main id="main-content" tabIndex={-1}>{content}</main></div></div></>;
}
