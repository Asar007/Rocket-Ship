import Seo from '../lib/seo.jsx'
import Projects from '../sections/Projects.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Our Projects"
        description="Selected structural fabrication, mechanical erection and turnkey delivery projects for energy, refinery and manufacturing clients across India."
        path="/projects"
      />
      <Projects />
    </div>
  )
}
