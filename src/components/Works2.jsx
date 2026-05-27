import { useRef, useState } from 'react'
import './Works.css'
import './Works2.css'
import ProjectDrawer from './ProjectDrawer.jsx'
import { projects } from '../data.js'

function Project({ project, onOpen }) {
  const { name, description, roles, team, images, comingSoon } = project
  const pillRef = useRef(null)
  const [pillVisible, setPillVisible] = useState(false)

  const movePill = (clientX, clientY) => {
    const pill = pillRef.current
    if (!pill) return
    pill.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
  }

  const onImageEnter = (e) => {
    if (e.pointerType !== 'mouse') return
    setPillVisible(true)
    movePill(e.clientX, e.clientY)
  }

  const onImageMove = (e) => {
    if (e.pointerType !== 'mouse') return
    movePill(e.clientX, e.clientY)
  }

  const onImageLeave = () => setPillVisible(false)

  const openDrawer = (e) => {
    e?.preventDefault?.()
    if (comingSoon) return
    onOpen()
  }

  return (
    <article className={`project${comingSoon ? ' project--soon' : ''}`}>
      {comingSoon && (
        <span className="project__ribbon" aria-label="case study coming soon">
          Coming Soon
        </span>
      )}
      <h2 className="project__title" data-reveal>
        {name}
      </h2>

      <div className="project__grid">
        {images.map((src, i) => (
          <div key={i} className="project__tile-frame" data-reveal-card>
            <figure
              className="project__tile"
              onClick={openDrawer}
              onPointerEnter={onImageEnter}
              onPointerMove={onImageMove}
              onPointerLeave={onImageLeave}
            >
              <img
                src={src}
                alt={`${name} ${i + 1}`}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </figure>
          </div>
        ))}
      </div>

      <div className="project__info" data-reveal-stagger>
        <div className="info-block">
          <span className="info-block__label">Project</span>
          <p className="info-block__text">{description}</p>
        </div>
        <div className="info-block">
          <span className="info-block__label">Role</span>
          <ul className="info-block__list">
            {roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="info-block">
          <span className="info-block__label">Team</span>
          <ul className="info-block__list">
            {team.map((t) => (
              <li key={t.name}>
                {t.name} ({t.role})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span
        ref={pillRef}
        className={`project__cursor ${
          pillVisible ? 'project__cursor--visible' : ''
        }`}
        aria-hidden="true"
      >
        {comingSoon ? 'Coming Soon' : 'Open'}
      </span>
    </article>
  )
}

export default function Works2() {
  const [openIndex, setOpenIndex] = useState(null)
  const openProject = openIndex !== null ? projects[openIndex] : null

  return (
    <section className="works works--grid" id="work">
      {projects.map((p, i) => (
        <Project key={p.name} project={p} onOpen={() => setOpenIndex(i)} />
      ))}
      <ProjectDrawer
        project={openProject}
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  )
}
