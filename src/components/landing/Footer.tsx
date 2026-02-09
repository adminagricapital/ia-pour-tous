import logo from "@/assets/logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="gradient-primary py-14 text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="IA Pour Tous" className="h-10 w-10 rounded-lg bg-primary-foreground/10 p-1" />
            <span className="font-display text-lg font-bold">IA Pour Tous</span>
          </div>
          <p className="text-sm text-primary-foreground/70">
            Démocratiser l'Intelligence Artificielle pour tous les métiers en Afrique.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><a href="#pour-qui" className="hover:text-primary-foreground transition-colors">Pour qui ?</a></li>
            <li><a href="#programme" className="hover:text-primary-foreground transition-colors">Programme</a></li>
            <li><a href="#tarifs" className="hover:text-primary-foreground transition-colors">Tarifs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Formats</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Cours vidéo</li>
            <li>Sessions live & replay</li>
            <li>PDF & supports écrits</li>
            <li>Quiz interactifs</li>
            <li>Sessions physiques</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@iapourtous.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +225 07 00 00 00</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Abidjan, Côte d'Ivoire</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
        © 2025 IA Pour Tous. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
