import Seo from '../lib/seo.jsx'
import Customization from '../sections/Customization.jsx'
import CustomizationHero from '../sections/CustomizationHero.jsx'

export function Component() {
  return (
    <div className="pt-24 sm:pt-28">
      <Seo
        title="Custom Metal Fabrication & Contract Manufacturing"
        description="Custom metal fabrication and contract manufacturing in Chennai, built to your drawings, tolerances and timelines. Serving India and export markets."
        path="/customization"
      />
      <CustomizationHero />
      <Customization />
    </div>
  )
}
