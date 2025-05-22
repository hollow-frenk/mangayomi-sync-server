import { BackupData } from "./model/backup";
import { ChangedItems } from "./model/changed";

export function mergeProgress(
  oldData: BackupData,
  data: BackupData,
  changedItems: ChangedItems
): string {
  // Crea una copia profonda per evitare effetti collaterali
  const merged: BackupData = JSON.parse(JSON.stringify(oldData));
  // --- MANGA ---
  const mangaMap = new Map<number, typeof merged.manga[0]>();
  // Inserisci tutti i manga esistenti
  for (const m of merged.manga) mangaMap.set(m.id, m);
  // Aggiorna o aggiungi manga dal nuovo backup
  for (const m of data.manga) {
    const existing = mangaMap.get(m.id);
    if (!existing || m.lastRead > existing.lastRead || m.lastUpdate > existing.lastUpdate) {
      mangaMap.set(m.id, m);
    }
  }
  // Rimuovi manga eliminati
  for (const del of changedItems.deletedMangas) mangaMap.delete(del.mangaId);
  merged.manga = Array.from(mangaMap.values());

  // --- CHAPTERS ---
  const chapterMap = new Map<number, typeof merged.chapters[0]>();
  for (const c of merged.chapters) chapterMap.set(c.id, c);
  for (const c of data.chapters) {
    const existing = chapterMap.get(c.id);
    if (!existing || (c.lastPageRead && Number(c.lastPageRead) > Number(existing.lastPageRead))) {
      chapterMap.set(c.id, c);
    }
  }
  for (const upd of changedItems.updatedChapters) {
    if (upd.deleted) chapterMap.delete(upd.chapterId);
  }
  // Rimuovi capitoli orfani (manga eliminati)
  merged.chapters = Array.from(chapterMap.values()).filter(ch => mangaMap.has(ch.mangaId));

  // --- CATEGORIES ---
  const catMap = new Map<number, typeof merged.categories[0]>();
  for (const c of merged.categories) catMap.set(c.id, c);
  for (const c of data.categories) catMap.set(c.id, c);
  for (const del of changedItems.deletedCategories) catMap.delete(del.categoryId);
  merged.categories = Array.from(catMap.values());

  // --- TRACKS ---
  const trackMap = new Map<number, typeof merged.tracks[0]>();
  for (const t of merged.tracks) trackMap.set(t.id, t);
  for (const t of data.tracks) {
    const existing = trackMap.get(t.id);
    if (!existing || t.lastChapterRead > existing.lastChapterRead) {
      trackMap.set(t.id, t);
    }
  }
  merged.tracks = Array.from(trackMap.values());

  // --- HISTORY ---
  const historyMap = new Map<number, typeof merged.history[0]>();
  for (const h of merged.history) historyMap.set(h.id, h);
  for (const h of data.history) {
    const existing = historyMap.get(h.id);
    if (!existing || Number(h.date) > Number(existing.date)) {
      historyMap.set(h.id, h);
    }
  }
  // Rimuovi history di manga eliminati
  merged.history = Array.from(historyMap.values()).filter(h => mangaMap.has(h.mangaId));

  // --- UPDATES ---
  const updateMap = new Map<number, typeof merged.updates[0]>();
  for (const u of merged.updates || []) updateMap.set(u.id, u);
  for (const u of data.updates || []) updateMap.set(u.id, u);
  merged.updates = Array.from(updateMap.values());

  return JSON.stringify(merged);
}
