import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import ScrollToTop from './Components/ScrollToTop'
// import SmoothScroll from './Components/SmoothScroll'

const Home = lazy(() => import('./Pages/Home'))
const OurFleet = lazy(() => import('./Pages/OurFleet'))
const AboutUs = lazy(() => import('./Pages/AboutUs'))
const ContactUs = lazy(() => import('./Pages/ContactUs'))
const CarDetail = lazy(() => import('./Components/CarDetail'))
const BrandPage = lazy(() => import('./Components/BrandPage'))
const Car3DShowcase = lazy(() => import('./Pages/Car3DShowcase'))
const GWagonSpecial = lazy(() => import('./Pages/GWagonSpecial'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[70vh] bg-slate-950">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const App = () => {
  return (
    <Router>
      {/* <SmoothScroll /> */}
      <ScrollToTop />
      <div className="min-h-screen bg-slate-950">
        <Navbar/> 
        <Suspense fallback={<PageLoader />}> 
          <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/our-fleet" element={<OurFleet />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/car-3d/:id" element={<Car3DShowcase />} />
          <Route path="/gwagon-special" element={<GWagonSpecial />} />
          <Route path="/brand/:brandName" element={<BrandPage />} />
          </Routes>
        </Suspense>
        <Footer/>
      </div>
    </Router>
  )
}

export default App