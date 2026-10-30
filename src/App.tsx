import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  companies,
  events,
  jobs,
  lifeSections,
  profileImage,
  type Company,
  type Job,
} from "./data";
import { Navigation } from "./components/Navigation";
import { JobDeck } from "./components/JobDeck";

type ModalContent =
  | { kind: "job"; item: Job }
  | { kind: "company"; item: Company }
  | { kind: "candidate"; item: Job }
  | { kind: "profile" }
  | { kind: "match"; item: Job };
type ChatMessage = { text: string; time: string; mine: boolean };
type ProfileData = {
  name: string;
  age: string;
  education: string;
  experience: string;
  skills: string;
  interests: string;
  target: string;
};
const defaultProfile: ProfileData = {
  name: "Emma Nilsen",
  age: "24",
  education: "Bachelor i markedsføring",
  experience: "Kommunikasjonsassistent · 6 måneder",
  skills: "Innholdsproduksjon, prosjektarbeid, sosiale medier",
  interests: "Friluft · Musikk · Formidling",
  target: "Kommunikasjon og prosjekt",
};
const storage = {
  read: (key: string, fallback: string[]) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") || fallback;
    } catch {
      return fallback;
    }
  },
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [interested, setInterested] = useState<string[]>(() =>
    storage.read("notodden-interested", []),
  );
  const [decided, setDecided] = useState<string[]>(() =>
    storage.read("notodden-decided", []),
  );
  const [matches, setMatches] = useState<string[]>(() =>
    storage.read("notodden-matches", []),
  );
  const [approved, setApproved] = useState<string[]>(() =>
    storage.read("notodden-approved", []),
  );
  const [rejected, setRejected] = useState<string[]>([]);
  const [employerView, setEmployerView] = useState(false);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [toast, setToast] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      return { ...defaultProfile, ...JSON.parse(localStorage.getItem("notodden-profile") || "null") };
    } catch {
      return defaultProfile;
    }
  });

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const decideJob = (job: Job, liked: boolean) => {
    setDecided((old) => {
      const next = [...new Set([...old, job.id])];
      localStorage.setItem("notodden-decided", JSON.stringify(next));
      return next;
    });
    if (liked)
      setInterested((old) => {
        const next = [...new Set([...old, job.id])];
        localStorage.setItem("notodden-interested", JSON.stringify(next));
        return next;
      });
    notify(
      liked ? `Interesse vist for ${job.company}` : "Jobben er hoppet over",
    );
  };
  const approveCandidate = (job: Job) => {
    setApproved((old) => {
      const next = [...new Set([...old, job.id])];
      localStorage.setItem("notodden-approved", JSON.stringify(next));
      return next;
    });
    setMatches((old) => {
      const next = [...new Set([...old, job.id])];
      localStorage.setItem("notodden-matches", JSON.stringify(next));
      return next;
    });
    setModal({ kind: "match", item: job });
  };
  const resetDemo = () => {
    [
      "notodden-interested",
      "notodden-decided",
      "notodden-matches",
      "notodden-approved",
      "notodden-profile",
    ].forEach((key) => localStorage.removeItem(key));
    setInterested([]);
    setDecided([]);
    setMatches([]);
    setApproved([]);
    setRejected([]);
    setChatMessages({});
    setProfile(defaultProfile);
    setEmployerView(false);
    setModal(null);
    navigate("/jobs");
    notify("Demonstrasjonen er nullstilt");
  };
  const isWelcome = location.pathname === "/";

  return (
    <div className="app-shell">
      {!isWelcome && <Navigation />}
      <main
        className={isWelcome ? "main-content welcome-main" : "main-content"}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Welcome />} />
            <Route
              path="/jobs"
              element={
                <PageTransition>
                  <JobDeck
                    jobs={jobs}
                    decided={decided}
                    onDecision={decideJob}
                    onDetails={(item) => setModal({ kind: "job", item })}
                    onRestart={() => {
                      setDecided([]);
                      localStorage.removeItem("notodden-decided");
                    }}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/companies"
              element={
                <PageTransition>
                  <CompaniesPage
                    onSelect={(item) => setModal({ kind: "company", item })}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/matches"
              element={
                <PageTransition>
                  <MatchesPage
                    interested={interested
                      .map((id) => jobs.find((job) => job.id === id))
                      .filter((job): job is Job => !!job)}
                    matches={matches}
                    employerView={employerView}
                    setEmployerView={setEmployerView}
                    approved={approved}
                    rejected={rejected}
                    onApprove={approveCandidate}
                    onReject={(id) =>
                      setRejected((old) => [...new Set([...old, id])])
                    }
                    onCandidate={(item) =>
                      setModal({ kind: "candidate", item })
                    }
                    onChat={() => navigate("/chat")}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/notodden"
              element={
                <PageTransition>
                  <NotoddenPage />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProfilePage
                    profile={profile}
                    onEdit={() => setModal({ kind: "profile" })}
                    onReset={resetDemo}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/chat"
              element={
                <PageTransition>
                  <ChatPage
                    matches={matches}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                    onBack={() => navigate("/matches")}
                    onToast={notify}
                  />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {modal && (
          <Modal
            key={modal.kind + ("item" in modal ? modal.item.id : "")}
            content={modal}
            profile={profile}
            onClose={() => setModal(null)}
            onCompanyInterest={() =>
              notify("Bedriften er lagt til i interessene dine")
            }
            onChat={() => {
              setModal(null);
              navigate("/chat");
            }}
            onSaveProfile={(value) => {
              setProfile(value);
              localStorage.setItem("notodden-profile", JSON.stringify(value));
              setModal(null);
              notify("Profilen din er oppdatert");
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <span className="toast-check">
              <Check size={15} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="route-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -7 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}

function Welcome() {
  return (
    <motion.section
      className="welcome-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="welcome-top">
        <Link to="/jobs" className="brand-lockup">
          <span className="brand-mark">S</span>
          <span>
            Se til <b>Notodden</b>
          </span>
        </Link>
        <span className="prototype-note">
          <span className="status-dot" /> En lokal jobbplattform
        </span>
      </header>
      <div className="welcome-grid">
        <div className="welcome-copy">
          <span className="eyebrow">NYE MULIGHETER. NÆR DEG.</span>
          <h1>
            Se til
            <br />
            <em>Notodden.</em>
          </h1>
          <p className="welcome-subtitle">Din fremtid starter her.</p>
          <p className="welcome-description">
            Oppdag jobbmuligheter, bli kjent med lokale bedrifter og utforsk
            livet i Notodden.
          </p>
          <div className="welcome-actions">
            <Link className="button button-dark" to="/jobs">
              Finn din neste jobb <ArrowRight size={17} />
            </Link>
            <Link className="button button-light" to="/notodden">
              Utforsk Notodden <ArrowRight size={17} />
            </Link>
          </div>
          <div className="welcome-footnote">
            <span className="avatar-stack">
              <i>✓</i>
              <i>+</i>
              <i>↗</i>
            </span>
            <span>
              En god framtid kan begynne
              <br />
              akkurat her.
            </span>
          </div>
        </div>
        <div className="welcome-visual">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1500&q=90"
            alt="Bylandskap i varmt kveldslys"
          />
          <div className="image-scrim" />
          <div className="welcome-image-caption">
            <span className="caption-pin">
              <MapPin size={15} />
            </span>
            <span>
              <b>Notodden</b>
              <small>Et sted å vokse</small>
            </span>
          </div>
          <div className="welcome-image-index">
            59°33' N <i /> 9°15' Ø
          </div>
          <div className="floating-card">
            <span className="floating-icon">
              <Sparkles size={16} />
            </span>
            <span>
              <b>Muligheter finnes her</b>
              <small>Finn din vei i lokalmiljøet</small>
            </span>
          </div>
        </div>
      </div>
      <footer className="welcome-footer">
        <span>NOTODDEN · TELEMARK</span>
        <span>EN PROTOTYPE FOR LOKALE MULIGHETER</span>
        <span>
          <span className="status-dot" /> ÅPEN FOR ALLE
        </span>
      </footer>
    </motion.section>
  );
}

function CompaniesPage({ onSelect }: { onSelect: (company: Company) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Alle bransjer");
  const categories = [
    "Alle bransjer",
    ...new Set(companies.map((company) => company.industry.split(" og ")[0])),
  ];
  const filtered = companies.filter(
    (company) =>
      (category === "Alle bransjer" || company.industry.startsWith(category)) &&
      `${company.name} ${company.industry} ${company.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FOLKENE BAK MULIGHETENE</span>
          <h1>
            Bedrifter med <em>lokal kraft.</em>
          </h1>
          <p>Bli kjent med arbeidsplassene som former Notodden.</p>
        </div>
        <span className="heading-count">
          <span>{companies.length}</span>
          <small>bedrifter</small>
        </span>
      </div>
      <div className="company-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            placeholder="Søk etter bedrift eller bransje"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SlidersHorizontal size={17} />
        </label>
        <div className="category-pills">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="company-grid">
        {filtered.map((company, index) => (
          <motion.button
            className="company-card"
            key={company.id}
            onClick={() => onSelect(company)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
          >
            <div
              className="company-photo"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(18,37,61,.03),rgba(18,37,61,.2)),url(${company.image})`,
              }}
            >
              <span className="company-open">
                ÅPNE PROFIL <ArrowRight size={14} />
              </span>
            </div>
            <div className="company-card-body">
              <span
                className="company-mark company-card-mark"
                style={{ background: company.color }}
              >
                {company.initials}
              </span>
              <div className="company-title">
                <span className="eyebrow">{company.industry}</span>
                <h2>{company.name}</h2>
                <span className="company-location">
                  <MapPin size={13} />
                  {company.location}
                </span>
              </div>
              <p>{company.description}</p>
              <div className="company-card-bottom">
                <span>{company.jobs.length} ledige eksempelstillinger</span>
                <span className="mini-arrow">
                  <ArrowRight size={17} />
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-inline">
          <Search size={23} />
          <h3>Ingen bedrifter fant veien hit.</h3>
          <p>Prøv et annet søk eller en annen kategori.</p>
        </div>
      )}
    </div>
  );
}

function MatchesPage({
  interested,
  matches,
  employerView,
  setEmployerView,
  approved,
  rejected,
  onApprove,
  onReject,
  onCandidate,
  onChat,
}: {
  interested: Job[];
  matches: string[];
  employerView: boolean;
  setEmployerView: (value: boolean) => void;
  approved: string[];
  rejected: string[];
  onApprove: (job: Job) => void;
  onReject: (id: string) => void;
  onCandidate: (job: Job) => void;
  onChat: () => void;
}) {
  const matchedJobs = interested.filter((job) => matches.includes(job.id));
  const pending = interested.filter(
    (job) => !approved.includes(job.id) && !rejected.includes(job.id),
  );
  return (
    <div className="page-wrap">
      <div className="page-heading matches-heading">
        <div>
          <span className="eyebrow">KOBLINGER MED MULIGHET</span>
          <h1>
            {employerView ? (
              <>
                Finn din <em>neste kollega.</em>
              </>
            ) : (
              <>
                Det begynner med <em>interesse.</em>
              </>
            )}
          </h1>
          <p>
            {employerView
              ? "Se hvem som er nysgjerrige på arbeidsplassen din."
              : "Interesse er første steg. Bedriften tar neste."}
          </p>
        </div>
        <button
          className={`view-toggle ${employerView ? "is-employer" : ""}`}
          onClick={() => setEmployerView(!employerView)}
        >
          <span className="toggle-knob" />
          <span>{employerView ? "Se som arbeidssøker" : "Se som bedrift"}</span>
          <ArrowRight size={15} />
        </button>
      </div>
      {!employerView ? (
        <>
          <div className="match-stats">
            <div>
              <span className="stat-icon stat-teal">
                <Heart size={17} />
              </span>
              <b>{interested.length}</b>
              <small>Interesse sendt</small>
            </div>
            <div>
              <span className="stat-icon stat-yellow">
                <Clock3 size={17} />
              </span>
              <b>{interested.length - matchedJobs.length}</b>
              <small>Venter på bedrift</small>
            </div>
            <div>
              <span className="stat-icon stat-green">
                <Sparkles size={17} />
              </span>
              <b>{matchedJobs.length}</b>
              <small>Match</small>
            </div>
          </div>
          {matchedJobs.length > 0 && (
            <section className="matches-section">
              <div className="section-title">
                <div>
                  <span className="eyebrow">NYE KOBLINGER</span>
                  <h2>Dette kan bli fint.</h2>
                </div>
                <span className="match-new">
                  {matchedJobs.length} MATCH
                  {matchedJobs.length === 1 ? "" : "ER"}
                </span>
              </div>
              <div className="match-grid">
                {matchedJobs.map((job) => (
                  <div className="match-card" key={job.id}>
                    <img src={job.image} alt="" />
                    <div className="match-card-body">
                      <span className="match-status">
                        <Sparkles size={13} /> DET ER EN MATCH
                      </span>
                      <h3>{job.company}</h3>
                      <p>{job.title}</p>
                      <button className="button button-dark" onClick={onChat}>
                        Start en samtale <MessageCircle size={16} />
                      </button>
                    </div>
                    <span
                      className="match-company-mark"
                      style={{ background: job.color }}
                    >
                      {job.initials}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="matches-section">
            <div className="section-title">
              <div>
                <span className="eyebrow">DIN LISTE</span>
                <h2>Interesser du har vist.</h2>
              </div>
            </div>
            {interested.length ? (
              <div className="interest-list">
                {interested.map((job) => (
                  <div className="interest-row" key={job.id}>
                    <span
                      className="company-mark"
                      style={{ background: job.color }}
                    >
                      {job.initials}
                    </span>
                    <span className="interest-company">
                      <b>{job.company}</b>
                      <small>{job.title}</small>
                    </span>
                    <span
                      className={`interest-state ${matches.includes(job.id) ? "state-match" : "state-waiting"}`}
                    >
                      <i />
                      {matches.includes(job.id) ? "Match" : "Venter på bedrift"}
                    </span>
                    <span className="interest-location">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-inline">
                <Heart size={25} />
                <h3>Her starter mulighetene.</h3>
                <p>Vis interesse for en jobb, så dukker den opp her.</p>
                <Link className="text-action" to="/jobs">
                  Se jobbene <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <div className="employer-banner">
            <span className="employer-banner-icon">
              <BriefcaseBusiness size={19} />
            </span>
            <span>
              <b>Bedriftsvisning · demonstrasjon</b>
              <small>
                Godkjenninger oppretter en synlig match hos arbeidssøkeren.
              </small>
            </span>
            <span className="status-dot" />
          </div>
          <div className="section-title candidate-title">
            <div>
              <span className="eyebrow">KANDIDATER SOM VENTER</span>
              <h2>Ta en nærmere titt.</h2>
            </div>
            <span className="candidate-counter">
              {pending.length} å vurdere
            </span>
          </div>
          {pending.length ? (
            <div className="candidate-grid">
              {pending.map((job, index) => (
                <motion.article
                  className="candidate-card"
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="candidate-avatar"
                    style={{ backgroundImage: `url(${profileImage})` }}
                  >
                    <span>NY KANDIDAT</span>
                  </div>
                  <div className="candidate-body">
                    <div className="candidate-name-row">
                      <div>
                        <h3>Emma Nilsen</h3>
                        <span>24 år · Notodden</span>
                      </div>
                      <span className="candidate-fit">GODT POTENSIAL</span>
                    </div>
                    <p>
                      Nyutdannet med et sterkt ønske om å bidra lokalt.
                      Nysgjerrig, lærevillig og klar for nye utfordringer.
                    </p>
                    <div className="candidate-chips">
                      <span>Kommunikasjon</span>
                      <span>Samarbeid</span>
                      <span>{job.education}</span>
                    </div>
                    <div className="candidate-role">
                      <span>
                        <b>Interessert i</b>
                        <small>
                          {job.title} · {job.company}
                        </small>
                      </span>
                      <button
                        className="candidate-profile-link"
                        onClick={() => onCandidate(job)}
                      >
                        Se profil <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="candidate-actions">
                      <button
                        className="candidate-decline"
                        onClick={() => onReject(job.id)}
                      >
                        <X size={15} />
                        Avslå
                      </button>
                      <button
                        className="candidate-approve"
                        onClick={() => onApprove(job)}
                      >
                        <Heart size={15} />
                        Godkjenn kandidat
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              <Check size={24} />
              <h3>Du er ajour med kandidatene.</h3>
              <p>Når noen viser interesse for en jobb, dukker de opp her.</p>
            </div>
          )}
          {!!rejected.length && (
            <p className="quiet-note">
              {rejected.length} kandidat{rejected.length === 1 ? " er" : "er"}{" "}
              avslått i denne demonstrasjonen.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function NotoddenPage() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [category, setCategory] = useState("Alle");
  const monthDate = new Date(2026, 9 + monthOffset, 1);
  const monthName = new Intl.DateTimeFormat("nb-NO", {
    month: "long",
    year: "numeric",
  }).format(monthDate);
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  const startDay =
    (new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay() + 6) %
    7;
  const monthEvents =
    monthOffset === 0
      ? events
      : events.map((item) => ({
          ...item,
          day: Math.min(item.day + monthOffset * 2, daysInMonth),
        }));
  const selectedEvents = monthEvents.filter(
    (item) =>
      (selectedDay ? item.day === selectedDay : true) &&
      (category === "Alle" || item.category === category),
  );
  return (
    <div className="page-wrap notodden-page">
      <section className="notodden-hero">
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=90"
          alt="Norsk natur og innsjø"
        />
        <div className="notodden-hero-overlay" />
        <div className="notodden-hero-copy">
          <span className="eyebrow">ET LIV MELLOM BY OG NATUR</span>
          <h1>
            Oppdag livet
            <br />i <em>Notodden.</em>
          </h1>
          <p>En ny hverdag kan være nærmere enn du tror.</p>
          <a className="button button-light" href="#livet">
            Utforsk stedet <ArrowRight size={16} />
          </a>
        </div>
        <span className="hero-coordinate">TELEMARK · 59°33' N</span>
        <div className="hero-index">
          <span>01</span>
          <i />
          06
        </div>
      </section>
      <section className="life-intro" id="livet">
        <span className="eyebrow">ET STED Å HØRE TIL</span>
        <h2>
          Plass til både
          <br />
          <em>ambisjoner og pust.</em>
        </h2>
        <p>
          Her er naturen nær, menneskene engasjerte og veien mellom jobb og
          fritid litt kortere.
        </p>
      </section>
      <div className="life-grid">
        {lifeSections.map((section, index) => (
          <motion.article
            className={`life-card life-card-${index + 1}`}
            key={section.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.04 }}
          >
            <img src={section.image} alt="" />
            <div className="life-card-shade" />
            <span className="life-label">{section.label}</span>
            <div className="life-card-copy">
              <span>0{index + 1} / 06</span>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
            <span className="life-card-arrow">
              <ArrowRight size={18} />
            </span>
          </motion.article>
        ))}
      </div>
      <section className="calendar-section" id="kalender">
        <div className="calendar-heading">
          <div>
            <span className="eyebrow">MØT FOLK. BLI MED.</span>
            <h2>
              Hva skjer i <em>Notodden?</em>
            </h2>
            <p>Små og store anledninger til å bli kjent med byen.</p>
          </div>
          <span className="example-note">
            <span className="status-dot" /> Alle arrangementer er eksempler
          </span>
        </div>
        <div className="calendar-layout">
          <div className="calendar-widget">
            <div className="calendar-month">
              <div>
                <CalendarDays size={18} />
                <b>{monthName}</b>
              </div>
              <div className="calendar-arrows">
                <button
                  aria-label="Forrige måned"
                  onClick={() => {
                    setMonthOffset((value) => value - 1);
                    setSelectedDay(null);
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  aria-label="Neste måned"
                  onClick={() => {
                    setMonthOffset((value) => value + 1);
                    setSelectedDay(null);
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              <div className="weekday-row">
                {["MA", "TI", "ON", "TO", "FR", "LØ", "SØ"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="day-grid">
                {Array.from({ length: startDay }, (_, index) => (
                  <span key={`empty-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1;
                  const eventOnDay = monthEvents.some(
                    (event) => event.day === day,
                  );
                  return (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDay(selectedDay === day ? null : day)
                      }
                      className={`${selectedDay === day ? "selected-day" : ""} ${eventOnDay ? "has-event" : ""}`}
                    >
                      {day}
                      {eventOnDay && <i />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="calendar-key">
              <i />
              Arrangementer <span>·</span> Trykk på en dato
            </div>
          </div>
          <div className="events-panel">
            <div className="events-top">
              <div>
                <span className="eyebrow">
                  {selectedDay ? `DATO ${selectedDay}.` : "KOMMENDE I BYEN"}
                </span>
                <h3>{selectedDay ? "På programmet" : "Sett av dagen."}</h3>
              </div>
              <select
                aria-label="Filtrer arrangementer"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {[
                  "Alle",
                  "Karriere",
                  "Nettverk",
                  "Kultur",
                  "Fritid",
                  "Student",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="event-list">
              {selectedEvents.map((event) => (
                <div className="event-item" key={`${event.title}-${event.day}`}>
                  <div className="event-date">
                    <b>{String(event.day).padStart(2, "0")}</b>
                    <span>
                      {new Intl.DateTimeFormat("nb-NO", { month: "short" })
                        .format(monthDate)
                        .replace(".", "")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="event-info">
                    <span
                      className={`event-category category-${event.category.toLowerCase()}`}
                    >
                      {event.category}
                    </span>
                    <b>{event.title}</b>
                    <small>
                      <Clock3 size={12} />
                      {event.time}
                      <i />
                      {event.place}
                    </small>
                  </div>
                  <button
                    aria-label={`Se ${event.title}`}
                    onClick={() => setSelectedDay(event.day)}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
              {!selectedEvents.length && (
                <div className="no-events">
                  Ingen arrangementer her ennå. Velg en annen dato eller
                  kategori.
                </div>
              )}
            </div>
            <div className="events-foot">
              <span>Eksempeldata · Ingen påmelding sendes</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePage({
  profile,
  onEdit,
  onReset,
}: {
  profile: ProfileData;
  onEdit: () => void;
  onReset: () => void;
}) {
  const [showCv, setShowCv] = useState(false);
  return (
    <div className="page-wrap profile-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DETTE ER DIN HISTORIE</span>
          <h1>
            Min <em>profil.</em>
          </h1>
          <p>En liten introduksjon til hva du kan og hvor du vil.</p>
        </div>
        <button className="button button-outline" onClick={onEdit}>
          <SlidersHorizontal size={16} /> Rediger profil
        </button>
      </div>
      <div className="profile-layout">
        <section className="profile-main">
          <div className="profile-cover">
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80"
              alt=""
            />
            <span>ARBEIDSSØKER · NOTODDEN</span>
          </div>
          <div className="profile-identity">
            <img src={profileImage} alt={`Profilbilde av ${profile.name}`} />
            <div>
              <h2>
                {profile.name} <span>{profile.age}</span>
              </h2>
              <p>
                <MapPin size={15} />
                Notodden · Åpen for muligheter
              </p>
            </div>
            <span className="profile-verified">
              <Check size={14} /> DEMOPROFIL
            </span>
          </div>
          <div className="profile-sections">
            <section>
              <span className="eyebrow">KORT OM MEG</span>
              <p>
                Jeg liker å finne gode løsninger sammen med andre. Nå ser jeg
                etter et sted der jeg kan utvikle meg, bidra fra dag én og bli
                en del av et lokalt fagmiljø.
              </p>
            </section>
            <div className="profile-info-grid">
              <div>
                <span className="eyebrow">UTDANNING</span>
                <b>{profile.education}</b>
                <small>Universitetet i Sørøst-Norge · 2024</small>
              </div>
              <div>
                <span className="eyebrow">ERFARING</span>
                <b>{profile.experience.split(" · ")[0]}</b>
                <small>{profile.experience.split(" · ").slice(1).join(" · ") || "Praksis"}</small>
              </div>
              <div>
                <span className="eyebrow">ØNSKET JOBB</span>
                <b>{profile.target}</b>
                <small>Gjerne lokalt og tverrfaglig</small>
              </div>
              <div>
                <span className="eyebrow">INTERESSER</span>
                <b>{profile.interests}</b>
                <small>Engasjert i lokalsamfunnet</small>
              </div>
            </div>
            <div className="profile-skills">
              <span className="eyebrow">KOMPETANSE</span>
              <div className="skill-list">
                {profile.skills.split(",").map((skill) => <span key={skill}>{skill.trim()}</span>)}
              </div>
            </div>
            <div className="profile-links">
              <button
                onClick={() =>
                  alert(
                    "Demonstrasjon: LinkedIn-integrasjon er ikke koblet til.",
                  )
                }
              >
                <span className="linkedin-icon">in</span>
                <span>
                  <b>LinkedIn</b>
                  <small>Demonstrasjon · ikke tilkoblet</small>
                </span>
                <ArrowRight size={16} />
              </button>
              <button onClick={() => setShowCv(!showCv)}>
                <span className="cv-icon">
                  <BriefcaseBusiness size={17} />
                </span>
                <span>
                  <b>CV · Emma_Nilsen_CV.pdf</b>
                  <small>
                    {showCv ? "Eksempel-CV åpnet" : "Vis eksempel-CV"}
                  </small>
                </span>
                {showCv ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
            {showCv && (
              <div className="cv-preview">
                <span className="cv-preview-icon">
                  <BriefcaseBusiness size={20} />
                </span>
                <span>
                  <b>{profile.name}</b>
                  <small>
                    {profile.education} · {profile.target}
                  </small>
                </span>
                <span className="cv-preview-tag">EKSEMPEL</span>
              </div>
            )}
          </div>
        </section>
        <aside className="profile-aside">
          <div className="completion-card">
            <div className="completion-top">
              <span className="eyebrow">PROFILFULLFØRING</span>
              <Award size={18} />
            </div>
            <div className="completion-number">
              82<span>%</span>
            </div>
            <div className="completion-track">
              <motion.i
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <p>
              Du har en fin profil. Legg til en kort intro for å gjøre den enda
              mer personlig.
            </p>
            <button className="text-action" onClick={onEdit}>
              Gjør profilen bedre <ArrowRight size={15} />
            </button>
          </div>
          <div className="profile-privacy">
            <span className="privacy-icon">
              <Check size={16} />
            </span>
            <span>
              <b>Kun en demonstrasjon</b>
              <small>
                Informasjonen er fiktiv og lagres bare lokalt i denne
                nettleseren.
              </small>
            </span>
          </div>
          <button className="reset-button" onClick={onReset}>
            <RotateCcw size={15} /> Nullstill demonstrasjonen
          </button>
          <Link className="profile-calendar-link" to="/notodden#kalender">
            <CalendarDays size={17} />
            <span>
              <b>Hva skjer i Notodden?</b>
              <small>Se arrangementer og treff</small>
            </span>
            <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function ChatPage({
  matches,
  messages,
  setMessages,
  onBack,
  onToast,
}: {
  matches: string[];
  messages: Record<string, ChatMessage[]>;
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, ChatMessage[]>>
  >;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const matchJob = jobs.find((job) => matches.includes(job.id));
  const [draft, setDraft] = useState("");
  const activeId = matchJob?.id || "sample-chat";
  const initial: ChatMessage[] = [
    {
      text: "Hei Emma! Så hyggelig at du viste interesse for oss. Vi likte profilen din og vil gjerne fortelle litt mer om teamet.",
      time: "I går, 14:32",
      mine: false,
    },
    {
      text: "Tusen takk, det høres veldig spennende ut! Jeg er nysgjerrig på hvordan en vanlig uke hos dere ser ut.",
      time: "I går, 15:04",
      mine: true,
    },
    {
      text: "Godt spørsmål. Vi tar gjerne en uformell prat og forteller mer.",
      time: "I går, 15:16",
      mine: false,
    },
  ];
  const thread = messages[activeId] || initial;
  const send = () => {
    if (!draft.trim()) return;
    setMessages((old) => ({
      ...old,
      [activeId]: [
        ...(old[activeId] || initial),
        {
          text: draft.trim(),
          time: new Date().toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mine: true,
        },
      ],
    }));
    setDraft("");
    onToast("Meldingen er lagt til i den lokale demonstrasjonen");
  };
  return (
    <div className="page-wrap chat-page">
      <div className="chat-topline">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Tilbake til matcher
        </button>
        <span className="prototype-note">
          <span className="status-dot" /> Kun lokal demonstrasjon
        </span>
      </div>
      <div className="chat-layout">
        <aside className="conversation-list">
          <div className="conversation-heading">
            <span className="eyebrow">INNBOKS</span>
            <h1>
              Samtaler<span>01</span>
            </h1>
          </div>
          <button className="conversation-item active">
            <span
              className="company-mark"
              style={{ background: matchJob?.color || "#317d77" }}
            >
              {matchJob?.initials || "NK"}
            </span>
            <span>
              <b>{matchJob?.company || "Notodden kommune"}</b>
              <small>{matchJob?.title || "Kommunikasjonsrådgiver"}</small>
            </span>
            <i />
          </button>
        </aside>
        <section className="chat-window">
          <div className="chat-contact">
            <span
              className="company-mark"
              style={{ background: matchJob?.color || "#317d77" }}
            >
              {matchJob?.initials || "NK"}
            </span>
            <span>
              <b>{matchJob?.company || "Notodden kommune"}</b>
              <small>
                <i /> Kari Hansen · kontaktperson
              </small>
            </span>
            <button
              aria-label="Mer informasjon"
              onClick={() => onToast("Samtalen er en visuell demonstrasjon")}
            >
              <span>⋯</span>
            </button>
          </div>
          <div className="match-chat-banner">
            <span className="match-banner-spark">
              <Sparkles size={16} />
            </span>
            <span>
              <b>Det er en match!</b>
              <small>Interessen er gjensidig. Ta den første praten.</small>
            </span>
            <span>↗</span>
          </div>
          <div className="chat-messages">
            <span className="chat-day-divider">I GÅR</span>
            {thread.map((message, index) => (
              <div
                className={`message-row ${message.mine ? "mine" : ""}`}
                key={`${message.time}-${index}`}
              >
                <div className="message-bubble">
                  {message.text}
                  <small>{message.time}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-demo-note">
            Dette er en lokal demonstrasjon. Meldinger sendes ikke til ekte
            mottakere.
          </div>
          <div className="chat-compose">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send();
              }}
              placeholder="Skriv en melding..."
            />
            <button
              aria-label="Send melding"
              disabled={!draft.trim()}
              onClick={send}
            >
              <Send size={17} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Modal({
  content,
  profile,
  onClose,
  onCompanyInterest,
  onChat,
  onSaveProfile,
}: {
  content: ModalContent;
  profile: ProfileData;
  onClose: () => void;
  onCompanyInterest: (id: string) => void;
  onChat: () => void;
  onSaveProfile: (value: ProfileData) => void;
}) {
  const [form, setForm] = useState(profile);
  const [interested, setInterested] = useState(false);
  const editField = (field: keyof typeof form, value: string) =>
    setForm((old) => ({ ...old, [field]: value }));
  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className={`modal-panel ${content.kind === "profile" ? "profile-modal" : ""}`}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
      >
        <button className="modal-close" aria-label="Lukk" onClick={onClose}>
          <X size={19} />
        </button>
        {content.kind === "job" && (
          <>
            <div
              className="modal-hero"
              style={{
                backgroundImage: `linear-gradient(180deg,transparent 30%,rgba(15,35,51,.7)),url(${content.item.image})`,
              }}
            >
              <span
                className="company-mark"
                style={{ background: content.item.color }}
              >
                {content.item.initials}
              </span>
              <span>{content.item.company}</span>
            </div>
            <div className="modal-content">
              <span className="eyebrow">
                {content.item.industry} · {content.item.type}
              </span>
              <h2>{content.item.title}</h2>
              <div className="job-meta">
                <span>
                  <MapPin size={14} />
                  {content.item.location}
                </span>
                <span>{content.item.salary}</span>
              </div>
              <p>{content.item.description}</p>
              <h4>Dette ser vi etter</h4>
              <div className="skill-list">
                {content.item.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <button
                className="button button-dark modal-primary"
                onClick={onClose}
              >
                Tilbake til jobbene <ArrowLeft size={16} />
              </button>
            </div>
          </>
        )}
        {content.kind === "company" && (
          <>
            <div
              className="modal-hero"
              style={{
                backgroundImage: `linear-gradient(180deg,transparent 30%,rgba(15,35,51,.7)),url(${content.item.image})`,
              }}
            >
              <span
                className="company-mark"
                style={{ background: content.item.color }}
              >
                {content.item.initials}
              </span>
              <span>{content.item.industry}</span>
            </div>
            <div className="modal-content">
              <span className="eyebrow">{content.item.location}</span>
              <h2>{content.item.name}</h2>
              <p>{content.item.description}</p>
              <h4>Kompetanse vi ser etter</h4>
              <div className="skill-list">
                {content.item.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <h4>Ledige eksempelstillinger</h4>
              <div className="modal-job-list">
                {content.item.jobs.map((title) => (
                  <span key={title}>
                    <BriefcaseBusiness size={15} />
                    {title}
                    <ArrowRight size={14} />
                  </span>
                ))}
              </div>
              <button
                className={`button ${interested ? "button-success" : "button-dark"} modal-primary`}
                onClick={() => {
                  if (!interested) {
                    onCompanyInterest(content.item.id);
                    setInterested(true);
                  }
                }}
              >
                {interested ? (
                  <>
                    <Check size={16} /> Interesse registrert
                  </>
                ) : (
                  <>
                    Jeg er interessert i denne bedriften <Heart size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
        {content.kind === "candidate" && (
          <div className="modal-content candidate-profile-modal">
            <img
              className="candidate-profile-image"
              src={profileImage}
              alt="Emma Nilsen"
            />
            <span className="eyebrow">KANDIDATPROFIL · EKSEMPEL</span>
            <h2>Emma Nilsen, 24</h2>
            <p>
              Nyutdannet med et sterkt ønske om å bidra lokalt. Nysgjerrig,
              lærevillig og klar for nye utfordringer.
            </p>
            <div className="candidate-detail">
              <span>UTDANNING</span>
              <b>Bachelor i markedsføring</b>
              <small>Universitetet i Sørøst-Norge · 2024</small>
            </div>
            <div className="candidate-detail">
              <span>ERFARING</span>
              <b>Kommunikasjonsassistent</b>
              <small>Praksis · 6 måneder</small>
            </div>
            <div className="candidate-detail">
              <span>INTERESSERT I</span>
              <b>{content.item.title}</b>
              <small>{content.item.company}</small>
            </div>
            <div className="skill-list">
              <span>Innholdsproduksjon</span>
              <span>Prosjektarbeid</span>
              <span>Formidling</span>
            </div>
            <span className="demo-footnote">
              Profilen er fiktiv og vises kun i demonstrasjonen.
            </span>
          </div>
        )}
        {content.kind === "profile" && (
          <div className="modal-content edit-profile-content">
            <span className="eyebrow">DIN PROFIL · DEMONSTRASJON</span>
            <h2>Fortell litt om deg.</h2>
            <p>Endringene vises i denne demoen og sendes ingen steder.</p>
            <label>
              Navn
              <input
                value={form.name}
                onChange={(event) => editField("name", event.target.value)}
              />
            </label>
            <label>
              Alder
              <input
                value={form.age}
                onChange={(event) => editField("age", event.target.value)}
              />
            </label>
            <label>
              Utdanning
              <input
                value={form.education}
                onChange={(event) => editField("education", event.target.value)}
              />
            </label>
            <label>
              Arbeidserfaring
              <input
                value={form.experience}
                onChange={(event) =>
                  editField("experience", event.target.value)
                }
              />
            </label>
            <label>
              Kompetanse
              <input
                value={form.skills}
                onChange={(event) => editField("skills", event.target.value)}
              />
            </label>
            <label>
              Interesser
              <input
                value={form.interests}
                onChange={(event) => editField("interests", event.target.value)}
              />
            </label>
            <label>
              Ønsket jobb
              <input
                value={form.target}
                onChange={(event) => editField("target", event.target.value)}
              />
            </label>
            <button
              className="button button-dark modal-primary"
              onClick={() => onSaveProfile(form)}
            >
              Lagre endringer <Check size={16} />
            </button>
          </div>
        )}
        {content.kind === "match" && (
          <div className="match-modal-content">
            <motion.div
              className="match-burst"
              initial={{ scale: 0.2, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12 }}
            >
              <Heart size={36} fill="currentColor" />
            </motion.div>
            <span className="eyebrow">GJENSIDIG INTERESSE</span>
            <h2>
              DET ER EN
              <br />
              <em>MATCH!</em>
            </h2>
            <div className="match-modal-company">
              <span
                className="company-mark"
                style={{ background: content.item.color }}
              >
                {content.item.initials}
              </span>
              <span>
                <b>{content.item.company}</b>
                <small>{content.item.title}</small>
              </span>
              <span className="check-orbit">
                <Check size={15} />
              </span>
            </div>
            <p>
              Bedriften vil gjerne bli bedre kjent med deg. Ta den første
              praten.
            </p>
            <button
              className="button button-dark modal-primary"
              onClick={onChat}
            >
              Åpne samtalen <MessageCircle size={16} />
            </button>
            <button className="match-later" onClick={onClose}>
              Senere
            </button>
            <span className="demo-footnote">
              Simulert match · ingen søknad eller melding er sendt
            </span>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
