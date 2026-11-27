import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Styled from 'styled-components';
import { NekoLogo } from './Logo';
import { NekoIcon } from './Icon';
import { getProUrl } from '../common/proUrl';

const HeaderBase = Styled.div`
  position: relative;
  color: white;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  display: flex;
  height: 74px;
  overflow: hidden;
  align-items: center;
  padding: 18px 32px;
  background: var(--neko-main-color);
  isolation: isolate;

  .neko-header-logo-container {
    width: 44px;
    height: 44px;
    padding: 9px;
    margin-right: 16px;
    background: rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 12px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transition: transform var(--neko-duration-slow) var(--neko-ease-spring);
  }

  &:hover .neko-header-logo-container {
    transform: scale(1.05) rotate(-3deg);
  }

  .neko-header-title-container {
    flex-direction: column;
    display: flex;
    position: relative;
    z-index: 1;
    justify-content: center;

    .neko-header-title-row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .neko-header-title {
      color: white;
      font-family: var(--neko-font-family);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1.1;
      margin: 0;
      position: relative;
    }

    .neko-header-separator {
      color: rgba(255,255,255,0.35);
      font-size: 18px;
      line-height: 1;
      align-self: center;
    }

    /* Section badge: the green pulse dot anchors the accent color */
    .neko-header-section {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: white;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      line-height: 1;
      padding: 5px 12px 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      align-self: center;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--neko-green);
        box-shadow: 0 0 8px color-mix(in oklab, var(--neko-green) 80%, transparent);
        animation: nekoSectionPulse 2s ease-in-out infinite;
      }
    }

    @keyframes nekoSectionPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.55; transform: scale(0.8); }
    }

    .neko-header-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-family: var(--neko-font-family);
      line-height: 1;
      margin-top: 5px;
      font-size: 11px;
      letter-spacing: 0.05em;

      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-family: var(--neko-font-family);
        transition: color 0.18s var(--neko-ease-out);
      }
      a:hover { color: white; }

      .neko-header-version {
        color: rgba(255, 255, 255, 0.5);
        margin-left: 6px;
        padding-left: 8px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.22s ease;
      }
      a.neko-header-version:hover { color: white; }
      .neko-header-version.pro {
        color: rgba(255, 220, 150, 0.9);
      }
    }
  }


  /* Tier tiles: silver for a Free build of a Pro plugin, gold for Pro. No isPro means no Pro exists: blue glass. */
  &.neko-header-free .neko-header-logo-container,
  &.neko-header-arm .neko-header-logo-container {
    background: linear-gradient(145deg, #f1f3f7, #c3c9d4 60%, #9aa3b2);
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    transition: background 0.5s, box-shadow 0.5s, border-color 0.5s,
      transform var(--neko-duration-slow) var(--neko-ease-spring);
  }

  &.neko-header-pro:not(.neko-header-arm) .neko-header-logo-container,
  &.neko-header-free .neko-header-logo-container:hover,
  &.neko-header-free .neko-header-logo-container:focus-visible {
    background: linear-gradient(145deg, #ffe7a3, #f5c04a 60%, #d99a1e);
    border-color: rgba(255, 240, 190, 0.9);
    box-shadow: 0 4px 14px rgba(217, 154, 30, 0.45);
  }

  /* The active header button echoes the tile without copying it: in a Pro header it keeps the glass
     of the other header buttons, a little brighter, with a gold edge and a gold icon. Subtle on purpose
     (Jordy, 10-26): a full gold fill on a wide button shouted. Silver otherwise, set in NekoButton.
     Not during the arm phase, when the tile itself is still silver. */
  &.neko-header-pro:not(.neko-header-arm) .neko-button.header.active {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 222, 140, 0.95);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 0 1px rgba(255, 222, 140, 0.25);

    svg { color: #ffd56b; }
  }

  .neko-header-whisper {
    position: absolute;
    top: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    line-height: 1;
    color: #ffe7a3;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s;
  }

  .neko-header-logo-container:hover .neko-header-whisper,
  .neko-header-logo-container:focus-visible .neko-header-whisper {
    opacity: 1;
  }


  /* The moment a Free install turns Pro: played once, remembered in localStorage */
  &.neko-header-celebrate .neko-header-logo-container {
    transition: background 0.9s ease, box-shadow 0.9s ease, border-color 0.9s ease;
    animation: nekoHeaderPop 0.9s ease;
  }

  @keyframes nekoHeaderPop {
    0%   { transform: scale(1) rotate(0); }
    40%  { transform: scale(1.18) rotate(-4deg); }
    100% { transform: scale(1) rotate(0); }
  }

  .neko-header-spark {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5px;
    height: 5px;
    margin: -2.5px 0 0 -2.5px;
    border-radius: 50%;
    background: #ffe7a3;
    box-shadow: 0 0 6px #f5c04a;
    opacity: 0;
    pointer-events: none;
    animation: nekoHeaderSpark 1s ease-out forwards;
  }

  @keyframes nekoHeaderSpark {
    0%   { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
  }

  /* Briefly covers the subtitle line, the one spot that never holds a control, at any header width */
  .neko-header-toast {
    position: absolute;
    left: -2px;
    top: calc(100% + 1px);
    z-index: 4;
    background: rgba(20, 28, 60, 0.9);
    border: 1px solid rgba(255, 214, 120, 0.6);
    color: #ffe7a3;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
    pointer-events: none;
    animation: nekoHeaderToast 3.2s ease forwards;
  }

  @keyframes nekoHeaderToast {
    0%, 20%  { opacity: 0; transform: translateY(-3px); }
    32%, 88% { opacity: 1; transform: translateY(0); }
    100%     { opacity: 0; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    &.neko-header-celebrate .neko-header-logo-container { transition: none; animation: none; }
    .neko-header-spark { display: none; }
    .neko-header-toast { animation: none; }
  }

  .neko-header-extra-content {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
  }

  /* Narrow headers step down instead of overflowing (measured, not breakpoints, since plugins have
     different buttons): data-compact 1 drops the section pill, 2 also turns the header buttons into
     icon-only squares. The label stays for screen readers, and shows as a tooltip on hover. */
  &[data-compact="1"], &[data-compact="2"] {
    .neko-header-separator, .neko-header-section { display: none; }
  }
  &[data-compact="2"] .neko-button.header.has-icon {
    width: 40px;
    min-width: 40px;
    padding: 0;

    .normal-content { justify-content: center; }
    .icon-section {
      position: static;
      padding: 0;
      border-right: none;
    }
    .button-text {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  }

  /* Installed vs latest version, pinned in the bottom padding under the buttons: the header is a
     fixed 74px with the buttons centered, so a real second row would not fit. Quiet on purpose. */
  .neko-header-version-line {
    position: absolute;
    right: 32px;
    bottom: 4px;
    z-index: 1;
    font-size: 10.5px;
    line-height: 13px;
    color: rgba(255, 255, 255, 0.62);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;

    .neko-header-version-icon { flex: none; color: #8be3b0; }

    /* Behind is the state that matters (updates, renewals): brighter, a size up, amber sign. */
    &.behind {
      color: rgba(255, 255, 255, 0.92);
      font-size: 11.5px;
      .neko-header-version-icon { color: #ffd36b; }
    }

    a {
      color: white;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }
`;

