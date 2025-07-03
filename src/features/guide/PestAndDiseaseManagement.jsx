import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export const PestAndDiseaseManagement = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Pest and Disease Management Guide
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Common Coconut Pests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <h3 className="text-lg font-semibold text-gray-800">
            1. Rhinoceros Beetle (Oryctes rhinoceros)
          </h3>
          <p>
            <strong>Damage:</strong> Adults bore into the unopened fronds and
            spathes, causing V-shaped cuts on leaves when they unfold. Severe
            infestations can kill young palms and reduce yield in mature palms.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Sanitation:</strong> Remove and destroy breeding sites
              like decaying logs, compost heaps, and dead palms.
            </li>
            <li>
              <strong>Trapping:</strong> Use pheromone traps to capture adult
              beetles.
            </li>
            <li>
              <strong>Biological Control:</strong> Introduce natural enemies
              like the Green Muscardine Fungus (Metarhizium anisopliae).
            </li>
            <li>
              <strong>Manual Removal:</strong> Hook out beetles from boreholes
              using a stiff wire.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            2. Red Palm Weevil (Rhynchophorus ferrugineus)
          </h3>
          <p>
            <strong>Damage:</strong> Larvae tunnel extensively within the trunk,
            often leading to the collapse and death of the palm. Infestation is
            difficult to detect in early stages.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Trapping:</strong> Use pheromone traps combined with food
              baits (e.g., fermented coconut sap, sugarcane).
            </li>
            <li>
              <strong>Sanitation:</strong> Remove and destroy infested palms
              promptly to prevent spread. Avoid wounding healthy palms.
            </li>
            <li>
              <strong>Chemical Control:</strong> Stem injection or soil
              drenching with recommended insecticides (use as a last resort and
              follow safety guidelines).
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            3. Coconut Scale Insect (Aspidiotus destructor)
          </h3>
          <p>
            <strong>Damage:</strong> These insects suck sap from leaves, nuts,
            and flowers, causing yellowing, drying of fronds, and reduced nut
            production. Severe infestations can cover entire fronds with a
            yellowish crust.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Biological Control:</strong> Encourage natural predators
              like ladybird beetles (Chilocorus spp., Cryptolaemus
              montrouzieri).
            </li>
            <li>
              <strong>Pruning:</strong> Remove and burn heavily infested lower
              fronds.
            </li>
            <li>
              <strong>Chemical Control:</strong> Spraying with insecticidal soap
              or horticultural oils can be effective, especially on younger
              palms. Systemic insecticides may be needed for severe cases.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Coconut Diseases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <h3 className="text-lg font-semibold text-gray-800">
            1. Cadang-Cadang
          </h3>
          <p>
            <strong>Symptoms:</strong> Caused by a viroid (Coconut cadang-cadang
            viroid - CCCVd). Symptoms include yellowing and spotting on leaves,
            reduced nut size and number, water-soaking appearance on nuts, and
            eventual death of the palm.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>No known cure.</strong>
            </li>
            <li>
              <strong>Sanitation:</strong> Remove and destroy infected palms
              immediately to prevent spread.
            </li>
            <li>
              <strong>Resistant Varieties:</strong> Planting tolerant or
              resistant varieties where available.
            </li>
            <li>
              <strong>Vector Control:</strong> Manage potential insect vectors,
              although the primary mode of transmission is thought to be
              mechanical (e.g., contaminated tools).
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            2. Bud Rot (Phytophthora palmivora)
          </h3>
          <p>
            <strong>Symptoms:</strong> A fungal disease affecting the growing
            point (bud). Early symptoms include yellowing and wilting of the
            spear leaf, which later turns brown and can be easily pulled out. A
            foul smell often emanates from the decaying bud tissue. Can kill the
            palm.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Prevention:</strong> Avoid wounding the crown area. Ensure
              good drainage to reduce humidity.
            </li>
            <li>
              <strong>Sanitation:</strong> Remove and destroy infected palms or
              affected tissues.
            </li>
            <li>
              <strong>Chemical Control:</strong> Apply appropriate fungicides
              (e.g., copper-based fungicides) to the crown area as a preventive
              measure or in the early stages of infection.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            3. Lethal Yellowing (LY)
          </h3>
          <p>
            <strong>Symptoms:</strong> Caused by a phytoplasma. Symptoms include
            premature nut fall, blackening of flower stalks (inflorescences),
            yellowing of lower fronds progressing upwards, and death of the
            spear leaf and bud, leading to palm death within 3-6 months of
            symptom onset.
          </p>
          <p>
            <strong>Management:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Resistant Varieties:</strong> Planting resistant varieties
              (e.g., Malayan Dwarf, Maypan) is the most effective long-term
              strategy.
            </li>
            <li>
              <strong>Chemical Control:</strong> Antibiotic injections
              (Oxytetracycline-HCl) can manage the disease but require repeated
              applications and are often costly.
            </li>
            <li>
              <strong>Vector Control:</strong> Control the planthopper vector
              (Haplaxius crudus) where feasible.
            </li>
            <li>
              <strong>Sanitation:</strong> Remove infected palms promptly.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrated Pest Management (IPM)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Integrated Pest Management (IPM) is an ecosystem-based strategy that
            focuses on long-term prevention of pests or their damage through a
            combination of techniques such as biological control, habitat
            manipulation, modification of cultural practices, and use of
            resistant varieties. Pesticides are used only after monitoring
            indicates they are needed according to established guidelines, and
            treatments are made with the goal of removing only the target
            organism.
          </p>
          <h4 className="font-semibold text-gray-800">
            Key IPM Principles for Coconut Farming:
          </h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Monitoring:</strong> Regularly inspect palms for early
              signs of pests and diseases.
            </li>
            <li>
              <strong>Cultural Practices:</strong> Maintain farm sanitation,
              proper spacing, adequate fertilization, and good drainage to
              promote palm health and reduce pest/disease susceptibility. Avoid
              wounding palms.
            </li>
            <li>
              <strong>Biological Control:</strong> Conserve and augment natural
              enemies (predators, parasitoids, pathogens) of pests.
            </li>
            <li>
              <strong>Resistant Varieties:</strong> Plant varieties known to be
              resistant or tolerant to common local pests and diseases.
            </li>
            <li>
              <strong>Physical/Mechanical Controls:</strong> Use traps, manual
              removal of pests, or pruning of affected parts.
            </li>
            <li>
              <strong>Chemical Control (Judicious Use):</strong> Use pesticides
              as a last resort, selecting the least toxic options and applying
              them specifically to target pests at the right time to minimize
              harm to beneficial organisms and the environment. Always follow
              label instructions and safety precautions.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
