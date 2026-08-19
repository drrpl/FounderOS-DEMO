'use client';

/**
 * Top-of-sidebar company picker — the one control that decides which of
 * Ramesh's three real businesses the rest of the OS renders. Every page and
 * API route reads through lib/data.ts's getDb(), which resolves the current
 * workspace from the founderos_workspace cookie this component sets, so a
 * switch here re-scopes departments, agents, skills, workflows, and the
 * G-Brain graph everywhere at once — no per-page wiring needed.
 */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, Check, Building2 } from 'lucide-react';
import { WORKSPACES, DEFAULT_WORKSPACE_ID, type WorkspaceId } from '@/lib/workspaces';

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState<WorkspaceId>(DEFAULT_WORKSPACE_ID);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/workspace')
      .then((r) => r.json())
      .then((body: { current?: WorkspaceId }) => {
        if (!cancelled && body?.current) setCurrent(body.current);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const active = WORKSPACES.find((w) => w.id === current) ?? WORKSPACES[0];

  async function select(id: WorkspaceId) {
    setOpen(false);
    if (id === current) return;
    setBusy(true);
    try {
      await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: id }),
      });
      setCurrent(id);
      router.push('/');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${collapsed ? '' : 'px-2.5'} pb-2`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        title={`${active.name} — switch company`}
        aria-label="Switch company"
        aria-expanded={open}
        className={`hoverable flex w-full items-center rounded-sm-t border border-os-border bg-os-surface text-left transition-colors hover:border-os-border-bright disabled:opacity-60 ${
          collapsed ? 'justify-center px-0 py-2' : 'gap-2 px-2.5 py-2'
        }`}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[9px] font-bold text-black"
          style={{ background: active.color }}
        >
          {active.shortLabel.slice(0, 2).toUpperCase()}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11.5px] font-semibold text-os-text">{active.shortLabel}</span>
              <span className="block truncate font-mono text-[9px] uppercase tracking-[0.1em] text-os-dim">
                {WORKSPACES.length} companies
              </span>
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-os-dim" strokeWidth={1.7} />
          </>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-full z-40 mt-1.5 w-64 overflow-hidden rounded-lg border border-os-border-bright bg-os-surface shadow-lg ${
            collapsed ? 'left-0' : 'left-2.5 right-2.5 w-auto'
          }`}
        >
          <div className="flex items-center gap-1.5 border-b border-os-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-os-dim">
            <Building2 className="h-3 w-3" strokeWidth={1.7} />
            Switch company
          </div>
          {WORKSPACES.map((w) => {
            const isActive = w.id === current;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => select(w.id)}
                className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-os-surface2 ${
                  isActive ? 'bg-[var(--accent-soft)]' : ''
                }`}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[9px] font-bold text-black"
                  style={{ background: w.color }}
                >
                  {w.shortLabel.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-os-text">{w.name}</span>
                  <span className="block truncate text-[10px] text-os-dim">{w.tagline}</span>
                </span>
                {isActive && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-os-accent" strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
