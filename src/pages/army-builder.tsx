import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useArmy } from '@/context/army-context';
import { useSettings } from '@/context/settings-context';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  loadFactionData,
  type FactionPayload,
} from '@/lib/faction-data-service';
import { enrichArmyDraft } from '@/features/army/domain/builder-service';
import {
  buildCatalog,
  canControl,
  builderFactions,
  optionKey,
  validateArmy,
  type ArmyDraft,
  type BuilderEntry,
  type CatalogOption,
} from '@/features/army/domain/army-builder';
import { validateArmyDrafts } from '@/features/army/domain/builder-storage';
import { STORAGE_KEYS } from '@/shared/storage/storage-keys';
import { PageHeader, Panel, Readout } from '@/components/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const emptyDraft: ArmyDraft = {
  name: '',
  factionId: 101,
  pointsLimit: 300,
  entries: [],
};

export default function ArmyBuilderPage() {
  const [params] = useSearchParams();
  return (
    <ArmyBuilder
      key={params.get('list') || 'new'}
      sourceId={params.get('list')}
    />
  );
}

function ArmyBuilder({ sourceId }: { sourceId: string | null }) {
  const { storedLists, saveList } = useArmy();
  const { settings } = useSettings();
  const [drafts, setDrafts] = useLocalStorage<Record<string, ArmyDraft>>(
    STORAGE_KEYS.armyDrafts,
    {},
    { validate: validateArmyDrafts },
  );
  const draftId = sourceId || 'new';
  const source = sourceId ? storedLists[sourceId]?.builderDraft : undefined;
  const draft = drafts[draftId] || source || emptyDraft;
  const [loaded, setLoaded] = useState<{
    factionId: number;
    data: FactionPayload | null;
  } | null>(null);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [onlyLieutenants, setOnlyLieutenants] = useState(false);
  const [activeGroup, setActiveGroup] = useState(1);
  const [customOpen, setCustomOpen] = useState(false);
  const [customPoints, setCustomPoints] = useState('');
  const [pendingFaction, setPendingFaction] = useState<number | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedDraft, setSavedDraft] = useState('');
  const data = loaded?.factionId === draft.factionId ? loaded.data : null;
  const loading = loaded?.factionId !== draft.factionId;
  useEffect(() => {
    let current = true;
    loadFactionData(draft.factionId).then((data) => {
      if (current) setLoaded({ factionId: draft.factionId, data });
    });
    return () => {
      current = false;
    };
  }, [draft.factionId, reload]);

  const catalog = useMemo(
    () => (data ? buildCatalog(data, draft.factionId) : []),
    [data, draft.factionId],
  );
  const optionMap = useMemo(
    () => new Map(catalog.map((o) => [o.key, o])),
    [catalog],
  );
  const result = useMemo(
    () => (data ? validateArmy(draft, catalog, data) : null),
    [draft, catalog, data],
  );
  const groups = [
    ...new Set([1, activeGroup, ...draft.entries.map((e) => e.combatGroup)]),
  ].sort((a, b) => a - b);
  const unitGroups = useMemo(() => {
    const filtered = catalog.filter(
      (o) =>
        (!onlyLieutenants || o.lieutenant) &&
        [o.unitName, o.name, ...o.skills, ...o.weapons, ...o.equipment]
          .join(' ')
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase().trim()),
    );
    const units = new Map<number, CatalogOption[]>();
    filtered.forEach((o) => units.set(o.id, [...(units.get(o.id) || []), o]));
    return [...units.values()].sort((a, b) =>
      a[0].unitName.localeCompare(b[0].unitName),
    );
  }, [catalog, onlyLieutenants, search]);

  function update(next: ArmyDraft) {
    setDrafts((prev) => ({ ...prev, [draftId]: next }));
    setMessage('');
  }
  function add(option: CatalogOption) {
    const entry: BuilderEntry = {
      key: crypto.randomUUID(),
      id: option.id,
      groupId: option.groupId,
      optionId: option.optionId,
      combatGroup: activeGroup,
    };
    const next = { ...draft, entries: [...draft.entries, entry] };
    if (!data) return;
    const blocked = validateArmy(next, catalog, data).issues.find(
      (i) => i.blocking,
    );
    if (blocked) {
      setMessage(blocked.message);
      return;
    }
    update(next);
  }
  function move(entry: BuilderEntry, group: number) {
    const option = optionMap.get(optionKey(entry));
    const moved = new Set(
      draft.entries
        .filter(
          (e) => e.key === entry.key || (option?.jumper && e.id === entry.id),
        )
        .map((e) => e.key),
    );
    const next = {
      ...draft,
      entries: draft.entries.map((e) =>
        moved.has(e.key) || (e.controllerKey && moved.has(e.controllerKey))
          ? { ...e, combatGroup: group }
          : e,
      ),
    };
    if (data) {
      const blocked = validateArmy(next, catalog, data).issues.find((i) =>
        ['combat-group', 'linked-group', 'controller-group'].includes(i.code),
      );
      if (blocked) {
        setMessage(blocked.message);
        return;
      }
    }
    update(next);
  }
  async function save() {
    if (!data || !result?.valid || saving) return;
    setSaving(true);
    try {
      const list = await enrichArmyDraft(draft, settings.measurementUnit);
      saveList(list);
      setSavedDraft(JSON.stringify(draft));
      setMessage(
        'Saved to your library. Assign it to List A or B in Army Lists.',
      );
    } catch {
      setMessage(
        'Could not save this army. Your draft is still here; please try again.',
      );
    } finally {
      setSaving(false);
    }
  }
  const changeFaction = (factionId: number) => {
    update({ ...draft, factionId, entries: [] });
    setActiveGroup(1);
    setSearch('');
    setPendingFaction(null);
  };
  const chosenFaction = builderFactions.find((f) => f.id === draft.factionId);
  const validCustom =
    /^\d+$/.test(customPoints) &&
    Number.isSafeInteger(Number(customPoints)) &&
    Number(customPoints) > 0;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <PageHeader
        eyebrow="Army workshop / N5"
        title="Build your army"
        description="Choose your force, assemble its loadouts, and prepare a legal roster for the table."
        actions={
          <Button variant="outline" asChild>
            <Link to="/army-lists">Army Lists</Link>
          </Button>
        }
      />
      <Panel
        eyebrow="01 / Mission parameters"
        title={chosenFaction?.name || 'Choose your force'}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="army-name">Army name</Label>
            <Input
              id="army-name"
              className="h-11"
              placeholder="Untitled army"
              value={draft.name}
              onChange={(e) => update({ ...draft, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="army-faction">Faction / sectorial</Label>
            <Select
              value={String(draft.factionId)}
              onValueChange={(value) => {
                const id = Number(value);
                if (id !== draft.factionId) {
                  if (draft.entries.length) setPendingFaction(id);
                  else changeFaction(id);
                }
              }}
            >
              <SelectTrigger
                id="army-faction"
                className="data-[size=default]:h-11 w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {builderFactions.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Points limit</Label>
            <div className="flex flex-wrap gap-2">
              {[100, 200, 300].map((points) => (
                <Button
                  className="h-11"
                  key={points}
                  aria-pressed={draft.pointsLimit === points}
                  variant={draft.pointsLimit === points ? 'default' : 'outline'}
                  onClick={() => update({ ...draft, pointsLimit: points })}
                >
                  {points} pt
                </Button>
              ))}
              <Button
                className="h-11"
                variant="outline"
                aria-label="Edit points limit"
                onClick={() => {
                  setCustomPoints(String(draft.pointsLimit));
                  setCustomOpen(true);
                }}
              >
                <Pencil className="size-4" />
                {[100, 200, 300].includes(draft.pointsLimit)
                  ? 'Edit'
                  : `${draft.pointsLimit} pt`}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {draft.pointsLimit / 50} base SWC · 1 SWC per 50 points
            </p>
          </div>
        </div>
      </Panel>
      <div
        className="grid grid-cols-2 gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:grid-cols-4"
        aria-label="Army totals"
        aria-live="polite"
      >
        <Readout
          label="Points"
          value={`${result?.points ?? 0} / ${draft.pointsLimit}`}
          className={
            result && result.points > draft.pointsLimit
              ? 'text-destructive'
              : ''
          }
        />
        <Readout
          label="SWC"
          value={`${result?.swc ?? 0} / ${result?.swcLimit ?? draft.pointsLimit / 50}`}
          className={
            result && result.swc > result.swcLimit ? 'text-destructive' : ''
          }
        />
        <Readout label="Troopers" value={`${result?.troopers ?? 0} / 15`} />
        <Readout label="Lieutenant" value={`${result?.lieutenants ?? 0} / 1`} />
      </div>
      {message && (
        <p
          role="status"
          className="rounded-lg border border-border bg-muted/30 p-3 text-sm"
        >
          {message}
        </p>
      )}
      {loading ? (
        <Panel>
          <p role="status">Loading faction profiles…</p>
        </Panel>
      ) : !data ? (
        <Panel>
          <p role="alert">Unable to load this faction.</p>
          <Button
            className="mt-3"
            onClick={() => {
              setLoaded(null);
              setReload((r) => r + 1);
            }}
          >
            Retry
          </Button>
        </Panel>
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel
            eyebrow="02 / Recruitment"
            title="Available units"
            className="min-w-0"
            actions={<Badge variant="outline">{unitGroups.length} units</Badge>}
          >
            <div className="space-y-3 border-b border-border pb-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
                <Input
                  aria-label="Search units and loadouts"
                  className="h-11 pl-9"
                  placeholder="Search units, weapons, skills…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  className="h-11"
                  variant={onlyLieutenants ? 'secondary' : 'outline'}
                  aria-pressed={onlyLieutenants}
                  onClick={() => setOnlyLieutenants((v) => !v)}
                >
                  <ShieldCheck className="size-4" />
                  Lieutenants
                </Button>
                <GroupSelect
                  label="Add to combat group"
                  value={activeGroup}
                  groups={groups}
                  onChange={setActiveGroup}
                />
              </div>
            </div>
            <div className="mt-2 max-h-[65vh] space-y-1 overflow-y-auto pr-1">
              {unitGroups.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No matching units. Try another name, weapon, or skill.
                </p>
              )}
              {unitGroups.map((options) => (
                <details
                  key={options[0].id}
                  className="group rounded-md border border-border/60 open:bg-muted/15"
                  open={search.trim() || onlyLieutenants ? true : undefined}
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 focus-visible:outline-2 focus-visible:outline-ring">
                    <div className="min-w-0">
                      <span className="block font-display text-sm font-semibold">
                        {options[0].unitName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.min(...options.map((o) => o.points))}–
                        {Math.max(...options.map((o) => o.points))} pt ·{' '}
                        {options.length} loadouts
                      </span>
                    </div>
                    <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="divide-y divide-border border-t border-border">
                    {options.map((option) => {
                      const candidate = {
                        ...draft,
                        entries: [
                          ...draft.entries,
                          {
                            ...option,
                            key: 'candidate',
                            combatGroup: activeGroup,
                          },
                        ],
                      };
                      const blocked = validateArmy(
                        candidate,
                        catalog,
                        data,
                      ).issues.find((i) => i.blocking);
                      return (
                        <div key={option.key} className="space-y-2 px-3 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold">
                                {option.name}
                                {option.lieutenant && (
                                  <Badge className="ml-2" variant="secondary">
                                    Lieutenant
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-1 font-mono text-xs text-primary">
                                {option.points} pt ·{' '}
                                {option.bonusSwc
                                  ? `+${option.bonusSwc} SWC bonus`
                                  : `${option.swc} SWC`}{' '}
                                · AVA{' '}
                                {option.ava === 255 ? 'Total' : option.ava}
                              </p>
                            </div>
                            <Button
                              aria-label={`Add ${option.name}, ${option.points} points, option ${option.optionId}`}
                              className="h-11 shrink-0"
                              size="sm"
                              disabled={Boolean(blocked)}
                              title={blocked?.message}
                              onClick={() => add(option)}
                            >
                              <Plus className="size-4" />
                              Add
                            </Button>
                          </div>
                          <Loadout option={option} />
                          {blocked && (
                            <p className="text-xs text-muted-foreground">
                              {blocked.message}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </Panel>
          <div className="min-w-0 space-y-5 xl:sticky xl:top-4">
            <Panel
              eyebrow="03 / Deployment roster"
              title={draft.name.trim() || 'Untitled army'}
              actions={
                <Button
                  variant="ghost"
                  className="h-11"
                  disabled={!draft.entries.length}
                  onClick={() => setClearOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Clear
                </Button>
              }
            >
              <div className="space-y-4">
                {groups.map((group) => (
                  <section
                    key={group}
                    aria-label={`Combat group ${group}`}
                    className="rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 p-3">
                      <h4 className="font-display text-sm font-semibold">
                        Combat group {group}
                      </h4>
                      <span className="font-mono text-xs">
                        {result?.groupCounts[group] || 0} / 10 troopers
                      </span>
                    </div>
                    {!draft.entries.some((e) => e.combatGroup === group) && (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Select loadouts from the catalogue to fill this group.
                      </div>
                    )}
                    <ol className="divide-y divide-border">
                      {draft.entries
                        .filter((e) => e.combatGroup === group)
                        .map((entry) => {
                          const option = optionMap.get(optionKey(entry));
                          return (
                            <li key={entry.key} className="space-y-2 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold">
                                    {option?.name ||
                                      `Unavailable unit ${entry.id}`}
                                    {option?.lieutenant && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2"
                                      >
                                        LT
                                      </Badge>
                                    )}
                                  </p>
                                  <p className="mt-1 font-mono text-xs text-primary">
                                    {option?.points ?? '?'} pt ·{' '}
                                    {option?.bonusSwc
                                      ? `+${option.bonusSwc} SWC bonus`
                                      : `${option?.swc ?? '?'} SWC`}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-11 shrink-0"
                                  aria-label={`Remove ${option?.name || 'unit'}`}
                                  onClick={() =>
                                    update({
                                      ...draft,
                                      entries: draft.entries
                                        .filter((e) => e.key !== entry.key)
                                        .map((e) =>
                                          e.controllerKey === entry.key
                                            ? { ...e, controllerKey: undefined }
                                            : e,
                                        ),
                                    })
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                              {option && <Loadout option={option} compact />}
                              <div className="flex flex-wrap gap-2">
                                <GroupSelect
                                  label={`Combat group for ${option?.name || 'unit'}`}
                                  value={entry.combatGroup}
                                  groups={groups}
                                  disabled={Boolean(entry.controllerKey)}
                                  onChange={(group) => move(entry, group)}
                                />
                                {option?.peripheral && (
                                  <Select
                                    value={entry.controllerKey || 'none'}
                                    onValueChange={(key) => {
                                      const controller = draft.entries.find(
                                        (e) => e.key === key,
                                      );
                                      update({
                                        ...draft,
                                        entries: draft.entries.map((e) =>
                                          e.key === entry.key
                                            ? {
                                                ...e,
                                                controllerKey: controller?.key,
                                                combatGroup:
                                                  controller?.combatGroup ||
                                                  e.combatGroup,
                                              }
                                            : e,
                                        ),
                                      });
                                    }}
                                  >
                                    <SelectTrigger
                                      className="data-[size=default]:h-11 max-w-full"
                                      aria-label={`Controller for ${option.name}`}
                                    >
                                      <SelectValue placeholder="Choose controller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        Choose controller
                                      </SelectItem>
                                      {draft.entries
                                        .filter((e) => {
                                          const o = optionMap.get(optionKey(e));
                                          return o && canControl(option, o);
                                        })
                                        .map((e) => (
                                          <SelectItem key={e.key} value={e.key}>
                                            {optionMap.get(optionKey(e))?.name}{' '}
                                            · Group {e.combatGroup} · #
                                            {draft.entries.indexOf(e) + 1}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </li>
                          );
                        })}
                    </ol>
                  </section>
                ))}
              </div>
              <Button
                className="mt-3 h-11 w-full"
                variant="outline"
                disabled={Math.max(...groups) >= 15}
                onClick={() => setActiveGroup(Math.max(...groups) + 1)}
              >
                <Plus className="size-4" />
                Add combat group
              </Button>
            </Panel>
            <Panel
              title={result?.valid ? 'Ready to save' : 'Roster checks'}
              status={result?.valid ? 'complete' : 'warning'}
            >
              {result?.valid ? (
                <p className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  Standard army-building checks passed.{' '}
                  {draft.pointsLimit - result.points} points unspent.
                </p>
              ) : (
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {result?.issues.map((issue, i) => (
                    <li key={`${issue.code}-${i}`}>{issue.message}</li>
                  ))}
                </ul>
              )}
              <Button
                className="mt-4 h-11 w-full"
                disabled={
                  !result?.valid ||
                  saving ||
                  savedDraft === JSON.stringify(draft)
                }
                onClick={() => void save()}
              >
                <Save className="size-4" />
                {saving
                  ? 'Saving…'
                  : savedDraft === JSON.stringify(draft)
                    ? 'Saved to library'
                    : sourceId
                      ? 'Save as new list'
                      : 'Save to library'}
              </Button>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Draft saved automatically on this device. Standard N5 rules;
                scenario extras and Reinforcements are excluded.{' '}
                <a
                  href="https://infinitythewiki.com/Army_List"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  Army-list rules
                </a>
              </p>
            </Panel>
          </div>
        </div>
      )}
      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom points limit</DialogTitle>
            <DialogDescription>
              SWC scales automatically at 1 per 50 points. Existing units stay
              in your draft.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validCustom) {
                update({ ...draft, pointsLimit: Number(customPoints) });
                setCustomOpen(false);
              }
            }}
          >
            <Label htmlFor="custom-points">Points</Label>
            <Input
              id="custom-points"
              className="mt-2 h-11"
              type="number"
              min="1"
              step="1"
              value={customPoints}
              onChange={(e) => setCustomPoints(e.target.value)}
              autoFocus
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {validCustom
                ? `${Number(customPoints) / 50} base SWC`
                : 'Enter a positive whole number.'}
            </p>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={!validCustom}>
                Apply limit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={pendingFaction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingFaction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change faction?</DialogTitle>
            <DialogDescription>
              This clears the current roster. Saved library lists are kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingFaction(null)}>
              Keep roster
            </Button>
            <Button
              onClick={() => {
                if (pendingFaction !== null) changeFaction(pendingFaction);
              }}
            >
              Change faction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear this roster?</DialogTitle>
            <DialogDescription>
              Remove all selected units from this draft. Saved library lists are
              kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              Keep roster
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                update({ ...draft, entries: [] });
                setActiveGroup(1);
                setClearOpen(false);
              }}
            >
              Clear roster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GroupSelect({
  label,
  value,
  groups,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  groups: number[];
  onChange: (group: number) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={String(value)}
      onValueChange={(value) => onChange(Number(value))}
      disabled={disabled}
    >
      <SelectTrigger className="data-[size=default]:h-11" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectItem key={group} value={String(group)}>
            Group {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Loadout({
  option,
  compact = false,
}: {
  option: CatalogOption;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1 text-xs leading-5">
      <p>{option.weapons.join(' · ')}</p>
      {!compact && (
        <>
          <p className="text-muted-foreground">
            {[...option.skills, ...option.equipment].join(' · ')}
          </p>
          {option.notes.length > 0 && (
            <details>
              <summary className="cursor-pointer text-muted-foreground underline underline-offset-2">
                Profile restrictions
              </summary>
              {option.notes.map((note, i) => (
                <p key={i} className="mt-2 whitespace-pre-line">
                  {note}
                </p>
              ))}
            </details>
          )}
        </>
      )}
      {option.includedNames.length > 0 && (
        <p className="text-muted-foreground">
          Includes {option.includedNames.join(', ')}
        </p>
      )}
    </div>
  );
}
