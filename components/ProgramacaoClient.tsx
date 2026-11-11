'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

// Ilhas client da seção Programação. Os cards e a grade são renderizados no
// servidor (components/Programacao.tsx) e chegam aqui como `children`; este
// arquivo só cuida das abas por dia, do filtro por auditório e do "agora".

export type DayMeta = {
  key: string;
  /** "Sexta-feira" */
  weekday: string;
  /** "20/11" */
  date: string;
  /** 00:00 do dia no fuso do evento, em epoch ms */
  startsAt: number;
};
export type RoomOption = { value: string; label: string };

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Fontes externas (relógio e ?dia=). No servidor e durante a hidratação ambas
// valem `null`, então o HTML inicial é sempre o mesmo e não há mismatch.
// ---------------------------------------------------------------------------

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}
// Arredondado ao minuto para o snapshot ser estável entre leituras.
const readMinute = () => Math.floor(Date.now() / 60_000) * 60_000;

function subscribeHistory(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}
const readDiaParam = () => new URLSearchParams(window.location.search).get('dia');

const serverNull = () => null;

// ---------------------------------------------------------------------------

type ScheduleContextValue = {
  days: DayMeta[];
  rooms: RoomOption[];
  active: string;
  todayKey: string | null;
  selectDay: (key: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  now: number | null;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('Componentes da Programação precisam estar dentro de <ScheduleProvider>.');
  return ctx;
}

export const ALL_ROOMS = 'todos';

export function ScheduleProvider({
  days,
  rooms,
  children,
}: {
  days: DayMeta[];
  rooms: RoomOption[];
  children: ReactNode;
}) {
  const now = useSyncExternalStore(subscribeClock, readMinute, serverNull);
  const diaParam = useSyncExternalStore(subscribeHistory, readDiaParam, serverNull);
  const [chosen, setChosen] = useState<string | null>(null);
  const [filter, setFilter] = useState(ALL_ROOMS);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollToLive = useRef(false);
  const checkedInitialScroll = useRef(false);

  const todayKey =
    now === null
      ? null
      : (days.find((d) => now >= d.startsAt && now < d.startsAt + DAY_MS)?.key ?? null);

  // Prioridade: clique do usuário > ?dia= > dia atual do evento > primeiro dia.
  const fromUrl = days.find((d) => d.key === diaParam)?.key;
  const active = chosen ?? fromUrl ?? todayKey ?? days[0].key;

  const selectDay = useCallback((key: string) => {
    setChosen(key);
    scrollToLive.current = true;
    const url = new URL(window.location.href);
    url.searchParams.set('dia', key);
    url.hash = 'programacao';
    window.history.replaceState(null, '', url);
  }, []);

  // Ao abrir uma aba (ou chegar por link direto) durante o evento, rola até o
  // bloco em andamento. Fora do evento não há [data-live] e nada acontece.
  useEffect(() => {
    if (now === null) return; // ainda hidratando
    if (!checkedInitialScroll.current) {
      checkedInitialScroll.current = true;
      if (window.location.hash === '#programacao' || diaParam) scrollToLive.current = true;
    }
    if (!scrollToLive.current) return;
    scrollToLive.current = false;

    const live = rootRef.current?.querySelector<HTMLElement>(
      '[role="tabpanel"]:not([hidden]) [data-live]',
    );
    if (!live || live.offsetParent === null) return; // inexistente ou oculto pelo filtro
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    live.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }, [active, now, diaParam]);

  return (
    <ScheduleContext.Provider
      value={{ days, rooms, active, todayKey, selectDay, filter, setFilter, now }}
    >
      <div ref={rootRef} className="prog" data-room-filter={filter}>
        {children}
      </div>
    </ScheduleContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Abas por dia — padrão WAI-ARIA Tabs com ativação automática
// ---------------------------------------------------------------------------

export function DayTabs() {
  const { days, active, todayKey, selectDay } = useSchedule();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = days.findIndex((d) => d.key === active);
    const last = days.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? current === last ? 0 : current + 1
        : e.key === 'ArrowLeft'
          ? current === 0 ? last : current - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    selectDay(days[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label="Dias do evento" className="prog-tabs" onKeyDown={onKeyDown}>
      {days.map((d, i) => {
        const selected = d.key === active;
        const isToday = d.key === todayKey;
        return (
          <button
            key={d.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`prog-tab-${d.key}`}
            aria-controls={`prog-panel-${d.key}`}
            aria-selected={selected}
            // O rótulo visual quebra em duas linhas no mobile; o nome acessível fica estável.
            aria-label={`${d.weekday} · ${d.date}${isToday ? ' (hoje)' : ''}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => selectDay(d.key)}
            className="prog-tab"
          >
            <span className="prog-tab-weekday">{d.weekday}</span>
            <span className="prog-tab-sep" aria-hidden="true">
              ·
            </span>
            <span className="prog-tab-date">
              {d.date}
              {isToday && <span className="prog-today-dot" aria-hidden="true" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filtro por auditório (só aparece no mobile; ver .prog-filter no CSS)
// ---------------------------------------------------------------------------

export function RoomFilter() {
  const { rooms, filter, setFilter } = useSchedule();
  const options = [{ value: ALL_ROOMS, label: 'Todos' }, ...rooms];

  return (
    <div className="prog-filter" role="group" aria-label="Filtrar por auditório">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={filter === o.value}
          onClick={() => setFilter(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function DayPanel({ dayKey, children }: { dayKey: string; children: ReactNode }) {
  const { active } = useSchedule();
  return (
    <div
      role="tabpanel"
      id={`prog-panel-${dayKey}`}
      aria-labelledby={`prog-tab-${dayKey}`}
      hidden={active !== dayKey}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

/**
 * Linha da programação (bloco de sessões, intervalo ou destaque). Marca com
 * `data-live` + `aria-current="time"` enquanto `start <= agora < end`.
 */
export function LiveBlock({
  start,
  end,
  className,
  rooms,
  children,
}: {
  /** epoch ms */
  start: number;
  end: number;
  className: string;
  /** salas presentes no bloco ("master executivo"), usado pelo filtro */
  rooms?: string;
  children: ReactNode;
}) {
  const { now } = useSchedule();
  const live = now !== null && now >= start && now < end;
  return (
    <div
      className={className}
      data-rooms={rooms}
      data-live={live ? '' : undefined}
      aria-current={live ? 'time' : undefined}
    >
      {children}
    </div>
  );
}
