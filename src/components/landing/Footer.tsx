import logo from "@/assets/logo.png";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer id="contact" className="py-14 text-white" style={{ background: "linear-gradient(135deg, hsl(217, 90%, 15%) 0%, hsl(230, 80%, 22%) 100%)" }}>
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="IA Pour Tous" className="h-10 w-10 rounded-lg" />
            <span className="font-display text-lg font-bold">IA Pour Tous</span>
          </div>
          <p className="text-sm opacity-70 mb-2">
            Démocratiser l'Intelligence Artificielle pour tous les métiers.
          </p>
          <p className="text-xs opacity-50">
            Par <strong className="opacity-80">Innocent KOFFI</strong> — Innovation & Consulting
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><a href="#pour-qui" className="hover:opacity-100 transition-opacity">Pour qui ?</a></li>
            <li><a href="#programme" className="hover:opacity-100 transition-opacity">Programme</a></li>
            <li><a href="#tarifs" className="hover:opacity-100 transition-opacity">Tarifs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Ressources</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/catalogue" className="hover:opacity-100">Catalogue</Link></li>
            <li><Link to="/blog" className="hover:opacity-100">Actualités & Blog</Link></li>
            <li><Link to="/rendez-vous" className="hover:opacity-100">Rendez-vous</Link></li>
            <li><Link to="/forum" className="hover:opacity-100">Forum</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@iapourtous.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +225 07 59 56 60 87</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Abidjan, Côte d'Ivoire</li>
          </ul>
          <a
            href="https://wa.me/2250759566087"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "hsl(142, 70%, 45%)", color: "white" }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t mt-10 pt-6 text-center text-xs opacity-40" style={{ borderColor: "hsla(0,0%,100%,0.1)" }}>
        © 2025 IA Pour Tous — Innocent KOFFI, Innovation & Consulting. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
