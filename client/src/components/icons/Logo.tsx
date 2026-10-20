import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "light" | "dark" | "tech";
  showText?: boolean;
}

const Logo = ({ size = "md", color, showText = true }: LogoProps) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-16",
    xl: "h-20",
  };

  const effectiveColor = color || (theme === "light" ? "dark" : "light");

  const logoSrc =
    effectiveColor === "light"
      ? "/logo-white.png"
      : effectiveColor === "tech"
        ? "/logo-tech.png"
        : "/logo-black.png";

  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={{ opacity: 0.95 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative">
        <img
          src={logoSrc}
          alt="Aprameya Logo"
          className={`${sizeClasses[size]} object-contain drop-shadow-sm`}
          style={{ filter: "contrast(1.1) brightness(1.05)" }}
        />
      </div>
      {showText && (
        <span className="text-base tracking-[-0.02em] font-medium text-paper">
          APRAMEYA
        </span>
      )}
    </motion.div>
  );
};

export default Logo;
