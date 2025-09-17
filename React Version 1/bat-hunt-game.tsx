import React, { useState, useRef } from 'react';

const BatHuntGame = () => {
  const [gameState, setGameState] = useState({
    started: false,
    batFound: false,
    mousePos: { x: 0, y: 0 },
    batPosition: { x: 0, y: 0 },
    currentPose: 0,
    moonPhase: 0,
    screen: 'start'
  });

  const gameContainerRef = useRef(null);
  const illuminatedSceneRef = useRef(null);
  const flashlightIndicatorRef = useRef(null);

  // Create background elements
  const [backgroundElements] = useState(() => {
    const stars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 70,
      animationDelay: Math.random() * 3,
      animationDuration: 2 + Math.random() * 2
    }));

    const bigStars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60,
      animationDelay: Math.random() * 4,
      animationDuration: 3 + Math.random() * 2
    }));

    const fireflies = Array.from({ length: 11 }, (_, i) => ({
      id: i,
      left: i < 8 ? 20 + Math.random() * 60 : 38 + Math.random() * 15,
      top: i < 8 ? 60 + Math.random() * 30 : 65 + Math.random() * 15,
      animationDelay: i < 8 ? Math.random() * 2 : Math.random() * 3,
      animationDuration: i < 8 ? 2 + Math.random() * 3 : 2.5 + Math.random() * 2
    }));

    console.log('Background elements created:', { 
      starsCount: stars.length, 
      bigStarsCount: bigStars.length, 
      firefliesCount: fireflies.length 
    });
    
    return { stars, bigStars, fireflies };
  });

  // Moon phase component
  const MoonPhase = ({ phase }) => {
    const isFullPhase = [4, 5, 6].includes(phase);
    const fillColor = isFullPhase ? '#f5f5dc' : '#1a1a2e';
    const strokeColor = isFullPhase ? '#e6e68a' : '#4a4a6a';

    const moonPaths = [
      '', // New Moon - just the circle
      'M 50 30 A 20 20 0 0 1 50 70 A 15 15 0 0 0 50 30', // Waxing Crescent
      'M 50 30 A 20 20 0 0 1 50 70 Z', // First Quarter
      'M 50 30 A 20 20 0 0 1 50 70 A 8 8 0 0 1 50 30', // Waxing Gibbous
      '', // Full Moon - just the circle
      'M 50 30 A 8 8 0 0 1 50 70 A 20 20 0 0 0 50 30', // Waning Gibbous
      'M 50 30 A 20 20 0 0 0 50 70 Z', // Last Quarter
      'M 50 30 A 15 15 0 0 1 50 70 A 20 20 0 0 0 50 30' // Waning Crescent
    ];

    return (
      <svg width="480" height="480" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="20" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        {moonPaths[phase] && (
          <path d={moonPaths[phase]} fill={phase < 4 ? '#f5f5dc' : '#1a1a2e'} />
        )}
        {isFullPhase && (
          <g>
            <circle cx="45" cy="45" r="3" fill="#e6e68a" opacity="0.7" />
            <circle cx="58" cy="52" r="2" fill="#e6e68a" opacity="0.7" />
            <circle cx="52" cy="60" r="2.5" fill="#e6e68a" opacity="0.7" />
          </g>
        )}
      </svg>
    );
  };

  // Bat component
  const BatComponent = ({ isRevealed, pose }) => {
    const size = isRevealed ? 200 : 80;
    
    const batPoses = [
      // Sleeping Bat
      (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <rect x="20" y="15" width="60" height="6" fill="#4a3728" rx="3" />
          <ellipse cx="50" cy="55" rx="18" ry="25" fill="#4a4a4a" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="75" r="12" fill="#666" stroke="#333" strokeWidth="2" />
          {isRevealed ? (
            <g>
              <rect x="40" y="72" width="20" height="4" rx="2" fill="#000" />
              <text x="62" y="65" fontSize="8" fill="#87ceeb">Z</text>
              <text x="68" y="60" fontSize="6" fill="#87ceeb">z</text>
            </g>
          ) : (
            <path d="M 45 74 C 47 74 47 74 47 74" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
          )}
          <ellipse cx="50" cy="77" rx="2" ry="1" fill="#000" />
        </svg>
      ),
      // Flying Bat
      (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <ellipse cx="25" cy="45" rx="15" ry="8" fill="#4a4a4a" stroke="#333" strokeWidth="2" transform="rotate(-20 25 45)" />
          <ellipse cx="75" cy="45" rx="15" ry="8" fill="#4a4a4a" stroke="#333" strokeWidth="2" transform="rotate(20 75 45)" />
          <ellipse cx="50" cy="50" rx="8" ry="15" fill="#666" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="35" r="10" fill="#666" stroke="#333" strokeWidth="2" />
          {isRevealed ? (
            <rect x="42" y="31" width="16" height="4" rx="2" fill="#000" />
          ) : (
            <g>
              <circle cx="46" cy="33" r="2" fill="#000" />
              <circle cx="54" cy="33" r="2" fill="#000" />
            </g>
          )}
          <ellipse cx="50" cy="36" rx="1.5" ry="1" fill="#000" />
        </svg>
      ),
      // Alert Bat
      (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <rect x="25" y="80" width="50" height="6" fill="#4a3728" rx="3" />
          <ellipse cx="35" cy="55" rx="10" ry="12" fill="#4a4a4a" stroke="#333" strokeWidth="2" transform="rotate(-15 35 55)" />
          <ellipse cx="65" cy="55" rx="10" ry="12" fill="#4a4a4a" stroke="#333" strokeWidth="2" transform="rotate(15 65 55)" />
          <ellipse cx="50" cy="60" rx="8" ry="18" fill="#666" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="35" r="12" fill="#666" stroke="#333" strokeWidth="2" />
          {isRevealed ? (
            <rect x="38" y="31" width="24" height="4" rx="2" fill="#000" />
          ) : (
            <g>
              <circle cx="46" cy="33" r="3" fill="#000" />
              <circle cx="54" cy="33" r="3" fill="#000" />
              <circle cx="46" cy="32" r="1" fill="#fff" />
              <circle cx="54" cy="32" r="1" fill="#fff" />
            </g>
          )}
          <ellipse cx="50" cy="37" rx="2" ry="1" fill="#000" />
        </svg>
      ),
      // Vampire Bat
      (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M 20 50 Q 15 40 25 45 Q 35 35 45 50" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
          <path d="M 55 50 Q 65 35 75 45 Q 85 40 80 50" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
          <ellipse cx="50" cy="55" rx="10" ry="18" fill="#333" stroke="#000" strokeWidth="2" />
          <circle cx="50" cy="35" r="12" fill="#666" stroke="#000" strokeWidth="2" />
          {isRevealed ? (
            <rect x="38" y="30" width="24" height="4" rx="2" fill="#000" />
          ) : (
            <g>
              <circle cx="46" cy="32" r="2.5" fill="#ff0000" />
              <circle cx="54" cy="32" r="2.5" fill="#ff0000" />
            </g>
          )}
          <ellipse cx="50" cy="36" rx="2" ry="1" fill="#000" />
          <path d="M 47 37 L 47 41 L 48 37 Z" fill="#fff" />
          <path d="M 52 37 L 52 41 L 53 37 Z" fill="#fff" />
        </svg>
      )
    ];

    return batPoses[pose];
  };

  // Game functions
  const startGame = () => {
    setGameState({
      ...gameState,
      batPosition: {
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20
      },
      currentPose: Math.floor(Math.random() * 4),
      moonPhase: Math.floor(Math.random() * 8),
      started: true,
      batFound: false,
      screen: 'game'
    });
  };

  const resetGame = () => {
    setGameState({
      ...gameState,
      started: false,
      batFound: false,
      screen: 'start',
      moonPhase: Math.floor(Math.random() * 8)
    });
  };

  const getMoonPhaseName = (phase) => {
    const names = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", 
                   "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
    return names[phase];
  };

  const checkBatClick = (event) => {
    if (!gameState.batFound && gameState.screen === 'game' && gameContainerRef.current) {
      try {
        const rect = gameContainerRef.current.getBoundingClientRect();
        const clickX = ((event.clientX - rect.left) / rect.width) * 100;
        const clickY = ((event.clientY - rect.top) / rect.height) * 100;
        
        const distance = Math.sqrt(
          Math.pow(clickX - gameState.batPosition.x, 2) + 
          Math.pow(clickY - gameState.batPosition.y, 2)
        );
        
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const flashlightDistance = Math.sqrt(
          Math.pow(mouseX - gameState.mousePos.x, 2) + 
          Math.pow(mouseY - gameState.mousePos.y, 2)
        );
        
        if (flashlightDistance < 60 && distance < 12) {
          setGameState(prev => ({
            ...prev,
            batFound: true,
            screen: 'result'
          }));
        }
      } catch (error) {
        console.warn('Error in bat click detection:', error);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (gameState.started && !gameState.batFound && gameState.screen === 'game' && gameContainerRef.current) {
      try {
        const rect = gameContainerRef.current.getBoundingClientRect();
        const mousePos = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
        
        setGameState(prev => ({ ...prev, mousePos }));
        
        if (illuminatedSceneRef.current) {
          const maskImage = `radial-gradient(circle 60px at ${mousePos.x}px ${mousePos.y}px, white 0%, white 100%, transparent 100%)`;
          illuminatedSceneRef.current.style.webkitMaskImage = maskImage;
          illuminatedSceneRef.current.style.maskImage = maskImage;
        }
        
        if (flashlightIndicatorRef.current) {
          flashlightIndicatorRef.current.style.left = (mousePos.x - 64) + 'px';
          flashlightIndicatorRef.current.style.top = (mousePos.y - 64) + 'px';
        }
      } catch (error) {
        console.warn('Error in mouse move handling:', error);
      }
    }
  };

  const resultTexts = [
    "💤 SLEEPY BAT! 💤",
    "🦇 FLYING HIGH! 🦇", 
    "👁️ WIDE AWAKE! 👁️",
    "🧛 SPOOKY BAT! 🧛"
  ];

  return (
    <div className="font-sans">
      <link 
        href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" 
        rel="stylesheet" 
      />
      <style>{`
        
        .game-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Comic Neue', cursive;
        }
        
        .night-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e, #0f3460);
          z-index: 1;
        }
        
        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fef08a;
          border-radius: 50%;
          animation: twinkle 3s infinite;
          z-index: 3;
        }
        
        .big-star {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          opacity: 0.8;
          animation: ping 4s infinite;
          z-index: 3;
        }
        
        .firefly {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #fde047;
          border-radius: 50%;
          opacity: 0.7;
          animation: bounce 3s infinite;
          z-index: 3;
          box-shadow: 0 0 10px #fde047;
        }
        
        .screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        
        .game-screen {
          cursor: none;
          z-index: 3;
        }
        
        .game-box {
          background: rgba(0, 0, 0, 0.7);
          padding: 2rem;
          border-radius: 1.5rem;
          border: 4px solid #fde047;
          text-align: center;
        }
        
        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #fde047;
          margin-bottom: 1rem;
        }
        
        .subtitle {
          font-size: 1.25rem;
          color: #bfdbfe;
          margin-bottom: 2rem;
        }
        
        .button {
          padding: 1rem 2.5rem;
          background: linear-gradient(to right, #7c3aed, #2563eb);
          color: white;
          border: 2px solid #fde047;
          border-radius: 2rem;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
          font-family: 'Comic Neue', cursive;
        }
        
        .button:hover {
          transform: scale(1.05);
        }
        
        .result-button {
          background: linear-gradient(to right, #10b981, #2563eb);
        }
        
        .illuminated-scene {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #1e293b, #334155, #475569);
          z-index: 4;
        }
        
        .flashlight-indicator {
          position: absolute;
          width: 128px;
          height: 128px;
          border: 4px solid #facc15;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(255,255,0,0.1) 0%, transparent 70%);
          box-shadow: 0 0 30px rgba(255, 255, 0, 0.4);
          z-index: 5;
        }
        
        .moon {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 480px;
          height: 480px;
          z-index: 2;
        }
        
        .bat-container {
          position: absolute;
          transform: translate(-50%, -50%);
          transition: all 0.5s ease-in-out;
        }
        
        .result-text {
          font-size: 2.5rem;
          font-weight: bold;
          color: #fde047;
          margin-bottom: 1rem;
        }
        
        .moon-phase-text {
          font-size: 1.125rem;
          color: #bfdbfe;
          margin-bottom: 1rem;
        }
        
        .zoom-in {
          animation: zoomIn 0.8s ease-out;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.3; 
            transform: scale(0.8);
          }
        }
        
        @keyframes ping {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          75%, 100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7;
          }
          25% {
            transform: translateY(-10px) scale(1.1);
            opacity: 1;
          }
          50% { 
            transform: translateY(-20px) scale(1.2); 
            opacity: 0.9;
          }
          75% {
            transform: translateY(-10px) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes zoomIn {
          from {
            transform: scale(0.1);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div 
        className="game-container" 
        ref={gameContainerRef}
        onMouseMove={handleMouseMove}
        onClick={checkBatClick}
      >
        {/* Night Background */}
        <div className="night-background">
          {/* Stars */}
          {backgroundElements.stars.map(star => (
            <div
              key={`star-${star.id}`}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#fef08a',
                borderRadius: '50%',
                zIndex: 3
              }}
            />
          ))}
          
          {/* Big Stars */}
          {backgroundElements.bigStars.map(star => (
            <div
              key={`big-star-${star.id}`}
              className="big-star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: 'white',
                borderRadius: '50%',
                opacity: 0.8,
                zIndex: 3
              }}
            />
          ))}
          
          {/* Fireflies */}
          {backgroundElements.fireflies.map(firefly => (
            <div
              key={`firefly-${firefly.id}`}
              className="firefly"
              style={{
                left: `${firefly.left}%`,
                top: `${firefly.top}%`,
                animationDelay: `${firefly.animationDelay}s`,
                animationDuration: `${firefly.animationDuration}s`,
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: '#fde047',
                borderRadius: '50%',
                opacity: 0.7,
                zIndex: 3,
                boxShadow: '0 0 10px #fde047'
              }}
            />
          ))}

          {/* Gothic Castle */}
          <svg 
            style={{
              position: 'absolute', 
              bottom: 0, 
              left: '35%', 
              width: '400px', 
              height: '240px', 
              zIndex: 2
            }} 
            viewBox="0 0 400 240"
          >
            <rect x="40" y="120" width="240" height="120" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2" />
            <rect x="0" y="80" width="80" height="160" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2" />
            <rect x="280" y="90" width="70" height="150" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2" />
            <rect x="170" y="60" width="60" height="180" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2" />
            <polygon points="0,80 40,30 80,80" fill="#2a2a2a" stroke="#0a0a0a" strokeWidth="2" />
            <polygon points="170,60 200,20 230,60" fill="#2a2a2a" stroke="#0a0a0a" strokeWidth="2" />
            <polygon points="280,90 315,50 350,90" fill="#2a2a2a" stroke="#0a0a0a" strokeWidth="2" />
            <path d="M 140 180 Q 140 160 160 160 L 180 160 Q 200 160 200 180 L 200 240 L 140 240 Z" fill="#000" stroke="#0a0a0a" strokeWidth="1" />
            <path d="M 25 130 Q 25 120 35 120 Q 45 120 45 130 L 45 150 L 25 150 Z" fill="#ff8c00" opacity="0.6" />
            <path d="M 185 100 Q 185 90 195 90 Q 205 90 205 100 L 205 115 L 185 115 Z" fill="#ff8c00" opacity="0.7" />
            <path d="M 300 130 Q 300 120 310 120 Q 320 120 320 130 L 320 145 L 300 145 Z" fill="#ff8c00" opacity="0.5" />
          </svg>

          {/* Nighttime Forest Landscape */}
          <svg 
            style={{
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '100%', 
              height: '300px', 
              zIndex: 2
            }} 
            viewBox="0 0 1200 300" 
            preserveAspectRatio="none"
          >
            {/* Background Hills */}
            <path d="M 0 250 Q 200 200 400 240 Q 600 180 800 220 Q 1000 160 1200 200 L 1200 300 L 0 300 Z" fill="#0f172a" opacity="0.8" />
            <path d="M 0 270 Q 150 230 300 260 Q 450 210 600 250 Q 750 190 900 240 Q 1050 180 1200 220 L 1200 300 L 0 300 Z" fill="#1e293b" opacity="0.9" />
            
            {/* Dark Forest Trees */}
            {/* Large Pine Tree 1 */}
            <polygon points="80,300 60,200 100,200" fill="#0f172a" />
            <polygon points="80,300 65,220 95,220" fill="#1e293b" />
            <polygon points="80,300 70,240 90,240" fill="#334155" />
            <rect x="75" y="260" width="10" height="40" fill="#0a0a0a" />
            
            {/* Large Pine Tree 2 */}
            <polygon points="180,300 155,180 205,180" fill="#0f172a" />
            <polygon points="180,300 160,200 200,200" fill="#1e293b" />
            <polygon points="180,300 165,220 195,220" fill="#334155" />
            <rect x="175" y="240" width="10" height="60" fill="#0a0a0a" />
            
            {/* Medium Tree 3 */}
            <polygon points="280,300 260,220 300,220" fill="#1e293b" />
            <polygon points="280,300 265,240 295,240" fill="#334155" />
            <rect x="275" y="260" width="10" height="40" fill="#0a0a0a" />
            
            {/* Large Pine Tree 4 (behind castle) */}
            <polygon points="680,300 650,160 710,160" fill="#0f172a" />
            <polygon points="680,300 660,180 700,180" fill="#1e293b" />
            <polygon points="680,300 665,200 695,200" fill="#334155" />
            <rect x="675" y="220" width="10" height="80" fill="#0a0a0a" />
            
            {/* Large Pine Tree 5 */}
            <polygon points="850,300 820,170 880,170" fill="#0f172a" />
            <polygon points="850,300 830,190 870,190" fill="#1e293b" />
            <polygon points="850,300 835,210 865,210" fill="#334155" />
            <rect x="845" y="230" width="10" height="70" fill="#0a0a0a" />
            
            {/* Medium Tree 6 */}
            <polygon points="980,300 955,210 1005,210" fill="#1e293b" />
            <polygon points="980,300 960,230 1000,230" fill="#334155" />
            <rect x="975" y="250" width="10" height="50" fill="#0a0a0a" />
            
            {/* Small Trees and Bushes */}
            <ellipse cx="120" cy="280" rx="25" ry="20" fill="#1e293b" />
            <ellipse cx="320" cy="285" rx="20" ry="15" fill="#334155" />
            <ellipse cx="420" cy="290" rx="30" ry="10" fill="#1e293b" />
            <ellipse cx="750" cy="285" rx="25" ry="15" fill="#334155" />
            <ellipse cx="1050" cy="280" rx="35" ry="20" fill="#1e293b" />
            
            {/* Ground/Forest Floor */}
            <rect x="0" y="290" width="1200" height="10" fill="#0a0a0a" />
          </svg>
        </div>

        {/* Moon */}
        <div className="moon">
          <MoonPhase phase={gameState.moonPhase} />
        </div>

        {/* Start Screen */}
        {gameState.screen === 'start' && (
          <div className="screen">
            <div className="game-box">
              <h1 className="title">🦇 Where's the Bat? 🦇</h1>
              <p className="subtitle">Find the hidden bat in the moonlit night!</p>
              <button className="button" onClick={startGame}>🔦 Start Hunt</button>
            </div>
          </div>
        )}

        {/* Game Screen */}
        {gameState.screen === 'game' && (
          <div className="screen game-screen">
            {/* Flashlight Area - this contains everything that should be revealed by flashlight */}
            <div 
              className="illuminated-scene" 
              ref={illuminatedSceneRef}
              style={{
                maskImage: 'radial-gradient(circle 60px at 50% 50%, white 0%, white 100%, transparent 100%)',
                webkitMaskImage: 'radial-gradient(circle 60px at 50% 50%, white 0%, white 100%, transparent 100%)'
              }}
            >
              {/* Illuminated Nighttime Forest */}
              <svg 
                style={{
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '16rem'
                }} 
                viewBox="0 0 1000 200" 
                preserveAspectRatio="none"
              >
                {/* Illuminated Trees - darker but visible */}
                {/* Tree 1 */}
                <rect x="50" y="120" width="20" height="80" fill="#2d1b10" />
                <ellipse cx="60" cy="110" rx="40" ry="35" fill="#1e3a1e" />
                <ellipse cx="60" cy="95" rx="35" ry="30" fill="#2d5a2d" />
                <ellipse cx="60" cy="85" rx="25" ry="25" fill="#3d703d" />
                
                {/* Tree 2 */}
                <rect x="200" y="100" width="25" height="100" fill="#2d1b10" />
                <ellipse cx="212" cy="90" rx="50" ry="40" fill="#1e3a1e" />
                <ellipse cx="212" cy="70" rx="40" ry="35" fill="#2d5a2d" />
                <ellipse cx="212" cy="55" rx="30" ry="30" fill="#3d703d" />
                
                {/* Illuminated Castle (darker version) */}
                <rect x="400" y="100" width="240" height="100" fill="#4a4a4a" stroke="#363636" strokeWidth="2" />
                <rect x="360" y="60" width="80" height="140" fill="#4a4a4a" stroke="#363636" strokeWidth="2" />
                <rect x="640" y="70" width="70" height="130" fill="#4a4a4a" stroke="#363636" strokeWidth="2" />
                <rect x="570" y="40" width="60" height="160" fill="#4a4a4a" stroke="#363636" strokeWidth="2" />
                <polygon points="360,60 400,30 440,60" fill="#5a3030" stroke="#4a2020" strokeWidth="2" />
                <polygon points="570,40 600,10 630,40" fill="#5a3030" stroke="#4a2020" strokeWidth="2" />
                <polygon points="640,70 675,40 710,70" fill="#5a3030" stroke="#4a2020" strokeWidth="2" />
                
                {/* Castle Windows (glowing) */}
                <path d="M 385 110 Q 385 100 395 100 Q 405 100 405 110 L 405 125 L 385 125 Z" fill="#ffaa00" />
                <path d="M 585 80 Q 585 70 595 70 Q 605 70 605 80 L 605 95 L 585 95 Z" fill="#ffaa00" />
                <path d="M 660 110 Q 660 100 670 100 Q 680 100 680 110 L 680 125 L 660 125 Z" fill="#ffaa00" />
                
                {/* Tree 3 (Pine-like) */}
                <polygon points="800,200 780,120 820,120" fill="#1e3a1e" />
                <polygon points="800,200 785,140 815,140" fill="#2d5a2d" />
                <polygon points="800,200 790,160 810,160" fill="#3d703d" />
                <rect x="795" y="180" width="10" height="20" fill="#2d1b10" />
                
                {/* Tree 4 (Pine-like) */}
                <polygon points="950,200 925,110 975,110" fill="#1e3a1e" />
                <polygon points="950,200 930,130 970,130" fill="#2d5a2d" />
                <polygon points="950,200 935,150 965,150" fill="#3d703d" />
                <rect x="945" y="170" width="10" height="30" fill="#2d1b10" />
                
                {/* Dark grass/undergrowth */}
                <ellipse cx="100" cy="190" rx="60" ry="10" fill="#1a2e1a" />
                <ellipse cx="300" cy="195" rx="80" ry="5" fill="#1a2e1a" />
                <ellipse cx="500" cy="185" rx="100" ry="15" fill="#1a2e1a" />
                <ellipse cx="750" cy="195" rx="70" ry="5" fill="#1a2e1a" />
                
                {/* Ground */}
                <rect x="0" y="180" width="1000" height="20" fill="#0f1f0f" />
              </svg>
              
              {/* Bat - THIS IS NOW INSIDE THE MASKED AREA */}
              <div 
                className="bat-container"
                style={{
                  left: `${gameState.batPosition.x}%`,
                  top: `${gameState.batPosition.y}%`
                }}
              >
                <BatComponent isRevealed={false} pose={gameState.currentPose} />
              </div>
            </div>
            
            {/* Flashlight Indicator */}
            <div className="flashlight-indicator" ref={flashlightIndicatorRef}></div>
          </div>
        )}

        {/* Result Screen */}
        {gameState.screen === 'result' && (
          <div className="screen">
            <div className="game-box">
              <div className="zoom-in">
                <BatComponent isRevealed={true} pose={gameState.currentPose} />
              </div>
              <div className="result-text">{resultTexts[gameState.currentPose]}</div>
              <div className="moon-phase-text">
                Found under the {getMoonPhaseName(gameState.moonPhase)}!
              </div>
              <button className="button result-button" onClick={resetGame}>
                🌙 Hunt Again?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatHuntGame;