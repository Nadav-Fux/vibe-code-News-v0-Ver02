'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import React from 'react';
import type { PlatformKey } from '../lib/platforms';
import type { SourceItem } from './use-sources';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export type StudioView =
  | 'command-center'
  | 'flow'
  | 'split'
  | 'workshop'
  | 'writer';

export interface HistoryEntry {
  id: string;
  content: string;
  platform: PlatformKey;
  llm: string;
  createdAt: string;
}

export interface StudioState {
  selectedSources: SourceItem[];
  platform: PlatformKey;
  llm: string;
  tone: string;
  depth: string;
  style: string;
  topic: string;
  history: HistoryEntry[];
  view: StudioView;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type StudioAction =
  | { type: 'SET_PLATFORM'; payload: PlatformKey }
  | { type: 'SET_LLM'; payload: string }
  | { type: 'SET_TONE'; payload: string }
  | { type: 'SET_DEPTH'; payload: string }
  | { type: 'SET_STYLE'; payload: string }
  | { type: 'SET_TOPIC'; payload: string }
  | { type: 'TOGGLE_SOURCE'; payload: SourceItem }
  | { type: 'CLEAR_SOURCES' }
  | { type: 'ADD_HISTORY'; payload: HistoryEntry }
  | { type: 'SET_VIEW'; payload: StudioView };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: StudioState = {
  selectedSources: [],
  platform: 'linkedin',
  llm: 'gemini',
  tone: 'professional',
  depth: 'medium',
  style: 'standard',
  topic: '',
  history: [],
  view: 'command-center',
};

// Max history entries to keep in memory
const MAX_HISTORY = 50;

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_PLATFORM':
      return { ...state, platform: action.payload };
    case 'SET_LLM':
      return { ...state, llm: action.payload };
    case 'SET_TONE':
      return { ...state, tone: action.payload };
    case 'SET_DEPTH':
      return { ...state, depth: action.payload };
    case 'SET_STYLE':
      return { ...state, style: action.payload };
    case 'SET_TOPIC':
      return { ...state, topic: action.payload };
    case 'TOGGLE_SOURCE': {
      const exists = state.selectedSources.some(
        (s) => s.id === action.payload.id,
      );
      return {
        ...state,
        selectedSources: exists
          ? state.selectedSources.filter((s) => s.id !== action.payload.id)
          : [...state.selectedSources, action.payload],
      };
    }
    case 'CLEAR_SOURCES':
      return { ...state, selectedSources: [] };
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, MAX_HISTORY),
      };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StudioContextValue {
  state: StudioState;
  dispatch: Dispatch<StudioAction>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return React.createElement(
    StudioContext.Provider,
    { value: { state, dispatch } },
    children,
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudio must be used within a <StudioProvider>');
  }
  return ctx;
}
