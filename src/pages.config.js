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
    "BuyWiser Home Loans": Home,
    "Request a Mortgage Review": ApplyNow,
    "Contact BuyWiser": ContactUs,
    "Mortgage Calculators": MortgageCalculators,
    "Refinance": Refinance,
    "FHA Streamline": FHAStreamline,
    "VA Streamline": VAStreamline,
    "Cash-Out Options": CashOut,
    "Home Purchase": Purchase,
    "About": About,
    "Reviews": Reviews,
    "Privacy Policy": PrivacyPolicy,
    "Licensing & Disclosures": Disclosures,
}

export const pagesConfig = {
    mainPage: "BuyWiser Home Loans",
    Pages: PAGES,
    Layout: __Layout,
};