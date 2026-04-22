import Navbar from "../components/Navbar";
import MobileMenu from "../components/MobileMenu";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <MobileMenu />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}