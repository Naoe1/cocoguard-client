import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export const PlantingGuide = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Coconut Planting Guide
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>4.2 Farm Planning and Production Site Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            A production site map should be prepared to show the condition of
            the farm or how the farm is intended to be developed. It should
            indicate the topography and the locations of the following:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Coconut production area (density, coconut spacing, variety,
              distance from markets);
            </li>
            <li>Primary processing area;</li>
            <li>Intercrops and livestock areas (if applicable);</li>
            <li>
              Sources of water used on the farm (well, reservoir, rivers, lakes,
              farm ponds, etc.);
            </li>
            <li>
              Chemical pesticides and fertilizer storage and mixing areas;
            </li>
            <li>Tools and equipment cleaning and disinfection areas;</li>
            <li>Storage area for tools and equipment;</li>
            <li>
              Water storage, distribution networks, drainage, and discharge
              points of waste water;
            </li>
            <li>Solid waste disposal area;</li>
            <li>Composting areas;</li>
            <li>Toilet facilities and hand-washing areas; and</li>
            <li>Property buildings, structures, and road networks.</li>
          </ul>
          <p>
            Each production area, in case of multiple production areas in a
            site, should be identified by a name or code, and shall be indicated
            in the property map.
          </p>
          <p>
            All hazard and risk areas to humans should be clearly indicated.
          </p>
          <p>
            All facilities and structures for coconut production should be
            properly designed, constructed, and maintained to minimize
            postharvest losses and risk of contamination.
          </p>
          <p>
            All premises should adhere to the guidelines set by the competent
            authority.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            4.3 Sourcing and Selection of Planting Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <h3 className="text-lg font-semibold text-gray-800">
            4.3.1 General Considerations
          </h3>
          <p>
            Aside from yield quantity and quality as basic considerations,
            varieties to be grown should be selected based on market
            requirements, farmer preference, and adaptability to the locality.
            Other considerations may include soil type and nutrient levels,
            water availability, prevailing temperatures and humidity, and pest
            and disease history.
          </p>
          <p>
            For efficient chemical, water, and other input utilization, planting
            materials may be selected based on their nutrient and water use
            efficiencies, and pests and diseases resistance.
          </p>
          <p>
            The planting materials should be of high quality and shall be
            sourced either from Philippine Coconut Authority (PCA) seed gardens
            and seed production centers; Bureau of Plant Industry (BPI) or
            PCA-accredited nurseries; PCA-recommended varieties and seednut
            producers; or farmer selected mother palms.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            4.3.2 Sourcing and Selection of Seednuts
          </h3>
          <p>
            Proper sourcing and selection of quality seednuts should be done to
            ensure productivity of palms.
          </p>
          <p>
            Seednuts should be sourced from selected mother palms of National
            Seed Industry Council (NSIC)-registered or PCA-recommended
            varieties. The list of NSIC-registered coconut varieties is found in
            Annex B.
          </p>
          <p>
            Mother palms of open-pollinated varieties shall be selected from a
            block or area of highly homogenous bearing palms producing an
            average of at least 10 nuts per bunch every 30 days for tall
            varieties and 15 nuts per bunch every 25 days for dwarf varieties.
          </p>
          <p>
            Seednuts shall be disease-free, undamaged by insects and rodents,
            physiologically mature, without deep punctures or cuts, with water
            manifested by “sloshing sound” when shaken, ungerminated, and
            resembles the distinct appearance of the specific variety of the
            mother palm.
          </p>
          <p>
            Seednuts should be seasoned in shade, preferably soaked in water
            with perianth lobes removed prior to sowing in appropriately
            prepared seedbeds of appropriate nursery site. Seednuts should be
            set with the germ end at the top in either upright for tall
            varieties or tilted for dwarfs to ensure nut water contact with the
            haustorium.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4.4.3 Planting and Replanting of Palms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Seedlings aged six to eight months or with height of two feet should
            be appropriately planted preferably in 50 cm x 50 cm x 50 cm
            planting holes at the onset of the rainy season. Seedling collar
            shall not be covered with soil nor soil be allowed to get into the
            leaf axils.
          </p>
          <p>
            Organic matter rich soil amendment should be applied prior to
            planting. A fence or tree guard should be provided for young palms
            as protection from stray animals.
          </p>
          <p>
            For newly established farms, young palms that are deformed or
            damaged, stunted in growth, dead, and those exhibiting weakness
            should be replaced or replanted with seedlings of the same age.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
