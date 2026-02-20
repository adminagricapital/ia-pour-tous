import { motion } from "framer-motion";
import { Award, Star, CheckCircle, Shield } from "lucide-react";
import logo from "@/assets/logo.png";

interface HonorBoardProps {
  userName: string;
  courseName: string;
  moduleName: string;
  score: number;
  date: string;
}

const HonorBoard = ({ userName, courseName, moduleName, score, date }: HonorBoardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative overflow-hidden rounded-2xl border-2 my-8"
      style={{
        background: "linear-gradient(135deg, hsl(217, 90%, 10%) 0%, hsl(230, 80%, 20%) 50%, hsl(217, 90%, 10%) 100%)",
        borderColor: "hsl(36, 95%, 48%)",
        boxShadow: "0 0 40px -8px hsla(36, 95%, 48%, 0.4), inset 0 0 60px -20px hsla(36, 95%, 48%, 0.1)",
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-3 left-3 h-12 w-12 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(36, 95%, 55%) 0%, transparent 70%)" }} />
      <div className="absolute bottom-3 right-3 h-12 w-12 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(36, 95%, 55%) 0%, transparent 70%)" }} />
      <div className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(36, 95%, 55%) 0%, transparent 70%)" }} />
      <div className="absolute bottom-3 left-3 h-8 w-8 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(36, 95%, 55%) 0%, transparent 70%)" }} />

      {/* Dotted border inner */}
      <div className="absolute inset-4 rounded-xl border opacity-30" style={{ borderColor: "hsl(36, 95%, 55%)", borderStyle: "dashed" }} />

      <div className="relative z-10 p-8 text-center">
        {/* Stars top */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" style={{ color: "hsl(36, 95%, 55%)" }} />
          ))}
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={logo} alt="IA Pour Tous" className="h-8 w-8 rounded-lg" />
          <span className="font-display text-sm font-bold" style={{ color: "hsl(36, 95%, 65%)" }}>
            IA POUR TOUS
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-black mb-1 tracking-wide" style={{ color: "hsl(36, 95%, 65%)" }}>
          TABLEAU D'HONNEUR
        </h2>
        <div className="text-xs mb-6 opacity-70" style={{ color: "hsl(36, 95%, 75%)" }}>
          Certificat de réussite du module
        </div>

        {/* Medal */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="h-20 w-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(36, 95%, 45%), hsl(42, 95%, 60%), hsl(36, 95%, 45%))",
                boxShadow: "0 0 30px hsla(36, 95%, 55%, 0.5), inset 0 2px 4px hsla(0,0%,100%,0.3)",
              }}
            >
              <Award className="h-10 w-10" style={{ color: "hsl(217, 90%, 15%)" }} />
            </motion.div>
            <div
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "hsl(217, 90%, 42%)", color: "white" }}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Recipient */}
        <div className="mb-5">
          <p className="text-sm mb-1" style={{ color: "hsl(36, 95%, 75%)", opacity: 0.8 }}>Décerné à</p>
          <p className="font-display text-2xl font-black" style={{ color: "white" }}>
            {userName}
          </p>
          <div className="h-0.5 w-24 mx-auto mt-2 rounded" style={{ background: "hsl(36, 95%, 55%)" }} />
        </div>

        {/* Achievement info */}
        <div className="mb-4 space-y-1">
          <p className="text-xs opacity-70" style={{ color: "hsl(36, 95%, 80%)" }}>Pour avoir excellemment complété</p>
          <p className="font-display text-base font-bold" style={{ color: "hsl(36, 95%, 70%)" }}>
            {moduleName}
          </p>
          <p className="text-xs opacity-60" style={{ color: "white" }}>
            dans le cadre du cours : <span className="font-semibold">{courseName}</span>
          </p>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "hsla(36, 95%, 55%, 0.15)", border: "1px solid hsla(36, 95%, 55%, 0.4)" }}
          >
            <CheckCircle className="h-4 w-4" style={{ color: "hsl(142, 70%, 50%)" }} />
            <span className="font-display text-lg font-black" style={{ color: "white" }}>
              Score : {score}%
            </span>
          </div>
        </div>

        {/* Signature area */}
        <div className="border-t pt-5 mt-2" style={{ borderColor: "hsla(36, 95%, 55%, 0.3)" }}>
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <p className="opacity-50 mb-1" style={{ color: "white" }}>Date de validation</p>
              <p className="font-semibold" style={{ color: "hsl(36, 95%, 70%)" }}>{date}</p>
            </div>
            <div>
              <p className="opacity-50 mb-1" style={{ color: "white" }}>Validation officielle</p>
              <div className="flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" style={{ color: "hsl(36, 95%, 55%)" }} />
                <p className="font-semibold" style={{ color: "hsl(36, 95%, 70%)" }}>IA Pour Tous</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div
              className="text-xs px-4 py-1.5 rounded-full font-mono font-bold tracking-widest"
              style={{
                background: "hsla(36, 95%, 55%, 0.15)",
                border: "1px solid hsla(36, 95%, 55%, 0.3)",
                color: "hsl(36, 95%, 70%)",
              }}
            >
              CERTIFIÉ CONFORME · PLATEFORME IA POUR TOUS
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HonorBoard;
