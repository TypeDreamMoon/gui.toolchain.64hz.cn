import { localizedPath, type Locale } from '@/lib/i18n';
import { GITHUB_URL } from '@/lib/site';
import { BookOpen, ChevronDown, CodeXml, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { UiStage } from './ui-stage';
import type { HomeCopy } from './copy';
import { Particles } from './particles';

export function HeroSection({
  copy,
  locale,
}: {
  copy: HomeCopy;
  locale: Locale;
}) {
  return (
    <section className="dgui-hero" id="overview">
      <div className="dgui-aurora" aria-hidden="true" />
      <Particles />

      <div className="dgui-container dgui-hero-grid">
        <div className="dgui-hero-copy">
          <p className="dgui-kicker">
            <CodeXml aria-hidden="true" />
            {copy.hero.kicker}
          </p>

          <h1>
            {copy.hero.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <p className="dgui-lead">{copy.hero.lead}</p>

          <div className="dgui-actions">
            <Link className="dgui-btn dgui-btn-primary" href={localizedPath(locale, '/docs')}>
              <BookOpen aria-hidden="true" />
              {copy.hero.primary}
            </Link>
            <a
              className="dgui-btn dgui-btn-ghost"
              href={GITHUB_URL}
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch aria-hidden="true" />
              {copy.hero.secondary}
            </a>
          </div>

          <ul className="dgui-tags" aria-label={copy.hero.versionsLabel}>
            {copy.versions.map(([label, value]) => (
              <li key={label}>
                <strong>{label}</strong>
                {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="dgui-hero-art">
          <UiStage caption={copy.hero.artCaption} />
        </div>
      </div>

      <a className="dgui-cue" href="#sample">
        {copy.hero.scrollCue}
        <ChevronDown aria-hidden="true" />
      </a>
    </section>
  );
}
