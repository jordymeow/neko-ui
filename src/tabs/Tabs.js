// NekoTabs.js
import { getProUrl } from '../common/proUrl';
import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { NekoIcon } from '../misc/Icon';
import { NekoContextMenu } from '../misc/ContextMenu';
import { NekoInput } from '../form/Input';
import { NekoTypo } from '../misc/Typography';
import { NekoPill } from '../misc/Pill';
import { ChevronDown } from 'lucide-react';
import { useClasses, useDeprecatedIsBusy } from '../hooks';
import NekoBusyOverlay from '../common/NekoBusyOverlay';

/**
 * === Defaults (overridable via props) ===
 */
const DEFAULT_MAX_WIDTH = 320;      // default cap; can be raised per instance
const DEFAULT_IDEAL_WIDTH = 120;    // target flex-basis when flexing
const DEFAULT_MIN_WIDTH = 72;       // minimum width before overflow kicks in
const DEFAULT_GAP = 5;              // nominal horizontal gap between tabs (px)
const DEFAULT_MIN_GAP = 2;          // elastic gap floor for content-fit (px)
const DEFAULT_LAYOUT_BUFFER = 12;   // buffer to avoid oscillation at edges
const GAP_SET_EPS = 0.25;           // avoid tiny state updates for subpixel jitter

/* ---------- Styled Components ---------- */

// Root wrapper — gives NekoTabs the same vertical rhythm as NekoBlock so
// stacking blocks + tabs in the same column keeps a consistent gap.
const TabsRoot = Styled.div`
  font-size: var(--neko-font-size);
  margin-bottom: 16px;

  .neko-tab-panel-wrapper {
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }
`;

// "Get AI Engine" pill, shown when mwaiPill is set but AI Engine isn't active. Same gradient
// as the installed AI pill, as an outline, so both states read as one family (not as an error).
const MWAI_GRADIENT = 'linear-gradient(120deg, #818cf8, #a855f7, #ec4899)';
const MwaiPillLink = Styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  background-image: linear-gradient(var(--neko-white), var(--neko-white)), ${MWAI_GRADIENT};
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: hsl(262 60% 45%);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-image 0.2s ease;

  &::after {
    content: '↗';
    font-size: 11px;
    opacity: 0.7;
  }

  &:hover, &:focus {
    color: hsl(262 60% 38%);
    background-image: linear-gradient(hsl(262 80% 98%), hsl(262 80% 98%)), ${MWAI_GRADIENT};
  }
`;

const TabsHeaderContainer = Styled.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: 39px;
`;

const TabsHeader = Styled.div`
  display: flex;
  align-items: stretch;
  height: 39px;
  overflow-x: hidden;     /* we use overflow menu instead of horizontal scroll */
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  max-width: 100%;
  box-shadow: inset 0 -1px 0 var(--neko-gray-90);

  /* Inversed header — no divider, pill active tab is its own marker */
  &.inversed {
    box-shadow: none;
  }

  /* Hide scrollbars defensively */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

const TabsActions = Styled.div`
  display: flex;
  align-items: center;
  height: 39px;
  margin-left: auto;
  flex-shrink: 0;
  gap: 6px;

  /* Chevron animation: scale on hover, rotate when open */
  .neko-tabs-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 120ms ease;
    will-change: transform;
  }

  .neko-tabs-chevron.open { transform: rotate(180deg); }
  .neko-tabs-chevron:hover { transform: scale(1.06); }
  .neko-tabs-chevron.open:hover { transform: scale(1.06) rotate(180deg); }
`;

const TabsTitleSection = Styled.div`
  padding: 2px 4px var(--neko-surface-title-padding-bottom) 4px;

  .neko-tabs-title {
    margin: 0 0 2px 0;
    font-size: var(--neko-surface-title-font-size);
    font-weight: var(--neko-surface-title-font-weight);
    letter-spacing: var(--neko-surface-title-letter-spacing);
    line-height: var(--neko-surface-title-line-height);
    color: var(--neko-font-color);
  }

  .neko-tabs-subtitle {
    font-size: 13px;
    color: var(--neko-gray-50);
    line-height: 1.45;
  }

  /* Inversed — title sits on the brand-blue workspace above a tab panel card.
     Title tokens above keep the spec identical to NekoBlock.primary titles. */
  &.inversed {
    .neko-tabs-title { color: white; }
    .neko-tabs-subtitle { color: rgba(255, 255, 255, 0.72); }
  }
