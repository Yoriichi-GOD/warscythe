import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import './worldSelect.css';

function scrollBoundary(element) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY) && parent.clientHeight > 0) return parent;
  }
  return document.documentElement;
}

export default function WorldSelect({ label, value, options, onChange, direction = 'auto', placeholder, triggerId, menuClassName = '', commitOnTab = true }) {
  const id = useId();
  const root = useRef(null), trigger = useRef(null), list = useRef(null);
  const search = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false), [host, setHost] = useState(null);
  const [active, setActive] = useState(0), [placement, setPlacement] = useState({});
  const selected = options.findIndex(option => option.value === value);
  const activeIndex = Math.min(active, options.length - 1);
  const optionId = index => `${id}-option-${index}`;
  const show = index => {
    setHost(root.current.closest('.world-archive-backdrop,.command-center-grid,.fitness-realm') || document.body);
    setActive(Math.max(0, index)); setOpen(true);
  };
  const choose = index => {
    if (options[index]) onChange(options[index].value);
    setOpen(false); search.current = { text: '', time: 0 };
  };

  useEffect(() => {
    if (!open) return undefined;
    const outside = event => {
      if (!root.current?.contains(event.target) && !list.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const boundary = scrollBoundary(trigger.current);
    const place = () => {
      let box = trigger.current.getBoundingClientRect();
      const bounds = boundary.getBoundingClientRect(), viewport = window.visualViewport;
      const top = Math.max(bounds.top, viewport?.offsetTop || 0);
      const taskbar = root.current.closest('.world-archive-backdrop') ? null : document.getElementById('warscythe-taskbar')?.getBoundingClientRect();
      const bottom = Math.min(bounds.bottom, viewport ? viewport.offsetTop + viewport.height : window.innerHeight, taskbar?.height ? taskbar.top : Infinity);
      let below = bottom - box.bottom - 12;
      if (direction === 'bottom' && below < 88) {
        const amount = Math.min(180 - below, boundary.scrollHeight - boundary.clientHeight - boundary.scrollTop);
        if (amount > 0) { boundary.scrollTop += amount; box = trigger.current.getBoundingClientRect(); below = bottom - box.bottom - 12; }
      }
      const above = box.top - top - 12;
      const side = direction === 'bottom' ? 'bottom' : below >= Math.min(280, options.length * 44 + 12) || below >= above ? 'bottom' : 'top';
      setPlacement({ side, left: Math.max(8, Math.min(box.left, window.innerWidth - box.width - 8)), width:box.width,
        height:Math.max(44, Math.min(280, side === 'bottom' ? below : above)),
        top:side === 'bottom' ? box.bottom + 7 : undefined, bottom:side === 'top' ? window.innerHeight - box.top + 7 : undefined });
    };
    place(); boundary.addEventListener('scroll', place, { passive:true }); window.addEventListener('resize', place);
    window.visualViewport?.addEventListener('resize', place);
    return () => { boundary.removeEventListener('scroll',place); window.removeEventListener('resize',place); window.visualViewport?.removeEventListener('resize',place); };
  }, [open, options.length, direction]);

  useLayoutEffect(() => {
    if (!open) return;
    const menu = list.current, option = menu.children[activeIndex];
    if (!option) return;
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
  }, [open, activeIndex, placement.height]);

  const keys = event => {
    const current = open ? activeIndex : Math.max(0, selected);
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); return; }
    if (event.key === 'Tab') { if (open && commitOnTab) choose(activeIndex); else setOpen(false); return; }
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : !open ? Math.max(0,selected) : Math.max(0,Math.min(options.length-1,current+(event.key==='ArrowDown'?1:-1)));
      show(next); return;
    }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (open) choose(activeIndex); else show(selected); return; }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const now = Date.now(), text = (now-search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase();
    search.current = {text,time:now};
    const prefix = [...text].every(letter=>letter===text[0]) ? text[0] : text;
    const start = prefix.length === 1 ? current+1 : current;
    for (let step=0;step<options.length;step++) { const index=(start+step)%options.length; if(options[index].label.toLowerCase().startsWith(prefix)){show(index);break;} }
  };
  const currentLabel = options[selected]?.label || placeholder || options[0]?.label;
  return <div className="archive-filter" ref={root} data-open={open || undefined} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget)&&!list.current?.contains(event.relatedTarget))setOpen(false)}}>
    <button ref={trigger} id={triggerId} type="button" role="combobox" aria-label={label} aria-expanded={open} aria-haspopup="listbox"
      aria-controls={open?id:undefined} aria-activedescendant={open?optionId(activeIndex):undefined}
      className="archive-filter-trigger" onKeyDown={keys} onClick={()=>open?setOpen(false):show(selected)}>
      <span title={currentLabel}>{currentLabel}</span><ChevronDown size={16} strokeWidth={1.5} aria-hidden="true"/>
    </button>
    {open && host && createPortal(<div ref={list} id={id} role="listbox" aria-label={label} className={`archive-filter-menu ${menuClassName}`} data-side={placement.side}
      style={{left:placement.left,width:placement.width,top:placement.top,bottom:placement.bottom,maxHeight:placement.height,visibility:placement.width?'visible':'hidden'}}>
      {options.map((option,index)=><div key={option.value} id={optionId(index)} role="option" aria-selected={value===option.value} data-active={activeIndex===index||undefined}
        className="archive-filter-option" onPointerMove={()=>setActive(index)} onPointerDown={event=>event.preventDefault()} onClick={()=>{choose(index);trigger.current?.focus()}}>
        <span>{option.label}</span><Check size={16} strokeWidth={1.5} aria-hidden="true"/>
      </div>)}
    </div>,host)}
  </div>;
}
