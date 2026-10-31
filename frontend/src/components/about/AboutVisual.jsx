import { motion, useReducedMotion } from 'framer-motion'

const codeLines = [
  'from fastapi import FastAPI',
  'app = FastAPI()',
  '',
  '@app.get("/")',
  'async def root():',
  '    return {"message": "Hello World"}'
]

export function AboutVisual() {
  const reduced = useReducedMotion()
  return <motion.div initial={{ opacity: 0, x: 30, y: 14 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: reduced ? 0 : .7 }} className="about-visual" aria-label="Abstract developer code environment">
    <div className="about-orbit about-orbit-one" /><div className="about-orbit about-orbit-two" />
    <div className="code-window"><div className="code-window-bar"><span /><span /><span /><p>main.py</p></div><div className="code-window-body">{codeLines.map((line, index) => <motion.p key={line} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : .25 + index * .08 }}><span>{String(index + 1).padStart(2, '0')}</span>{line}</motion.p>)}</div></div>
    <div className="about-float-card about-float-api">REST<br /><strong>API</strong></div><div className="about-float-card about-float-db">DATABASE<br /><strong>READY</strong></div>
    <div className="about-core"><span>AP</span><small>BUILD<br />SYSTEMS</small></div>
  </motion.div>
}