`;

const Tab = Styled.button`
  /* Underline-style tabs — quiet, modern, text-first.
     Only the text color + a slim accent bar marks the active one. */
  border: 0;
  border-radius: 8px 8px 0 0;
  background-color: transparent;
  color: var(--neko-gray-50);
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  padding: 8px 14px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  position: relative;
  transition:
    background var(--neko-duration-base) var(--neko-ease-out),
    color var(--neko-duration-base) var(--neko-ease-out);

  /* Slim accent bar under the active tab */
  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: var(--neko-main-color);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.28s var(--neko-ease-spring);
  }

  &:not(.active):not(.disabled):hover {
    background: color-mix(in oklab, var(--neko-main-color) 5%, transparent);
    color: var(--neko-font-color);
  }

  &:focus { outline: none; }
  /* Focus-visible — subtle bg tint only, no box-shadow ring (the global
     focus ring doesn't match the tab's partial border-radius). */
  &:focus-visible {
    outline: none;
    box-shadow: none;
    background: color-mix(in oklab, var(--neko-main-color) 10%, transparent);
  }

  &.active {
    color: var(--neko-main-color);
    font-weight: 600;
    background: transparent;
  }

  /* Keyboard focus lands on the active tab (roving tabindex), so its tint must win over the transparent background above. */
  &.active:focus-visible {
    background: color-mix(in oklab, var(--neko-main-color) 10%, transparent);
  }

  &.active::after {
    transform: scaleX(1);
  }

  &.disabled {
    cursor: default;
    opacity: 0.55;
    filter: grayscale(0.4);

    /* No hover effect on disabled tabs */
    &:hover { background: transparent; color: var(--neko-gray-50); }
  }

  &.hidden { display: none; }

  /* Busy state - overlay effect matching content */
  &.busy {
    cursor: default;
    pointer-events: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--neko-main-overlay-color);
      border-radius: inherit;
      pointer-events: none;
      z-index: 1;
    }
  }


  /* Inversed = tabs living directly on the brand-blue workspace.
     Pill-style: active tab lifts into white with dark text — crisp "folder tab"
     that connects to the white content card below. */
  &.inversed {
    color: rgba(255, 255, 255, 0.7);
    padding: 9px 16px;
    border-radius: 10px 10px 0 0;
  }
  &.inversed:not(.active):not(.disabled):hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  &.inversed.active {
    color: var(--neko-font-color);
    background: white;
    font-weight: 600;
  }
  &.inversed::after {
    display: none;
  }

  .neko-tab-label {
    position: relative;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    flex: 1 1 auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  /* Fade only when flexing (or when overflow exists) */
  &.needs-fade .neko-tab-label {
    -webkit-mask-image: linear-gradient(to right, black 72%, transparent 100%);
    mask-image: linear-gradient(to right, black 72%, transparent 100%);
  }

  /* Remove underline - we're using gradient animation instead */

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const TabContent = Styled.div`
  /* Full brand-blue workspace. Sections float on it — titles in white,
     content in white cards. Clean and modern. */
  background: var(--neko-main-color);
  color: white;
  display: none;
  padding: 18px;
  border-radius: var(--neko-radius-md);
  margin-top: 8px;

  &.active { display: block; }

  /* Transparent content — for tabs nested inside a white card (underline style),
     so the content area inherits the parent's bg instead of being a blue block. */
  &.transparent {
    background: transparent;
    color: inherit;
    padding: 14px 0 0 0;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
  }

  /* Inversed content = white card that connects seamlessly to the active pill tab above.
     Flat top edges so the tab row doesn't show a rounded white notch against the workspace. */
  &.inversed {
    background-color: var(--neko-white);
    color: var(--neko-font-color);
    margin-top: 0;
    border-radius: 0 0 var(--neko-radius-md) var(--neko-radius-md);
    box-shadow: var(--neko-shadow-sm);
  }
`;

// Overflow menu components (match Select dropdown hover/animation)
const OverflowMenu = Styled.div`
  background: var(--neko-white);
  border: 1px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  box-shadow: var(--neko-shadow-lg);
  min-width: 220px;
  overflow: hidden;
`;

const OverflowList = Styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const OverflowItem = Styled.div`
  padding: 7px 12px;
  cursor: pointer;
  font-size: var(--neko-font-size);
  background: var(--neko-white);
  transition: background-color 0.12s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: var(--neko-main-color-95);
    box-shadow: var(--neko-shadow-xs);
  }
`;

/* ---------- Utilities ---------- */

const getKeyOfTab = (child, i) => {
  const props = child.props || {};
  let key = 'tab-' + (i + 1);
  if (child.key) {
    key = child.key;
  } else if (typeof props.title === 'string') {
    key = props.title
      .toLowerCase()
      .replace(
        /[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u2e80-\u2eff\u31f0-\u31ff\u3200-\u32ff\u3400-\u4dbf\uf900-\ufaff ]/gi,
        ''
      )
      .replace(/ /g, '-');
  }
  return key;
};

const TAB_ATTRIBUTE_FIELDS = ['key', 'title', 'requirePro', 'hidden', 'icon', 'busy'];
const sameTabAttributes = (a, b) => a.length === b.length &&
  a.every((attr, i) => TAB_ATTRIBUTE_FIELDS.every((f) => attr[f] === b[i][f]));

const randomHash = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < length; i++) hash += chars[(Math.random() * chars.length) | 0];
  return hash;
};

