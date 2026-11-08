import {Route, Routes} from 'react-router-dom';
import ShowcaseLanding from './pages/ShowcaseLanding';
import ShowcaseDetail from './pages/ShowcaseDetail';
import ShowcaseNotFound from './pages/ShowcaseNotFound';

/** Cac route con cua /showcase. Duoc App nap bang lazy() nen khong nam trong chunk chinh. */
export default function ShowcaseRoutes() {
  return (
    <Routes>
      <Route index element={<ShowcaseLanding />} />
      <Route path=":slug" element={<ShowcaseDetail />} />
      <Route path="*" element={<ShowcaseNotFound />} />
    </Routes>
  );
}
