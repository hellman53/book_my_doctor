import { Suspense } from 'react';
import DoctorSearch from '@/components/pages/SearchDoctor';

export default function DoctorsPage() {
   <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DoctorSearch />
      </Suspense>
    </div>

}
