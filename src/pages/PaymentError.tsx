import { useSearchParams, Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src={logo} alt="" className="h-10 w-10" />
          <span className="font-display text-xl font-bold text-foreground">IA Pour Tous</span>
        </Link>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="h-12 w-12 text-red-600" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Paiement échoué
        </h1>
        <p className="text-muted-foreground mb-2">
          Le paiement n'a pas pu être complété.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Aucun montant n'a été débité de votre compte. Vous pouvez réessayer.
        </p>

        <div className="space-y-3">
          <Link to="/#tarifs">
            <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" size="lg">
              <RefreshCw className="h-5 w-5" /> Réessayer le paiement
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full gap-2" size="lg">
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentError;