/* ---------- Tabs (header + content) ---------- */

const StyledNekoTabs = (props) => {
  const {
    title,
    subtitle,
    inversed,
    transparent,
    children,
    action,
    isPro,
    currentTab,
    onChange,
    keepTabOnReload = false,
    callOnTabChangeFirst = true,
    mwaiPill = false,
    mwaiEnabled = false,
    keepAlive = false,

    // Fine-tuners (optional)
    minWidth = DEFAULT_MIN_WIDTH,
    idealWidth = DEFAULT_IDEAL_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    gap = DEFAULT_GAP,          // preferred inter-tab gap
    minGap = DEFAULT_MIN_GAP,   // elastic floor during content-fit
    chevronReserve: _chevronReserve, // no longer used, kept out of the DOM props
    layoutBuffer = DEFAULT_LAYOUT_BUFFER,

    // a11y
    ariaLabel = 'Tabs',
    ...rest
  } = props;

  const instanceIdRef = useRef(`nt-${randomHash(8)}`);
  const instanceId = instanceIdRef.current;

  const tabsHeaderRef = useRef(null);
  const actionsRef = useRef(null);
  const overflowBtnRef = useRef(null);
  const plusRef = useRef(null);
  const tabRefs = useRef([]);
  const intrinsicCacheRef = useRef({ key: '', attrs: null, widths: {} });

  const [hiddenTabIndices, setHiddenTabIndices] = useState([]);
  const [showOverflow, setShowOverflow] = useState(false);
  const [overflowFilter, setOverflowFilter] = useState('');
  const [useFlex, setUseFlex] = useState(false);
  const [effectiveGap, setEffectiveGap] = useState(gap); // can shrink a bit for content-fit

  const [internalCurrentTab, setInternalCurrentTab] = useState(() => {
    if (typeof currentTab === 'string') return currentTab;
    if (keepTabOnReload && typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        return url.searchParams.get('nekoTab') || '';
      } catch { /* no-op */ }
    }
    return '';
  });

  const initialTabSelected = useRef(false);

  // Render AI Engine pill if mwaiPill is true
  const renderMwaiPill = () => {
    if (!mwaiPill) return null;

    if (mwaiEnabled) {
      return <NekoPill variant="ai">AI Engine</NekoPill>;
    } else {
      return (
        <MwaiPillLink
          href={getProUrl('https://meowapps.com/ai-engine/', 'ai-engine-pill')}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get AI Engine
        </MwaiPillLink>
      );
    }
  };

  // Sync effective gap if the prop changes (recomputed later anyway)
  useEffect(() => { setEffectiveGap(gap); }, [gap]);

  // Persist selected tab in URL if desired (SSR-safe)
  const keepTabInUrl = useCallback((key) => {
    if (typeof window === 'undefined' || !history?.replaceState) return;
    if (typeof key !== 'string') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('nekoTab', key);
      const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?' +
        searchParams.toString();
      window.history.replaceState({ path: newUrl }, '', newUrl);
    } catch { /* no-op */ }
  }, []);

  // Normalize children (preserve keys)
  const validChildren = useMemo(() => {
    const arr = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) arr.push(child);
    });
    return arr;
  }, [children]);

  // Generate attributes (title, key, etc.)
  const freshTabAttributes = useMemo(() => {
    const seen = new Set();
    return validChildren.map((child, i) => {
      let key = child.key || getKeyOfTab(child, i);
      // Deterministic suffix: a random one changed on every recompute and remounted the tab.
      if (seen.has(key)) key = `${key}-${i}`;
      seen.add(key);

      const {
        title = `Untitled Tab ${i + 1}`,
        requirePro: childRequirePro = false,
        hidden = false,
        icon = null,
        busy = false,
        isBusy = false,
      } = child.props || {};

      const requirePro = !isPro && childRequirePro;
      const busyState = busy || isBusy;
      return { key, title, requirePro, hidden, icon, busy: busyState };
    });
  }, [validChildren, isPro]);

  // `children` is a new array on every parent render (each keystroke in a tab's
  // form), which used to rebuild every layout callback, re-measure the header and
  // re-subscribe the ResizeObserver. Keep the previous array while nothing changed.
  const tabAttributesRef = useRef(freshTabAttributes);
  if (!sameTabAttributes(tabAttributesRef.current, freshTabAttributes)) {
    tabAttributesRef.current = freshTabAttributes;
  }
  const tabAttributes = tabAttributesRef.current;

  const tabKeys = useMemo(() => tabAttributes.map((a) => a.key), [tabAttributes]);

  /* ----- Click / selection ----- */

  const onTabClick = useCallback(
    (tabIndex, tabAttr, ev) => {
      if (!tabAttr || tabAttr.requirePro) return;

      // Uncontrolled: update internal state when needed
      if (currentTab === undefined && internalCurrentTab !== tabAttr.key) {
        setInternalCurrentTab(tabAttr.key);
      }

      if (onChange) onChange(tabIndex, tabAttr, ev);
      if (keepTabOnReload) keepTabInUrl(tabAttr.key);
    },
    [currentTab, internalCurrentTab, onChange, keepTabOnReload, keepTabInUrl]
  );

  /* ----- Visible indices (for keyboarding and logic) ----- */

  const visibleIndices = useMemo(() => {
    const hiddenSet = new Set(hiddenTabIndices);
    const out = [];
    for (let i = 0; i < tabAttributes.length; i++) {
      const a = tabAttributes[i];
      if (!a) continue;
      if (a.hidden) continue;
      if (hiddenSet.has(i)) continue;
      out.push(i);
    }
    return out;
  }, [hiddenTabIndices, tabAttributes]);

  /* ----- Keyboard navigation (roving tabIndex) ----- */

  const focusTabByIndex = useCallback((nextIndex) => {
    const el = tabRefs.current[nextIndex];
    if (el && el.focus) el.focus({ preventScroll: true });
  }, []);

  const selectVisibleByOffset = useCallback((fromIndex, delta) => {
    if (!visibleIndices.length) return;
    const pos = visibleIndices.indexOf(fromIndex);
    const at = pos === -1 ? 0 : (pos + delta + visibleIndices.length) % visibleIndices.length;
    const next = visibleIndices[at];
    const nextAttr = tabAttributes[next];
    if (!nextAttr || nextAttr.requirePro) return;
    onTabClick(next, nextAttr);
    focusTabByIndex(next);
  }, [visibleIndices, tabAttributes, onTabClick, focusTabByIndex]);

  const handleTabKeyDown = useCallback((i) => (e) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        selectVisibleByOffset(i, +1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        selectVisibleByOffset(i, -1);
        break;
      case 'Home':
        e.preventDefault();
        if (visibleIndices.length) {
          const first = visibleIndices[0];
          const a = tabAttributes[first];
          if (a && !a.requirePro) {
            onTabClick(first, a);
            focusTabByIndex(first);
          }
        }
        break;
      case 'End':
        e.preventDefault();
        if (visibleIndices.length) {
          const last = visibleIndices[visibleIndices.length - 1];
          const a = tabAttributes[last];
          if (a && !a.requirePro) {
            onTabClick(last, a);
            focusTabByIndex(last);
          }
        }
        break;
      default:
        break;
    }
  }, [visibleIndices, tabAttributes, onTabClick, focusTabByIndex, selectVisibleByOffset]);

  /* ----- Intrinsic width measurement ----- */

  // Measure the natural width of tab i (label text + paddings + icon/badge).
  const getIntrinsicTabWidth = useCallback((i) => {
    const tab = tabRefs.current[i];
    if (!tab || typeof window === 'undefined') return idealWidth;

    const cs = window.getComputedStyle(tab);
    const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

    let sum = padX;

    // Sum widths of children; use scrollWidth for the label to capture full text width.
    const kids = Array.from(tab.children);
    for (const el of kids) {
      const rectW = (el.getBoundingClientRect().width) || 0; // float is fine (avoid ceil inflation)
      if (el.classList && el.classList.contains('neko-tab-label')) {
        const labelW = Math.max((el.scrollWidth) || 0, rectW);
        sum += labelW;
      } else {
        sum += rectW;
      }
    }

    const cap = typeof maxWidth === 'number' ? maxWidth : Number.MAX_SAFE_INTEGER;
    return Math.min(sum, cap);
  }, [idealWidth, maxWidth]);

  /* ----- Overflow calculation (with elastic gaps for content-fit) ----- */

  const hasAction = !!action;
  const computeOverflow = useCallback(() => {
    const header = tabsHeaderRef.current;
    if (!header) return;

    const availableWidth = header.clientWidth;
    const plusWidth = plusRef.current ? plusRef.current.offsetWidth : 0;
    const actionsWidth = actionsRef.current ? actionsRef.current.offsetWidth : 0;

    // Candidate tabs in DOM order (not counting ones explicitly hidden via props)
    const order = [];
    tabRefs.current.forEach((ref, index) => {
      const attr = tabAttributes[index];
      if (!ref || !attr || attr.hidden) return;
      order.push(index);
    });

    const n = order.length;
    if (n === 0) {
      setHiddenTabIndices((prev) => (prev.length ? [] : prev));
      setUseFlex(false);
      setEffectiveGap((prev) => (Math.abs(prev - gap) < GAP_SET_EPS ? prev : gap));
      return;
    }

    const epsilon = layoutBuffer;
    const availableNoOverflow = availableWidth - actionsWidth - epsilon;

    // Cache intrinsic widths; only re-measure when the tabs themselves change
    // (added/removed/reordered, or a new title/icon), not on resize or selection.
    // tabAttributes keeps its identity while nothing changed.
    const tabSetKey = order.join(',');
    const cache = intrinsicCacheRef.current;
    if (cache.key !== tabSetKey || cache.attrs !== tabAttributes) {
      const widths = {};
      order.forEach((idx) => { widths[idx] = getIntrinsicTabWidth(idx); });
      intrinsicCacheRef.current = { key: tabSetKey, attrs: tabAttributes, widths };
    }
    const { widths } = intrinsicCacheRef.current;
    const sumTabs = order.reduce((acc, idx) => acc + (widths[idx] || idealWidth), 0);
    const plusGapCount = plusRef.current ? 1 : 0;

    // First attempt: pure content-fit with preferred gap
    const totalWithPreferredGaps =
      sumTabs + plusWidth + (n - 1 + plusGapCount) * gap;

    if (totalWithPreferredGaps <= availableNoOverflow) {
      setUseFlex(false);
      setHiddenTabIndices((prev) => (prev.length ? [] : prev));
      setEffectiveGap((prev) => (Math.abs(prev - gap) < GAP_SET_EPS ? prev : gap));
      return;
    }

    // Second attempt: elastic gaps (shrink gaps evenly down to minGap)
    const shrinkableGaps = (n - 1 + plusGapCount);
    if (shrinkableGaps > 0 && minGap < gap) {
      const deficit = totalWithPreferredGaps - availableNoOverflow; // > 0
      const maxTotalShrink = shrinkableGaps * (gap - minGap);
      if (deficit > 0 && deficit <= maxTotalShrink + 0.5 /* leniency for subpx */) {
        const newGap = Math.max(minGap, gap - (deficit / shrinkableGaps));
        setUseFlex(false);
        setHiddenTabIndices((prev) => (prev.length ? [] : prev));
        setEffectiveGap((prev) => (Math.abs(prev - newGap) < GAP_SET_EPS ? prev : newGap));
        return;
      }
    }

    // Natural-width overflow: walk tabs left-to-right, keep those that fit
    // at their intrinsic width. Hide the rest. Active tab always visible.
    // No shrinking — tabs respect their content, overflow handles the rest.
    // Reserve ~56px for the "+N ⌄" pill that'll render inside the header
    // after the last visible tab, plus the actionsWidth (mwaiPill etc.) outside.
    const OVERFLOW_PILL_WIDTH = 56;
    const reservedRight = actionsWidth + OVERFLOW_PILL_WIDTH;
    const availableWithOverflow = availableWidth - reservedRight - epsilon;

    const activeIndex = tabAttributes.findIndex((a) => a && a.key === internalCurrentTab);
    const activeWidth = activeIndex !== -1 ? (widths[activeIndex] || idealWidth) : 0;

    const visible = [];
    const hidden = [];
    let used = plusWidth + (plusGapCount > 0 ? gap : 0);
    // Reserve space for the active tab up-front so it's guaranteed to fit
    const activeReserve = (activeIndex !== -1 && !order.includes(activeIndex))
      ? 0
      : (activeWidth > 0 ? activeWidth + gap : 0);

    for (const idx of order) {
      const w = widths[idx] || idealWidth;
      // If it's the active one, always add it
      if (idx === activeIndex) {
        visible.push(idx);
        used += w + gap;
        continue;
      }
      // Otherwise, does it fit alongside the reserved active tab?
      const projected = used + w + gap + (activeIndex !== -1 && !visible.includes(activeIndex) ? activeReserve : 0);
      if (projected <= availableWithOverflow) {
        visible.push(idx);
        used += w + gap;
      } else {
        hidden.push(idx);
      }
    }

    // When overflow is active, let visible tabs stretch to fill the row —
    // no awkward empty space after the last tab. Natural widths are the floor.
    setUseFlex(true);
    setEffectiveGap((prev) => (Math.abs(prev - gap) < GAP_SET_EPS ? prev : gap));
    setHiddenTabIndices((prev) => {
      if (prev.length === hidden.length && prev.every((v, i) => v === hidden[i])) return prev;
      return hidden;
    });
  }, [
    tabAttributes,
    internalCurrentTab,
    gap,
    minGap,
    idealWidth,
    layoutBuffer,
    getIntrinsicTabWidth,  // intrinsic measurement
    hasAction,             // "+" affects available layout (the node itself is new on every render)
    title                  // whether action appears in tabs or title section
  ]);

  // Recompute layout on mount and whenever dependencies change (the active tab
  // is one of them, so a selection change is covered too).
  useLayoutEffect(() => {
    computeOverflow();
  }, [computeOverflow]);

  // Toggle the fade-mask class on each tab based on whether its label is actually
  // truncated. Done imperatively (classList) so we can measure after the browser has
  // resolved the flex layout without causing a React re-render cycle.
  const updateFades = useCallback(() => {
    for (const tab of tabRefs.current) {
      if (!tab) continue;
      const label = tab.querySelector('.neko-tab-label');
      if (!label) continue;
      tab.classList.toggle('needs-fade', label.scrollWidth > label.clientWidth + 1);
    }
  }, []);

  useLayoutEffect(updateFades, [updateFades, tabAttributes, internalCurrentTab, hiddenTabIndices, useFlex, effectiveGap]);

  // Watch container size (ResizeObserver with window resize fallback). Subscribed
  // once; the ref always points to the latest computeOverflow.
  const computeOverflowRef = useRef(computeOverflow);
  computeOverflowRef.current = computeOverflow;
  useEffect(() => {
    const el = tabsHeaderRef.current;
    if (!el) return;
    const onResize = () => {
      computeOverflowRef.current();
      updateFades();
    };

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(el);
    } else {
      window.addEventListener('resize', onResize);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', onResize);
    };
  }, [updateFades]);

  // Controlled/uncontrolled mode harmonization
  useEffect(() => {
    if (!tabAttributes.length) return;

    const desired = typeof currentTab === 'string' ? currentTab : internalCurrentTab;
    if (!tabKeys.includes(desired) && tabKeys.length > 0) {
      // Fallback to first visible tab
      const firstVisible = tabAttributes.find((a) => !a.hidden);
      if (firstVisible && desired !== firstVisible.key) {
        setInternalCurrentTab(firstVisible.key);
      }
      return;
    }

    if (desired !== internalCurrentTab) {
      setInternalCurrentTab(desired);
    }
  }, [currentTab, tabAttributes, tabKeys, internalCurrentTab]);

  // If the current tab becomes hidden via props, switch to first visible
  useEffect(() => {
    const activeAttr = tabAttributes.find((a) => a.key === internalCurrentTab);
    if (activeAttr && activeAttr.hidden) {
      const firstVisible = tabAttributes.find((a) => !a.hidden);
      if (firstVisible) setInternalCurrentTab(firstVisible.key);
    }
  }, [tabAttributes, internalCurrentTab]);

  // Initial selection (optionally trigger onChange once)
  useLayoutEffect(() => {
    if (initialTabSelected.current) return;
    if (!tabAttributes.length) return;

    initialTabSelected.current = true;

    let tabKeyToSelect = internalCurrentTab;
    if (!tabKeyToSelect) {
      const fromUrl =
        keepTabOnReload && typeof window !== 'undefined'
          ? new URL(window.location.href).searchParams.get('nekoTab')
          : null;
      tabKeyToSelect =
        (fromUrl && tabKeys.includes(fromUrl) ? fromUrl : null) ||
        (tabAttributes.find((a) => !a.hidden)?.key ?? tabKeys[0]);
      setInternalCurrentTab(tabKeyToSelect);
    }

    if (callOnTabChangeFirst) {
      const idx = tabKeys.indexOf(tabKeyToSelect);
      if (idx !== -1 && tabAttributes[idx]) onTabClick(idx, tabAttributes[idx]);
    }
  }, [
    keepTabOnReload,
    callOnTabChangeFirst,
    tabAttributes,
    tabKeys,
    internalCurrentTab,
    onTabClick,
  ]);

  // Prepare child tab contents (panels)
  const childTabs = useMemo(() => {
    return React.Children.map(validChildren, (child, i) => {
      const attr = tabAttributes[i];
      if (!attr) return null;
      const isActive = attr.key === internalCurrentTab && !attr.hidden;
      return React.cloneElement(child, {
        isActive,
        keepAlive,
        inversed,
        transparent,
        key: attr.key,
        // a11y metadata for the panel:
        _panelId: `panel-${instanceId}-${i}`,
        _labelledById: `tab-${instanceId}-${i}`,
      });
    });
  }, [validChildren, tabAttributes, internalCurrentTab, keepAlive, inversed, transparent, instanceId]);

  const classNames = useClasses('neko-tabs', { inversed }, { transparent });

  return (
    <TabsRoot className={classNames} {...rest}>
      {title && (
        <TabsTitleSection className={`${inversed ? 'inversed' : ''} ${subtitle ? 'has-subtitle' : ''}`}>
          <NekoTypo h2 className="neko-tabs-title">{title}</NekoTypo>
          {subtitle && <div className="neko-tabs-subtitle">{subtitle}</div>}
        </TabsTitleSection>
      )}
      <TabsHeaderContainer>
        <TabsHeader
          ref={tabsHeaderRef}
          role="tablist"
          aria-label={ariaLabel}
        >
          {tabAttributes.map((attr, i) => {
            const isActive = attr.key === internalCurrentTab;
            const isHiddenByOverflow = (attr.hidden || hiddenTabIndices.includes(i)) && !isActive;

            // Read busy state directly from children to ensure it updates reactively
            const childProps = validChildren[i]?.props || {};
            const isBusy = childProps.busy || childProps.isBusy || false;

            const tabClass =
              `neko-tab-title ${isActive ? 'active' : ''} ${attr.requirePro ? 'disabled' : ''} ` +
              `${isHiddenByOverflow ? 'hidden' : ''} ${inversed ? 'inversed' : ''} ` +
              `${isBusy ? 'busy' : ''}`;

            // Basis from intrinsic content width so wider labels start larger;
            // uniform grow (1) fills the row without amplifying differences.
            const basis = intrinsicCacheRef.current.widths[i] || idealWidth;
            const flexStyle = useFlex
              ? { minWidth, maxWidth, flex: `1 1 ${basis}px` }
              : { flex: '0 0 auto' };

            const style = { ...flexStyle, marginRight: effectiveGap };

            return (
              <Tab
                key={attr.key}
                id={`tab-${instanceId}-${i}`}
                ref={(el) => (tabRefs.current[i] = el)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${instanceId}-${i}`}
                aria-disabled={(attr.requirePro || isBusy) ? 'true' : 'false'}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={handleTabKeyDown(i)}
                onClick={(ev) => {
                  if (isBusy) return; // Prevent click when busy
                  onTabClick(i, attr, ev);
                }}
                className={tabClass}
                style={style}
                disabled={!!attr.requirePro}
                data-key={attr.key}
              >
                {attr.icon && (
                  <NekoIcon
                    icon={attr.icon}
                    width={15}
                    height={15}
                    style={{ marginRight: 5 }}
                    raw
                  />
                )}
                <div className="neko-tab-label" title={attr.title}>{attr.title}</div>
                <ProOnly
                  className="inline"
                  show={attr.requirePro}
                  style={{ marginLeft: 10, marginRight: -5 }}
                />
              </Tab>
            );
          })}

          {/* "Add" action sits immediately after the last visible tab */}
          {action && (
            <span
              ref={plusRef}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: effectiveGap,
                flex: '0 0 auto',
              }}
            >
              {action}
            </span>
          )}

          {/* Overflow pill — sits right after the last visible tab.
              Shows "+N" so the count of hidden tabs is obvious at a glance. */}
          {hiddenTabIndices.length > 0 && (
            <span
              ref={overflowBtnRef}
              role="button"
              tabIndex={0}
              aria-haspopup="menu"
              aria-expanded={showOverflow ? 'true' : 'false'}
              aria-label={`${hiddenTabIndices.length} more tab${hiddenTabIndices.length === 1 ? '' : 's'}`}
              onClick={() => setShowOverflow((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowOverflow((v) => !v);
                }
              }}
              className={`neko-tabs-overflow-pill ${showOverflow ? 'open' : ''} ${inversed ? 'inversed' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                marginLeft: effectiveGap,
                padding: '0 10px',
                height: '100%',
                flex: '0 0 auto',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0',
                color: inversed ? 'rgba(255, 255, 255, 0.75)' : 'var(--neko-gray-50)',
                borderRadius: '8px 8px 0 0',
                transition: 'color 0.22s ease, background 0.22s ease',
              }}
            >
              +{hiddenTabIndices.length}
              <ChevronDown size={14} className="neko-tabs-chevron" />
            </span>
          )}
        </TabsHeader>

        <TabsActions ref={actionsRef}>
          {mwaiPill && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderMwaiPill()}
            </div>
          )}
        </TabsActions>

        {hiddenTabIndices.length > 0 && (
          <NekoContextMenu
            visible={showOverflow}
            targetRef={overflowBtnRef}
            onClose={() => {
              setShowOverflow(false);
              setOverflowFilter('');
            }}
            matchWidth={false}
          >
            <OverflowMenu>
              {hiddenTabIndices.length > 8 && (
                <div style={{ padding: 6 }}>
                  <NekoInput
                    value={overflowFilter}
                    placeholder="Search tabs..."
                    onChange={(v) => setOverflowFilter(v)}
                  />
                </div>
              )}

              <OverflowList role="menu">
                {hiddenTabIndices
                  .filter((idx) => {
                    if (!overflowFilter) return true;
                    const t = (tabAttributes[idx]?.title || '').toLowerCase();
                    return t.includes(overflowFilter.toLowerCase());
                  })
                  .map((idx) => (
                    <OverflowItem
                      key={tabAttributes[idx]?.key || idx}
                      role="menuitem"
                      onClick={(ev) => {
                        setShowOverflow(false);
                        setOverflowFilter('');
                        onTabClick(idx, tabAttributes[idx], ev);
                      }}
                      className="neko-tab-overflow-item"
                    >
                      {tabAttributes[idx]?.title || `Tab ${idx + 1}`}
                    </OverflowItem>
                  ))}
              </OverflowList>
            </OverflowMenu>
          </NekoContextMenu>
        )}
      </TabsHeaderContainer>

      {childTabs}
    </TabsRoot>
  );
};

