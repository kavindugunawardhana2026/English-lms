import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-[40vw] h-[40vw] bg-indigo-600/30 rounded-full blur-[100px] absolute"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="w-[30vw] h-[30vw] bg-violet-600/20 rounded-full blur-[100px] absolute"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Modern Spinning Rings */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500 opacity-80"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-violet-400 opacity-60"
          />
          
          {/* Core Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          >
            <span className="text-indigo-950 font-bold font-display text-xl tracking-tighter">KE</span>
          </motion.div>
        </div>

        {/* Staggered Text Reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h2
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight"
          >
            Kavindu's English
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-2 text-indigo-200/60 font-medium tracking-widest text-xs uppercase"
        >
          <span>Initializing Experience</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >...</motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;
