'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Matter from 'matter-js';

const chars = ['অ', 'আ', 'ক', 'খ', 'গ', 'ঘ', 'চ', 'ছ', 'জ', 'ঝ', 'ট', 'ঠ', 'ড', 'ঢ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ'];

export default function BornoStack() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const cvs = useRef<HTMLCanvasElement>(null);
  const eng = useRef(Matter.Engine.create({ gravity: { x: 0, y: 0.45 } }));
  const letters = useRef<any[]>([]);
  const bounds = useRef({ w: 0, h: 0 });

  useEffect(() => {
    if (!cvs.current) return;
    const c = cvs.current;
    const ctx = c.getContext('2d', { alpha: false });
    const dpr = window.devicePixelRatio || 1;
    let fid: number;

    const sync = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      bounds.current = { w, h };
      
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      if (ctx) ctx.scale(dpr, dpr);

      Matter.World.clear(eng.current.world, false);
      const floor = Matter.Bodies.rectangle(w / 2, h + 20, w, 40, { isStatic: true, label: 'floor' });
      
      const baseWidth = w < 768 ? 240 : 320;
      const base = Matter.Bodies.rectangle(w / 2, h - 100, baseWidth, 40, { 
        isStatic: true, 
        label: 'base',
        chamfer: { radius: 10 }
      });
      
      Matter.Composite.add(eng.current.world, [floor, base]);

      const mouse = Matter.Mouse.create(c);
      mouse.pixelRatio = dpr; 
      const mc = Matter.MouseConstraint.create(eng.current, {
        mouse,
        constraint: { 
          stiffness: 0.4, 
          angularStiffness: 0.1,
          render: { visible: false } 
        }
      });
      Matter.Composite.add(eng.current.world, mc);
    };

    sync();
    window.addEventListener('resize', sync);

    Matter.Events.on(eng.current, 'collisionStart', (e) => {
      e.pairs.forEach((p) => {
        if ((p.bodyA.label === 'floor' || p.bodyB.label === 'floor') && started) {
            setOver(true);
            setStarted(false);
        }
      });
    });

    const render = () => {
      if (!ctx) return;
      const { w, h } = bounds.current;
      Matter.Engine.update(eng.current, 1000 / 60);
      
      ctx.fillStyle = '#010804';
      ctx.fillRect(0, 0, w, h);

      const bw = w < 768 ? 240 : 320;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(w / 2 - bw/2, h - 120, bw, 40);
      ctx.fillStyle = 'rgba(0, 255, 204, 0.1)';
      ctx.fillRect(w / 2 - (bw-40)/2, h - 140, bw - 40, 20);
      ctx.fillRect(w / 2 - (bw-120)/2, h - 160, bw - 120, 20);

      letters.current.forEach((l) => {
        const { position: pos, angle } = l.body;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        
        if (l.mat === 'glass') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 255, 204, 0.3)';
            ctx.fillStyle = 'rgba(0, 255, 204, 0.05)';
            ctx.strokeStyle = 'rgba(0, 255, 204, 0.6)';
            ctx.lineWidth = 1.5;
        } else {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.fillStyle = '#121212';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
        }

        ctx.beginPath();
        ctx.roundRect(-28, -28, 56, 56, 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = l.mat === 'glass' ? '#00ffcc' : '#f0f0f0';
        ctx.font = 'bold 32px "Hind Siliguri"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(l.txt, 0, 0);
        ctx.restore();
      });

      fid = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', sync);
      cancelAnimationFrame(fid);
      Matter.Engine.clear(eng.current);
      Matter.Composite.clear(eng.current.world, false);
    };
  }, [started]);

  useEffect(() => {
    let timeoutId: any;
    if (started && !over) {
        const spawn = () => {
            const { w } = bounds.current;
            const x = Math.random() * (w - 120) + 60;
            const txt = chars[Math.floor(Math.random() * chars.length)];
            const mat = Math.random() > 0.5 ? 'stone' : 'glass';
            const body = Matter.Bodies.rectangle(x, -50, 56, 56, {
                restitution: 0.2,
                friction: 0.6,
                frictionAir: 0.04,
                label: 'char'
            });
            
            Matter.Composite.add(eng.current.world, body);
            letters.current.push({ body, txt, mat });
            setScore(s => s + 1);

            let nextDelay = 2200;
            if (score >= 8) {
              nextDelay = Math.max(800, 2200 - ((score - 8) * 70));
            }
            timeoutId = setTimeout(spawn, nextDelay);
        };
        timeoutId = setTimeout(spawn, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [started, over, score]);

  const reset = () => {
    letters.current = [];
    setScore(0);
    setOver(false);
    setStarted(true);
    Matter.World.clear(eng.current.world, false);
    const { w, h } = bounds.current;
    const floor = Matter.Bodies.rectangle(w / 2, h + 20, w, 40, { isStatic: true, label: 'floor' });
    const bw = w < 768 ? 240 : 320;
    const base = Matter.Bodies.rectangle(w / 2, h - 100, bw, 40, { isStatic: true, label: 'base', chamfer: { radius: 10 } });
    Matter.Composite.add(eng.current.world, [floor, base]);
  };

  return (
    <div className="relative w-full h-screen bg-[#010804] overflow-hidden">
      <canvas ref={cvs} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing touch-none" />
      
      <div className="relative z-10 w-full h-full pointer-events-none p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-bold">Borno Stack</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Score</p>
            <p className="text-6xl font-thin text-white tracking-tighter">{score}</p>
          </div>
        </div>

        <AnimatePresence>
          {!started && !over && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#010804]/80 backdrop-blur-xl pointer-events-auto">
              <h1 className="font-bangla text-8xl text-white mb-6 font-thin tracking-tighter">বর্ণ স্ট্যাক</h1>
              <p className="font-mono text-[10px] text-white/40 mb-12 tracking-[0.5em] uppercase max-w-xs text-center leading-loose">
                Stabilize the character tower of Bangla letters.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setStarted(true)} className="px-12 py-4 bg-emerald-500 text-black font-mono text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    Start
                </button>
              </div>
            </motion.div>
          )}

          {over && (
            <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-3xl pointer-events-auto">
              <p className="font-mono text-[10px] uppercase tracking-[0.8em] text-red-500 font-bold mb-4">Structural Failure</p>
              <h1 className="font-bangla text-9xl text-white mb-8 font-black">ব্যর্থ</h1>
              <p className="font-mono text-xs text-white/40 mb-16 uppercase tracking-[0.4em]">Your Score: {score}</p>
              
              <div className="flex gap-6">
                <Link href="/">
                    <button className="px-10 py-5 border border-white/10 text-white/60 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Exit to Core
                    </button>
                </Link>
                <button onClick={reset} className="px-14 py-5 bg-white text-black font-mono text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl">
                    Retry Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}