/* ---------- Single Tab Panel ---------- */

const StyledNekoTab = (props) => {
  const { children, isActive = false, keepAlive = false, busy = false, isBusy = false, inversed, transparent, _panelId, _labelledById, title, icon, requirePro, key, ...rest } = props;

  // With keepAlive, a visited panel stays mounted (just hidden) so coming back
  // to it is instant and keeps its state. Off by default: some plugins rely on
  // their tab content remounting to refresh data.
  const [visited, setVisited] = useState(isActive);
  if (isActive && !visited) setVisited(true);
  const renderChildren = isActive || (keepAlive && visited);

  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoTab');
  const classNames = useClasses('neko-tab-content', {
    active: isActive,
    inversed,
    transparent,
  });

  return (
    <NekoBusyOverlay
      busy={busyState}
      overlayStyle={{ borderRadius: '0 0 12px 12px' }}
      className="neko-tab-panel-wrapper"
    >
      <TabContent
        id={_panelId}
        role="tabpanel"
        aria-labelledby={_labelledById}
        aria-hidden={isActive ? 'false' : 'true'}
        hidden={!isActive}
        className={classNames}
      >
        {renderChildren && children}
      </TabContent>
    </NekoBusyOverlay>
  );
};

/* ---------- Exports ---------- */

const NekoTabs = (props) => <StyledNekoTabs {...props} />;

NekoTabs.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  isPro: PropTypes.bool,
  onChange: PropTypes.func,
  action: PropTypes.node,
  currentTab: PropTypes.string,
  keepTabOnReload: PropTypes.bool,
  callOnTabChangeFirst: PropTypes.bool,
  inversed: PropTypes.bool,
  mwaiPill: PropTypes.bool,
  mwaiEnabled: PropTypes.bool,
  keepAlive: PropTypes.bool,
  // Fine-tuners (optional)
  minWidth: PropTypes.number,
  idealWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  gap: PropTypes.number,
  minGap: PropTypes.number,        // NEW: floor for elastic gaps
  chevronReserve: PropTypes.number,
  layoutBuffer: PropTypes.number,
  // a11y
  ariaLabel: PropTypes.string,
};

const NekoTab = (props) => <StyledNekoTab {...props} />;

NekoTab.propTypes = {
  isActive: PropTypes.bool,
  keepAlive: PropTypes.bool,
  requirePro: PropTypes.bool,
  title: PropTypes.node,
  icon: PropTypes.string,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
};

export { NekoTab, NekoTabs };
