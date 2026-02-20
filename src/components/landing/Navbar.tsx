import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#pour-qui", label: "Pour qui ?" },
    { href: "#programme", label: "Programme" },
    { href: "#tarifs", label: "Tarifs" },
  ];

  const pageLinks = [
    { to: "/catalogue", label: "Catalogue" },
    { to: "/blog", label: "Blog" },
    { to: "/forum", label: "Forum" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{ background: "hsl(0, 0%, 100%)", borderBottom: "1.5px solid hsl(220, 15%, 88%)" }}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="IA Pour Tous" className="h-9 w-9 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-display text-base font-bold leading-tight" style={{ color: "hsl(217, 90%, 42%)" }}>
              IA Pour Tous
            </span>
            <span className="text-xs leading-tight" style={{ color: "hsl(220, 10%, 50%)" }}>
              Formation IA en Afrique
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-md transition-colors hover:bg-secondary"
              style={{ color: "hsl(220, 20%, 20%)" }}
            >
              {link.label}
            </a>
          ))}
          {pageLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md transition-colors hover:bg-secondary ${location.pathname === link.to ? "font-semibold" : ""}`}
              style={{ color: location.pathname === link.to ? "hsl(217, 90%, 42%)" : "hsl(220, 20%, 20%)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth?tab=login">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium"
              style={{ color: "hsl(217, 90%, 42%)" }}
            >
              Connexion
            </Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button
              size="sm"
              className="font-semibold shadow-sm"
              style={{ background: "hsl(217, 90%, 42%)", color: "white" }}
            >
              S'inscrire gratuitement
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ color: "hsl(220, 20%, 20%)" }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{ background: "hsl(0, 0%, 100%)", borderTop: "1px solid hsl(220, 15%, 90%)" }}
        >
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary"
              style={{ color: "hsl(220, 20%, 20%)" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {pageLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary"
              style={{ color: "hsl(220, 20%, 20%)" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-border mt-2">
            <Link to="/auth?tab=login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full font-medium" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/auth?tab=signup" onClick={() => setOpen(false)}>
              <Button
                className="w-full font-semibold"
                size="sm"
                style={{ background: "hsl(217, 90%, 42%)", color: "white" }}
              >
                S'inscrire gratuitement
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
