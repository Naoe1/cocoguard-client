import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export const NutrientManagement = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Fertilization Guides for Coconuts
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Why Fertilize Coconuts?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            PCA surveys indicated that there are ten distinct classes of coconut
            nutritional deficiency in the Philippines. Coconut areas may be
            deficient in N, P, K, Cl, S and Mg but most provinces in the country
            fall under N-Cl deficiency.
          </p>
          <p>
            Judicious application of fertilizers increases nut and copra yield
            by as much as 230%. A study in Davao City showed that with
            fertilizer application, a coconut farmer can realize a net income of
            about 180% compared to without fertilization.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Fertilizers to Apply?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            In the absence of soil & leaf analysis of an area/farm, the
            following fertilizer recommendation provides the coconut at its
            different growth stages and production with four most needed
            nutrients (N, K, Cl, S) in many coconut areas in the country.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            Fertilizer Rates for Seedlings
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age (mos.)</TableHead>
                <TableHead>Ammonium Sulfate (g/seedling)</TableHead>
                <TableHead>
                  Potassium Chloride or Common Salt (g/seedling)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>20</TableCell>
                <TableCell>20</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>40</TableCell>
                <TableCell>60</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>FP (Field Planting)</TableCell>
                <TableCell>25</TableCell>
                <TableCell>45</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            Fertilizer Rates for Palms in Coastal Areas (within 2 km from
            coastline)
          </h3>
          <CardDescription>
            *In K-deficient soil, use KCl and not NaCl
          </CardDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palm Age</TableHead>
                <TableHead>Ammonium Sulfate (NH4SO2)</TableHead>
                <TableHead>
                  Potassium Chloride (KCl) or Common Salt (NaCl)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>6 mos.</TableCell>
                <TableCell>150 g</TableCell>
                <TableCell>80 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1 year</TableCell>
                <TableCell>200 g</TableCell>
                <TableCell>120 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2 year</TableCell>
                <TableCell>500 g</TableCell>
                <TableCell>400 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3 year</TableCell>
                <TableCell>750 g</TableCell>
                <TableCell>600 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4 year</TableCell>
                <TableCell>1.0 kg</TableCell>
                <TableCell>800 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5 year</TableCell>
                <TableCell>1.25 kg</TableCell>
                <TableCell>1.00 kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6 year or more</TableCell>
                <TableCell>1.50 kg</TableCell>
                <TableCell>1.20 kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            Fertilizer Rates for Palms in Inland Areas (more than 2 km from
            coastline)
          </h3>
          <CardDescription>
            *In K-deficient soil, use KCl and not NaCl
          </CardDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palm Age</TableHead>
                <TableHead>Ammonium Sulfate (NH4SO2)</TableHead>
                <TableHead>
                  Potassium Chloride (KCl) or Common Salt (NaCl)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>6 mos.</TableCell>
                <TableCell>150 g</TableCell>
                <TableCell>160 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1 year</TableCell>
                <TableCell>200 g</TableCell>
                <TableCell>200 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2 year</TableCell>
                <TableCell>500 g</TableCell>
                <TableCell>480 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3 year</TableCell>
                <TableCell>750 g</TableCell>
                <TableCell>720 g</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4 year</TableCell>
                <TableCell>1.0 kg</TableCell>
                <TableCell>1.25 kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5 year</TableCell>
                <TableCell>1.25 kg</TableCell>
                <TableCell>1.35 kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6 year or more</TableCell>
                <TableCell>1.50 kg</TableCell>
                <TableCell>1.70 kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
            Organic Fertilizers
          </h3>
          <p>
            Green manure like ipil-ipil and farm organic wastes such as manures
            of cattle, carabao, pig, goat, chicken, compost and night soil can
            be used to replace part of the commercial fertilizer requirements.
          </p>
          <p>
            Coconut crown residues as organic fertilizer and nitrogen fixing
            legumes (Flemingia and Desmodium rensonii) can substitute for AS as
            N-sources while cocopeat and husk for chlorine.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How To Apply Fertilizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>Fertilizer may be applied in two ways:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>In flat areas:</strong> Broadcast the fertilizer in the
              ring weeded area (about 1.0 to 1.5 m radius) around the base of
              the palm, followed by fork-in to incorporate the fertilizer into
              the soil. (See Fig. 1, 2, 3)
            </li>
            <li>
              <strong>In hilly areas:</strong> Hole placement is recommended.
              Place fertilizers in 8-10 equidistant holes, 5 cm deep around the
              base of the palms and cover with soil. (See Fig. 4, 5, 6, 7)
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When To Apply Fertilizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>
                Areas with distinct wet and dry seasons, irregular rainfall, or
                sandy soils:
              </strong>{' '}
              Apply fertilizers every 6 months in split application (½ at the
              start of the rainy season and ½ six months before the end of the
              rainy season).
            </li>
            <li>
              <strong>
                Areas with uniform rainfall distribution (1.5-3 dry months):
              </strong>{' '}
              Apply fertilizers in split during the 1st year and once annually
              thereafter.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700">
          <p>For more information, please contact:</p>
          <p className="font-semibold mt-2">
            Agronomy, Soils and Farming Systems Division
          </p>
          <p>Philippine Coconut Authority</p>
          <p>Davao Research Center</p>
          <p>Bago Oshiro, Davao City 8000</p>
          <p>Tel. (082) 293-0161</p>
          <p>E-mail: pcadrc.asd12@gmail.com</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            Eroy, M. N., R.Z. Margate and R.M. Ebuña. 1990. Nutrient depletion
            in coconut soils thru harvest of mature nut.
          </p>
          <p>
            Padrones, G. D. et.al. 1995. Response of coconut to recycling of
            coconut crown residues and cir-
          </p>
          {/* Note: The reference text seems cut off in the source */}
        </CardContent>
      </Card>
    </div>
  );
};
