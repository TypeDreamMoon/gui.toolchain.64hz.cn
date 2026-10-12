/**
 * The DreamGUI mascot, as the hero's art column.
 *
 * The source PNG (`Plugins/DreamGUI/Images/character.png`) carries an alpha channel
 * around the figure and the UI panels floating beside her, so a cutout is what the file
 * offers. The halo and the floor glow below are the page's own, so she sits in the
 * site's light rather than in the render's.
 *
 * `scripts/prepare-art.py` writes the two WebP widths this points at.
 */
export function Character({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="dgui-art">
      <div className="dgui-art-stage">
        <span className="dgui-art-halo" aria-hidden="true" />
        <span className="dgui-art-ring" aria-hidden="true" />

        <img
          alt={alt}
          className="dgui-art-figure"
          decoding="async"
          fetchPriority="high"
          height={1434}
          sizes="(max-width: 960px) 62vw, 34vw"
          src="/art/character-960.webp"
          srcSet="/art/character-480.webp 480w, /art/character-960.webp 960w"
          width={1051}
        />

        <span className="dgui-art-plinth" aria-hidden="true" />
      </div>

      <p className="dgui-art-plaque">{caption}</p>
    </div>
  );
}
