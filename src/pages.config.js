import ApplyNow from './pages/ApplyNow';
import ContactUs from './pages/ContactUs';
import Home from './pages/Home';
import MortgageCalculators from './pages/MortgageCalculators';
import Refinance from './pages/Refinance';
import FHAStreamline from './pages/FHAStreamline';
import VAStreamline from './pages/VAStreamline';
import CashOut from './pages/CashOut';
import Purchase from './pages/Purchase';
import About from './pages/About';
import Reviews from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclosures from './pages/Disclosures';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "Apply": ApplyNow,
    "Contact": ContactUs,
    "Calculators": MortgageCalculators,
    "Refinance": Refinance,
    "FHAStreamline": FHAStreamline,
    "VAStreamline": VAStreamline,
    "CashOut": CashOut,
    "Purchase": Purchase,
    "About": About,
    "Reviews": Reviews,
    "PrivacyPolicy": PrivacyPolicy,
    "Disclosures": Disclosures,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};