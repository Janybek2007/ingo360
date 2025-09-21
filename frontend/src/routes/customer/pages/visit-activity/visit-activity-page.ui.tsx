import React from 'react';

import { DoctorsCoverage } from '#/widgets/customer/doctors-coverage';
import { OverallVisits } from '#/widgets/customer/overall-visits';
import { SpecialistCoverage } from '#/widgets/customer/specialist-coverage';
import { TertiarySalesUnits } from '#/widgets/customer/tertiary-sales-units';
import { TertiaryVisits } from '#/widgets/customer/tertiary-visits';
import { TotalVisitsPeriod } from '#/widgets/customer/total-visits-period';

const VisitActivityPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <TotalVisitsPeriod />
      <OverallVisits />
      <TertiaryVisits />
      <TertiarySalesUnits />
      <SpecialistCoverage />
      <DoctorsCoverage />
    </main>
  );
};

export default VisitActivityPage;