const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = i / 10 * Math.PI * 2;
  return { '--dx': `${Math.round(Math.cos(angle) * 44)}px`, '--dy': `${Math.round(Math.sin(angle) * 34)}px` };
});

// Remembers the tier per plugin so a Free install that becomes Pro celebrates exactly once.
// Phases: 'arm' paints the silver tile before the first frame, 'lit' then fades it to gold.
const useProCelebration = (title, isPro) => {
  const [phase, setPhase] = useState(null);
  useLayoutEffect(() => {
    if (isPro === undefined) return;
    const key = `neko-header-tier:${title}`;
    try {
      if (isPro && localStorage.getItem(key) === 'free') {
        setPhase('arm');
      }
      localStorage.setItem(key, isPro ? 'pro' : 'free');
    }
    catch (e) {
      // Storage can be blocked (private mode, policies): the header simply never celebrates.
    }
  }, [title, isPro]);
  useEffect(() => {
    if (phase === 'arm') {
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('lit')));
      return () => cancelAnimationFrame(frame);
    }
    if (phase === 'lit') {
      const timer = setTimeout(() => setPhase(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [phase]);
  return phase;
};

// Lives in document.body: the header clips its overflow (74px tall), so a card under the tile
// would be cut. Shown only while the tile is hovered or focused, never on its own.
const PriceCard = Styled.div`
  position: fixed;
  z-index: 100000;
  width: 240px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fffaf0;
  border: 1px solid #f1d58a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  color: #4a3a12;
  font-family: var(--neko-font-family);
  font-size: 12.5px;
  line-height: 1.45;
  pointer-events: none;
  animation: nekoPriceIn 0.2s ease;

  b { color: #2b2006; font-weight: 700; }
  span { display: block; margin-top: 4px; color: #6b5a2c; }

  @keyframes nekoPriceIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
`;

// The cheapest yearly Pro price, for the hover card on a Free build's tile. The plugin never asks our
// server (wp.org forbids free plugins calling out without consent): the release bundles
// meowapps.com/prices.json into common, which prints window.meowPrices. Keyed by the plugin's slug,
// read from the tile's own Pro link (utm_source).
// The plugin's slugs, read from the tile's own Pro link: utm_source first, then the page.
// Perfect Images says utm_source=perfect-images but lives at /wp-retina-2x/, hence both.
const slugsFromUrl = (url) => {
  try {
    const u = new URL(url);
    return [u.searchParams.get('utm_source'), u.pathname.split('/')[1]].filter(Boolean);
  }
  catch (e) {
    return [];
  }
};

const findIn = (map, url) => {
  if (typeof window === 'undefined' || !window[map]) return null;
  const slug = slugsFromUrl(url).find(s => window[map][s]);
  return slug ? window[map][slug] : null;
};

const findProPrice = (url) => {
  const price = findIn('meowPrices', url);
  return price && price.from ? price : null;
};

// The review ask (common/ratings.php prints window.meowReviews when it is due): one quiet line
// under the header, only on the plugin's own screens. It replaced a site-wide notice that met
// people on every admin page, while they were busy with something else (Jordy, 10-31).
const ReviewBar = Styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  /* The header's bottom strip, not a floating card (Jordy, 11-01): flush, square, full width. */
  margin: 0;
  padding: 8px 10px 8px 14px;
  background: #fff;
  border-bottom: 1px solid #e3e6ec;
  color: #1d2327;
  font-size: 13px;

  .neko-review-stars { color: #f5b928; letter-spacing: 1px; }
  .neko-review-text { flex: 1; min-width: 220px; }
  .neko-review-go {
    background: var(--neko-main-color); color: #fff; border: 0; border-radius: 99px;
    padding: 5px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .neko-review-later, .neko-review-close {
    background: none; border: 0; color: #646970; cursor: pointer; font-size: 12.5px; padding: 4px;
  }
  .neko-review-close { font-size: 16px; line-height: 1; }
`;

const ReviewLine = ({ review, name, isPro }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const act = (action) => {
    setHidden(true);
    fetch(review.ajax, {
      method: 'POST',
      credentials: 'same-origin',
      body: new URLSearchParams({ action: 'meowapps_review', _ajax_nonce: review.nonce, prefix: review.prefix, choice: action }),
    }).catch(() => {});
  };
  return (
    <ReviewBar className="neko-review-line">
      <span className="neko-review-stars">★★★★★</span>
      <span className="neko-review-text">
        {isPro ? 'Thanks for supporting us with Pro! ' : ''}
        Is {name} doing a good job? A short review on WordPress.org helps other people find it.
      </span>
      <button className="neko-review-go" onClick={() => { window.open(review.url, '_blank', 'noopener,noreferrer'); act('done'); }}>
        Write a review
      </button>
      <button className="neko-review-later" onClick={() => act('later')}>Later</button>
      <button className="neko-review-close" title="Don't ask again" aria-label="Don't ask again" onClick={() => act('never')}>×</button>
    </ReviewBar>
  );
};

const StyledNekoHeader = props => {
  const {
    title = 'NekoUI',
    section = null,
    subtitle = 'By Meow Apps',
    children,
    isPro,
    showFreeBadge = true,
    proUrl: rawProUrl,
    version,
  } = props;

  const proUrl = getProUrl(rawProUrl, 'plugin-header');
  const isFree = isPro === false;
  const phase = useProCelebration(title, isPro);
  const celebrate = phase === 'lit';
  const openPro = () => window.open(proUrl, '_blank', 'noopener,noreferrer');
  const proPrice = isFree ? findProPrice(rawProUrl) : null;
  const [priceAt, setPriceAt] = useState(null);
  const showPrice = (e) => {
    if (!proPrice) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPriceAt({ top: r.bottom + 10, left: r.left });
  };
  const hidePrice = () => setPriceAt(null);

  // Steps down from the full layout until nothing overflows (see data-compact in the styles).
  // Set as a DOM attribute, not state, so measuring never triggers a re-render loop.
  const headerRef = useRef(null);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const fit = () => {
      for (let level = 0; level <= 2; level++) {
        el.dataset.compact = String(level);
        if (el.scrollWidth <= el.clientWidth + 1) break;
      }
      el.querySelectorAll('.neko-button.header.has-icon').forEach(button => {
        const label = button.querySelector('.button-text')?.textContent?.trim();
        if (el.dataset.compact === '2' && label && !button.title) {
          button.title = label;
          button.dataset.autoTitle = '1';
        }
        else if (el.dataset.compact !== '2' && button.dataset.autoTitle) {
          button.removeAttribute('title');
          delete button.dataset.autoTitle;
        }
      });
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, section, title]);

  const classNames = ['neko-header'];
  if (isFree) classNames.push('neko-header-free');
  if (isPro === true) classNames.push('neko-header-pro');
  if (phase === 'arm') classNames.push('neko-header-arm');
  if (celebrate) classNames.push('neko-header-celebrate');

  const review = findIn('meowReviews', rawProUrl);

  return (
    <>
    <HeaderBase ref={headerRef} className={classNames.join(' ')}>
      <div className='neko-header-logo-container'
        {...(isFree && {
          ...(!proPrice && { title: 'See what Pro adds' }),
          role: 'link',
          tabIndex: 0,
          onClick: openPro,
          onKeyDown: (e) => { if (e.key === 'Enter') openPro(); },
          onMouseEnter: showPrice,
          onMouseLeave: hidePrice,
          onFocus: showPrice,
          onBlur: hidePrice,
        })}>
        <NekoLogo />
        {isFree && !proPrice && <span className="neko-header-whisper">PRO</span>}

        {celebrate && SPARKS.map((style, i) => <span key={i} className="neko-header-spark" style={style} />)}
      </div>
      {proPrice && priceAt && typeof document !== 'undefined' && ReactDOM.createPortal(
        <PriceCard style={{ top: priceAt.top, left: priceAt.left }}>
          <b>Pro from ${Math.round(proPrice.from)}</b>
          <span>All the Pro features, support from us, and the golden badge. And it helps us 💛</span>
        </PriceCard>,
        document.body
      )}
      <div className="neko-header-title-container">
        <div className="neko-header-title-row">
          <h1 className="neko-header-title">
            {title}
          </h1>
          {!!section && (
            <>
              <span className="neko-header-separator">›</span>
              <span className="neko-header-section">{section}</span>
            </>
          )}
          {celebrate && <span className="neko-header-toast">Welcome to Pro, thank you for your support!</span>}
        </div>
        <small className="neko-header-subtitle">
          <a target='_blank' rel='noopener noreferrer' href={getProUrl('https://meowapps.com/', 'plugin-subtitle')}>{subtitle}</a>
          {isPro === true && <span className="neko-header-version pro">Pro</span>}
          {isFree && showFreeBadge && (
            <a className="neko-header-version" href={proUrl} target="_blank" rel="noopener noreferrer">Free</a>
          )}
        </small>
      </div>
      <div className="neko-header-extra-content">{children}</div>
      {!!version?.current && !!version?.latest && (
        <div className={'neko-header-version-line' + (version.behind ? ' behind' : '')}>
          <NekoIcon raw icon={version.behind ? 'warning' : 'check-circle'} width={12} height={12}
            className="neko-header-version-icon" />
          {version.behind ? (
            <>
              {version.current} → {version.latest} available
              {!!version.action?.url && (
                <> · <a href={version.action.url}
                  {...(version.action.external && { target: '_blank', rel: 'noopener noreferrer' })}>
                  {version.action.label}
                </a></>
              )}
            </>
          ) : (
            <>{version.current} · latest</>
          )}
        </div>
      )}
    </HeaderBase>
    {!!review && <ReviewLine review={review} name={review.name || title} isPro={isPro === true} />}
    </>
  );
};

const NekoHeader = props => {
  return <StyledNekoHeader {...props} />;
};

NekoHeader.propTypes = {
  title: PropTypes.string,
  section: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  isPro: PropTypes.bool,
  showFreeBadge: PropTypes.bool,
  proUrl: PropTypes.string,
  // From common/'s '<prefix>_meowapps_version_info' filter: { current, latest, behind, action: { label, url, external } }.
  version: PropTypes.shape({
    current: PropTypes.string,
    latest: PropTypes.string,
    behind: PropTypes.bool,
    action: PropTypes.shape({ label: PropTypes.string, url: PropTypes.string, external: PropTypes.bool }),
  }),
};

export { NekoHeader };