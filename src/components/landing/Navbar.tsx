import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="IA Pour Tous" className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-foreground">IA Pour Tous</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#pour-qui" className="hover:text-primary transition-colors">Pour qui ?</a>
          <a href="#programme" className="hover:text-primary transition-colors">Programme</a>
          <a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a>
          <Link to="/catalogue" className="hover:text-primary transition-colors">Catalogue</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <Link to="/forum" className="hover:text-primary transition-colors">Forum</Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth?tab=login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground">S'inscrire</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-3">
          <a href="#pour-qui" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Pour qui ?</a>
          <a href="#programme" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Programme</a>
          <a href="#tarifs" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Tarifs</a>
          <Link to="/catalogue" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Catalogue</Link>
          <Link to="/blog" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Blog</Link>
          <Link to="/forum" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Forum</Link>
          <div className="flex gap-2 pt-2">
            <Link to="/auth?tab=login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Connexion</Button></Link>
            <Link to="/auth?tab=signup" className="flex-1"><Button className="w-full gradient-primary border-0 text-primary-foreground" size="sm">S'inscrire</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
