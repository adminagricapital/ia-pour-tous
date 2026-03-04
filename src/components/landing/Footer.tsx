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
          <p className="text-sm opacity-70">
            Démocratiser l'Intelligence Artificielle pour tous les métiers.
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
            <li><Link to="/blog" className="hover:opacity-100">Blog</Link></li>
            <li><Link to="/rendez-vous" className="hover:opacity-100">Rendez-vous</Link></li>
            <li><Link to="/forum" className="hover:opacity-100">Forum</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@iapourtous.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +225 07 00 00 00</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Abidjan, Côte d'Ivoire</li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-10 pt-6 text-center text-xs opacity-40" style={{ borderColor: "hsla(0,0%,100%,0.1)" }}>
        © 2025 IA Pour Tous. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
