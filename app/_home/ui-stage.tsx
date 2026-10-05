/**
 * The hero's art column: a few panels of UI standing in a scene, at different depths, turned
 * a little toward the reader — what DreamGUI draws that a flat UI layer cannot. All of it is
 * markup and CSS (`.dgui-ui-*` in home.css): no image to fetch, it follows the theme, and under
 * `prefers-reduced-motion` it holds still. Decorative, so the whole stage is hidden from
 * assistive technology; the plaque under it carries the caption.
 */
export function UiStage({ caption }: { caption: string }) {
  return (
    <div className="dgui-art">
      <div className="dgui-art-stage">
        <span className="dgui-art-halo" aria-hidden="true" />
        <span className="dgui-art-ring" aria-hidden="true" />

        <div className="dgui-ui-world" aria-hidden="true">
          <div className="dgui-ui-plane">
            <div className="dgui-ui-orbit">
              <span className="dgui-ui-orbit-arc dgui-ui-orbit-a" />
              <span className="dgui-ui-orbit-arc dgui-ui-orbit-b" />
            </div>

            <div className="dgui-ui-panel dgui-ui-main">
              <div className="dgui-ui-head">
                <span className="dgui-ui-dot" />
                <span className="dgui-ui-title" />
                <span className="dgui-ui-chip" />
              </div>
              <div className="dgui-ui-row">
                <span className="dgui-ui-label" />
                <span className="dgui-ui-toggle">
                  <span />
                </span>
              </div>
              <div className="dgui-ui-row">
                <span className="dgui-ui-label dgui-ui-label-short" />
                <span className="dgui-ui-slider">
                  <span />
                </span>
              </div>
              <div className="dgui-ui-row">
                <span className="dgui-ui-label" />
                <span className="dgui-ui-select" />
              </div>
              <span className="dgui-ui-button" />
            </div>

            <div className="dgui-ui-panel dgui-ui-tag">
              <span className="dgui-ui-tag-mark" />
              <span className="dgui-ui-tag-lines">
                <span />
                <span />
              </span>
            </div>

            <div className="dgui-ui-panel dgui-ui-code">
              <span className="dgui-ui-code-line dgui-w-60" />
              <span className="dgui-ui-code-line dgui-w-80 dgui-indent" />
              <span className="dgui-ui-code-line dgui-w-50 dgui-indent" />
              <span className="dgui-ui-code-line dgui-w-70 dgui-indent" />
              <span className="dgui-ui-code-line dgui-w-30" />
            </div>
          </div>
        </div>

        <span className="dgui-art-plinth" aria-hidden="true" />
      </div>

      <p className="dgui-art-plaque">{caption}</p>
    </div>
  );
}
