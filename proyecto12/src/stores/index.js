// src/stores/index.js
import { createStore, createEvent, createEffect } from 'effector';

// ----- EFFECTS -----
export const fetchMenuFx = createEffect(async () => {
  const res = await fetch('http://localhost:3001/api/menu.json'); // Adjust if needed
  if (!res.ok) throw new Error('Error fetching menu');
  return res.json();
});

export const fetchTableFx = createEffect(async (label) => {
  // The label is something like 'Artículos', so we fetch /api/Artículos.json
  const res = await fetch(`http://localhost:3001/api/${label}.json`);
  if (!res.ok) throw new Error(`Error fetching data for ${label}`);
  return res.json();
});

// ----- STORES -----
export const $menuData = createStore([])
  .on(fetchMenuFx.doneData, (_, data) => data);

export const $tableData = createStore([])
  .on(fetchTableFx.doneData, (_, data) => data);

export const setActiveMenu = createEvent();
export const $activeMenu = createStore(null)
  .on(setActiveMenu, (_, label) => label);
