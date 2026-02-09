import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="container mx-auto flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="IA Pour Tous" className="h-10 w-10" />
        <span className="font-display text-xl font-bold text-foreground">IA Pour Tous</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <a href="#pour-qui" className="hover:text-primary transition-colors">Pour qui ?</a>
        <a href="#programme" className="hover:text-primary transition-colors">Programme</a>
        <a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a>
        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
      </div>
      <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
        S'inscrire
      </Button>
    </div>
  </nav>
);

export default Navbar;
