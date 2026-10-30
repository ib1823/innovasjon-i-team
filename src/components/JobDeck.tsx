import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowDownUp, ArrowRight, BriefcaseBusiness, GraduationCap, Heart, MapPin, X } from 'lucide-react'
import type { Job } from '../data'

type Props = { jobs: Job[]; decided: string[]; onDecision: (job: Job, interested: boolean) => void; onDetails: (job: Job) => void; onRestart: () => void }

export function JobDeck({ jobs, decided, onDecision, onDetails, onRestart }: Props) {
  const [industry, setIndustry] = useState('Alle bransjer')
  const [type, setType] = useState('Alle typer')
  const [experience, setExperience] = useState('All erfaring')
  const [education, setEducation] = useState('All utdanning')
  const filtered = useMemo(() => jobs.filter((job) => (industry === 'Alle bransjer' || job.industry === industry) && (type === 'Alle typer' || job.type === type) && (experience === 'All erfaring' || job.experience === experience) && (education === 'All utdanning' || job.education === education) && !decided.includes(job.id)), [jobs, decided, industry, type, experience, education])
  const current = filtered[0]
  const processed = jobs.filter((job) => (industry === 'Alle bransjer' || job.industry === industry) && (type === 'Alle typer' || job.type === type) && (experience === 'All erfaring' || job.experience === experience) && (education === 'All utdanning' || job.education === education) && decided.includes(job.id)).length
  const total = filtered.length + processed
  const action = (liked: boolean) => { if (current) onDecision(current, liked) }

  return <div className="page-wrap jobs-page">
    <div className="page-heading jobs-heading"><div><span className="eyebrow">MULIGHETER NÆR DEG</span><h1>Finn jobben som <em>passer deg.</em></h1><p>Små steg kan føre til noe stort. Se hva Notodden har å by på.</p></div><div className="heading-count"><span>{filtered.length}</span><small>muligheter</small></div></div>
    <div className="filter-row">
      <label><span>Bransje</span><select value={industry} onChange={(event) => setIndustry(event.target.value)}><option>Alle bransjer</option>{[...new Set(jobs.map((job) => job.industry))].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Stillingstype</span><select value={type} onChange={(event) => setType(event.target.value)}><option>Alle typer</option>{[...new Set(jobs.map((job) => job.type))].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Erfaring</span><select value={experience} onChange={(event) => setExperience(event.target.value)}><option>All erfaring</option>{[...new Set(jobs.map((job) => job.experience))].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Utdanning</span><select value={education} onChange={(event) => setEducation(event.target.value)}><option>All utdanning</option>{[...new Set(jobs.map((job) => job.education))].map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <div className="deck-layout">
      <div className="deck-side-copy"><span className="side-line" /><p>Riktig mulighet kan finnes nærmere enn du tror.</p><span className="side-caption"><ArrowDownUp size={14} /> Dra kortet eller bruk knappene</span></div>
      <div className="deck-column">
        {current ? <>
          <div className="deck-progress"><span>JOBB {String(processed + 1).padStart(2, '0')}</span><div><i style={{ width: `${Math.min(((processed + 1) / total) * 100, 100)}%` }} /></div><span>AV {total}</span></div>
          <AnimatePresence mode="wait"><JobCard key={current.id} job={current} onDecision={action} onDetails={onDetails} /></AnimatePresence>
          <div className="swipe-controls"><button className="swipe-button reject" aria-label="Ikke interessert" onClick={() => action(false)}><X size={25} /></button><span>IKKE NÅ</span><button className="swipe-button like" aria-label="Vis interesse" onClick={() => action(true)}><Heart size={25} fill="currentColor" /></button></div>
        </> : <div className="empty-deck"><span className="empty-icon"><Heart size={30} /></span><span className="eyebrow">DU ER AJOUR</span><h2>Det var alle jobbene.</h2><p>Juster filtrene, eller start på nytt for å se mulighetene igjen.</p><button className="button button-dark" onClick={() => { setIndustry('Alle bransjer'); setType('Alle typer'); setExperience('All erfaring'); setEducation('All utdanning'); onRestart() }}>Se jobbene på nytt <ArrowRight size={17} /></button></div>}
      </div>
      <div className="deck-side-note"><span className="side-note-number">12</span><span>fiktive<br />muligheter</span><span className="side-note-rule" /><span>laget for<br />Notodden</span></div>
    </div>
  </div>
}

function JobCard({ job, onDecision, onDetails }: { job: Job; onDecision: (liked: boolean) => void; onDetails: (job: Job) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-9, 9])
  const likeOpacity = useTransform(x, [30, 120], [0, 1])
  const rejectOpacity = useTransform(x, [-120, -30], [1, 0])
  return <motion.article className="job-card" style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.82} onDragEnd={(_, info) => { if (info.offset.x > 105) onDecision(true); if (info.offset.x < -105) onDecision(false) }} initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: x.get() > 0 ? 260 : -260, rotate: x.get() > 0 ? 14 : -14, transition: { duration: .22 } }} transition={{ type: 'spring', stiffness: 280, damping: 26 }}>
    <div className="job-photo" style={{ backgroundImage: `linear-gradient(180deg,rgba(13,29,44,.03) 25%,rgba(13,29,44,.78) 100%),url(${job.image})` }}>
      <div className="job-photo-top"><span className="job-badge"><span className="status-dot" /> NY MULIGHET</span><span className="job-industry">{job.industry}</span></div>
      <motion.div className="swipe-stamp interested" style={{ opacity: likeOpacity }}>INTERESSERT</motion.div><motion.div className="swipe-stamp not-interested" style={{ opacity: rejectOpacity }}>IKKE INTERESSERT</motion.div>
      <div className="job-company"><span className="company-mark" style={{ background: job.color }}>{job.initials}</span><span>{job.company}</span></div>
    </div>
    <div className="job-content"><div className="job-title-row"><div><h2>{job.title}</h2><div className="job-meta"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.type}</span></div></div><div className="job-salary"><small>ÅRSLØNN</small><b>{job.salary}</b></div></div>
      <p className="job-description">{job.description}</p><div className="skill-list">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="job-card-bottom"><span className="education-tag"><GraduationCap size={15} />{job.education} <i /> {job.experience}</span><button className="text-action" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onDetails(job) }}>Mer om jobben <ArrowRight size={16} /></button></div>
    </div>
  </motion.article>
}