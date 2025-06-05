export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const messageAnimation = {
  initial: { opacity: 0, x: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: { 
    opacity: 0, 
    x: 0, 
    y: -20, 
    scale: 0.9,
    transition: { duration: 0.3 }
  },
}

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export const typingIndicator = {
  initial: {
    scale: 1,
    opacity: 0.4
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    }
  },
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} 