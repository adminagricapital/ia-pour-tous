import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      if (u) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id).eq("role", "admin").maybeSingle();
        setIsAdmin(!!data);
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkUser());
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = isHome ? [
    { href: "#pour-qui", label: "Pour qui ?", isAnchor: true },
    { href: "#programme", label: "Programme", isAnchor: true },
    { href: "#tarifs", label: "Tarifs", isAnchor: true },
  ] : [];

  const pageLinks = [
    { to: "/catalogue", label: "Catalogue" },
    { to: "/blog", label: "Actualités" },
    { to: "/rendez-vous", label: "Rendez-vous" },
  ];

  const bgStyle = scrolled || !isHome
    ? { background: "hsl(0, 0%, 100%)", borderBottom: "1.5px solid hsl(220, 15%, 88%)" }
    : { background: "hsla(217, 90%, 12%, 0.9)", borderBottom: "1px solid hsla(0,0%,100%,0.08)", backdropFilter: "blur(12px)" };

  const textColor = scrolled || !isHome ? "hsl(220, 20%, 15%)" : "hsla(0,0%,100%,0.9)";
  const logoColor = scrolled || !isHome ? "hsl(217, 90%, 42%)" : "white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={bgStyle}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="IA Pour Tous" className="h-9 w-9 rounded-lg" />
          <span className="font-display text-base font-bold" style={{ color: logoColor }}>IA Pour Tous</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="px-3 py-2 rounded-md transition-colors hover:opacity-80" style={{ color: textColor }}>
              {link.label}
            </a>
          ))}
          {pageLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-3 py-2 rounded-md transition-colors hover:opacity-80 ${location.pathname === link.to ? "font-semibold" : ""}`}
              style={{ color: location.pathname === link.to ? "hsl(36, 95%, 48%)" : textColor }}>
              {link.label}
            </Link>
          ))}
          {user && (
            <Link to="/forum" className="px-3 py-2 rounded-md transition-colors hover:opacity-80" style={{ color: textColor }}>
              Forum
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button size="sm" className="font-semibold shadow-sm" style={{ background: "hsl(36, 95%, 48%)", color: "hsl(217, 90%, 10%)" }}>
                  Mon espace
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="font-medium" style={{ borderColor: "hsl(217, 90%, 42%)", color: scrolled || !isHome ? "hsl(217, 90%, 42%)" : "white" }}>
                    Admin
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/auth?tab=login">
                <Button variant="ghost" size="sm" className="font-medium" style={{ color: textColor }}>Connexion</Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button size="sm" className="font-semibold shadow-sm" style={{ background: "hsl(36, 95%, 48%)", color: "hsl(217, 90%, 10%)" }}>
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-md" onClick={() => setOpen(!open)} style={{ color: textColor }}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-1" style={{ background: "hsl(0, 0%, 100%)", borderTop: "1px solid hsl(220, 15%, 90%)" }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: "hsl(220, 20%, 20%)" }} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          {pageLinks.map(link => (
            <Link key={link.to} to={link.to} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: "hsl(220, 20%, 20%)" }} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user && (
            <Link to="/forum" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: "hsl(220, 20%, 20%)" }} onClick={() => setOpen(false)}>
              Forum
            </Link>
          )}
          <div className="flex flex-col gap-2 pt-3 border-t border-border mt-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full font-semibold" size="sm" style={{ background: "hsl(36, 95%, 48%)", color: "hsl(217, 90%, 10%)" }}>
                    Mon espace
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full font-medium" size="sm">Panel Admin</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/auth?tab=login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-medium" size="sm">Connexion</Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={() => setOpen(false)}>
                  <Button className="w-full font-semibold" size="sm" style={{ background: "hsl(36, 95%, 48%)", color: "hsl(217, 90%, 10%)" }}>
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
