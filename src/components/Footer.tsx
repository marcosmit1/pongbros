export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 border-t border-white/10 bg-surface/30 backdrop-blur-lg">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-beer-foam/60 text-sm mb-4 sm:mb-0">
          © {new Date().getFullYear()} Pong Bros. All rights reserved.
        </div>
        <div className="text-beer-foam/40 text-xs tracking-wider">
          Powered by <span className="font-medium text-beer-foam/60 hover:text-beer-foam/80 transition-colors duration-300">PRACTAGON (PTY) LTD</span>
        </div>
      </div>
    </footer>
  );
} 