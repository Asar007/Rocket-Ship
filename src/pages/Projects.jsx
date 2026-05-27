import Seo from '../lib/seo.jsx'
import Projects from '../sections/Projects.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Fabrication Projects: Aerospace, Structural and Process Plant"
        description="Selected heavy fabrication projects: Gaganyaan Crew Training Simulator, SSLV simulators, structural erection and process plants delivered across India and export markets."
        path="/projects"
      />
      <Projects />
    </div>
  )
}
