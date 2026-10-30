import { BriefcaseBusiness, Building2, CalendarDays, Compass, Heart, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/jobs', label: 'Finn jobber', icon: BriefcaseBusiness },
  { to: '/companies', label: 'Bedrifter', icon: Building2 },
  { to: '/matches', label: 'Matcher', icon: Heart },
  { to: '/notodden', label: 'Min Notodden', icon: Compass },
  { to: '/profile', label: 'Profil', icon: UserRound },
]

export function Navigation() {
  return <>
    <aside className="desktop-nav">
      <NavLink to="/jobs" className="brand-lockup"><span className="brand-mark">S</span><span>Se til <b>Notodden</b></span></NavLink>
      <nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</nav>
      <NavLink to="/notodden" className="nav-calendar"><CalendarDays size={18} /><span><b>Kalender</b><small>Det skjer i byen</small></span></NavLink>
      <div className="nav-note"><span className="status-dot" /> Lokal prototype</div>
    </aside>
    <nav className="mobile-nav" aria-label="Hovedmeny">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} aria-label={label} className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}><Icon size={21} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</nav>
  </>
}