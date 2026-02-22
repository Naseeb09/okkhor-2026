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
      const base = Matter.Bodies.rectangle(w / 2, h - 100, 320, 40, { isStatic: true, label: 'base', chamfer: { radius: 10 } });
      Matter.Composite.add(eng.current.world, [floor, base]);

      const mouse = Matter.Mouse.create(c);
      mouse.pixelRatio = dpr; 
      const mc = Matter.MouseConstraint.create(eng.current, {
        mouse,
        constraint: { stiffness: 0.4, angularStiffness: 0.1, render: { visible: false } }
      });
      Matter.Composite.add(eng.current.world, mc);
    };

    sync();
    window.addEventListener('resize', sync);

    Matter.Events.on(eng.current, 'collisionStart', (e) => {
      e.pairs.forEach((p) => {
        if ((p.bodyA.label === 'floor' || p.bodyB.label === 'floor') && started) setOver(true);
      });
    });

    const render = () => {
      if (!ctx) return;
      const { w, h } = bounds.current;
      Matter.Engine.update(eng.current, 1000 / 60);
      
      ctx.fillStyle = '#020d08';
      ctx.fillRect(0, 0, w, h);

      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(254, 250, 224, 0.2)';
      ctx.fillStyle = 'rgba(254, 250, 224, 0.1)';
      ctx.fillRect(w / 2 - 160, h - 120, 320, 40);

      letters.current.forEach((l) => {
        const { position: pos, angle } = l.body;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = l.mat === 'glass' ? 'rgba(0, 200, 255, 0.4)' : 'rgba(139, 0, 0, 0.4)';
        ctx.fillStyle = l.mat === 'glass' ? 'rgba(100, 200, 255, 0.15)' : 'rgba(80, 80, 80, 0.8)';
        ctx.fillRect(-28, -28, 56, 56);
        
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#fefae0';
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
    const spawn = () => {
      const { w } = bounds.current;
      const x = Math.random() * (w - 100) + 50;
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
      if (started) setScore(s => s + 1);
    };

    const t = setInterval(spawn, started ? 1800 : 4500);
    return () => clearInterval(t);
  }, [started]);

  return (
    <div className="relative w-full h-screen bg-[#020d08] overflow-hidden selection:bg-transparent">
      <canvas ref={cvs} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing touch-none" />
      
      <div className="relative z-10 w-full h-full pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Link href="/" className="pointer-events-auto">
            <button className="px-5 py-2 border border-white/10 rounded-full font-mono text-[10px] uppercase text-white/40 hover:text-white transition-all">
              ← Exit
            </button>
          </Link>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">Active Stack</p>
            <p className="text-5xl font-bold text-white tracking-tighter">{score}</p>
          </div>
        </div>


        <AnimatePresence>
          {!started && !over && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto">
              <h1 className="text-7xl text-white mb-2 font-bold tracking-tighter">বর্ণ স্ট্যাক</h1>
              <p className="font-mono text-[10px] text-white/40 mb-10 tracking-[0.3em] uppercase">Stabilize the character tower</p>
              <button onClick={() => setStarted(true)} className="px-14 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:invert transition-all">
                Start
              </button>
            </motion.div>
          )}

          {over && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#450a0a]/90 backdrop-blur-2xl pointer-events-auto">
              <h1 className="text-9xl text-white mb-4 font-black">ব্যর্থ</h1>
              <p className="font-mono text-sm text-white/60 mb-12 uppercase tracking-widest">Final Count: {score}</p>
              <button onClick={() => window.location.reload()} className="px-12 py-4 border border-white text-white font-mono text-xs uppercase hover:bg-white hover:text-black transition-all">
                Retry Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}