import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface AppSettings {
  maintenanceMode: number;
}

export function MaintenanceOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  const { data: settings } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    setIsVisible(settings?.maintenanceMode === 1);
  }, [settings]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white p-8"
        style={{ isolation: "isolate" }}
      >
        {/* Main Content */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-6">
              Hoppla!
            </h1>
            <p className="font-poppins text-xl md:text-2xl leading-relaxed mb-4">
              Die Seite ist vorübergehend nicht verfügbar.
            </p>
            <p className="font-poppins text-lg md:text-xl opacity-90">
              Wir sind bald wieder für Sie da!
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-16 flex justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </motion.div>
        </div>

        {/* Admin Backdoor - Small, discreet link in bottom-right corner */}
        <Link
          href="/admin/login?bypass=true"
          className="fixed bottom-6 right-6 text-white/30 hover:text-white/60 text-xs transition-colors duration-200"
        >
          •
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
