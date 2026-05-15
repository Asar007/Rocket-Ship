import Seo from '../lib/seo.jsx'
import Customization from '../sections/Customization.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Customization"
        description="Bespoke fabrication and engineering — built to your drawings, tolerances and timelines. Madras Swastic Engineers, Chennai."
        path="/customization"
      />
      <Customization />
    </div>
  )
}
