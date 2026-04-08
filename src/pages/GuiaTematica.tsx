import { Fragment, useMemo, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import type { GuiaTematica as GuiaModel } from '../data/guias';
import { getGuiaBySlug } from '../data/guias';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';

function renderBoldLine(line: string, key: number): ReactNode {
  if (!line.includes('**')) return line;
  const parts = line.split(/\*\*/);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={`${key}-${i}`}>{p}</strong>
    ) : (
      <Fragment key={`${key}-${i}`}>{p}</Fragment>
    ),
  );
}

function GuiaCuerpo({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="pd-guia-cuerpo">
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <br key={i} />;
        if (t.startsWith('• ') || t.startsWith('- ')) {
          return (
            <p key={i} className="pd-guia-cuerpo-li">
              {renderBoldLine(t.replace(/^[-•]\s+/, ''), i)}
            </p>
          );
        }
        return (
          <p key={i} className="pd-guia-cuerpo-p">
            {renderBoldLine(line, i)}
          </p>
        );
      })}
    </div>
  );
}

function GuiaLinkCards({
  links,
  heading,
}: {
  links: { label: string; url: string }[];
  heading?: string;
}) {
  if (!links.length) return null;
  return (
    <nav className="pd-guia-link-nav" aria-label={heading ?? 'Enlaces'}>
      {heading ? <p className="pd-guia-link-nav-title">{heading}</p> : null}
      <div className="pd-guia-link-stack">
        {links.map((l) =>
          l.url.startsWith('/') ? (
            <Link key={l.url} to={l.url} className="pd-guia-link-card">
              <span className="pd-guia-link-card-label">{l.label}</span>
              <span className="pd-guia-link-card-arrow" aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-guia-link-card"
            >
              <span className="pd-guia-link-card-label">{l.label}</span>
              <span className="pd-guia-link-card-arrow" aria-hidden>
                ↗
              </span>
            </a>
          ),
        )}
      </div>
    </nav>
  );
}

function sectionLinkUrlSet(guia: GuiaModel): Set<string> {
  const s = new Set<string>();
  for (const sec of guia.secciones ?? []) {
    for (const l of sec.links) s.add(l.url);
  }
  return s;
}

function renderContenidoConTitulos(contenido: string): ReactNode[] {
  const lines = contenido.split('\n');
  const out: React.ReactNode[] = [];
  let k = 0;
  let block: string[] = [];
  const flush = () => {
    if (block.length) {
      const text = block.join('\n').trim();
      if (text) out.push(<GuiaCuerpo key={`b-${k++}`} text={text} />);
      block = [];
    }
  };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      out.push(
        <h2 key={`h-${k++}`} className="pd-guia-h2">
          {line.slice(3).trim()}
        </h2>,
      );
    } else {
      block.push(line);
    }
  }
  flush();
  return out;
}

export default function GuiaTematica() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const guia = slug ? getGuiaBySlug(slug) : undefined;

  const extraOficiales = useMemo(() => {
    if (!guia?.secciones?.length) return guia?.linksOficiales ?? [];
    const inSec = sectionLinkUrlSet(guia);
    return guia.linksOficiales.filter((l) => !inSec.has(l.url));
  }, [guia]);

  useEffect(() => {
    if (guia) document.title = `${guia.titulo} – Para Dónde?`;
  }, [guia]);

  if (!guia) {
    return (
      <IonPage>
        <PdSubpageChrome onBack={() => navigate('/guias')} chromeVisible={chromeVisible} />
        <IonContent className="ion-padding" {...ionScrollProps}>
          <div className="pd-content pd-subpage-inner">
            <p>No encontramos esa guía.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const hasSecciones = Boolean(guia.secciones && guia.secciones.length > 0);

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-guia-page pd-subpage-inner">
          <p className="pd-guia-kicker">Guía práctica</p>
          <h1 className="pd-guia-h1">{guia.titulo}</h1>
          {guia.descripcionCorta ? <p className="pd-guia-deck">{guia.descripcionCorta}</p> : null}

          {hasSecciones ? (
            <>
              {guia.secciones!.map((sec, i) => (
                <section key={i} className="pd-guia-section">
                  <h2 className="pd-guia-section-title">{sec.titulo}</h2>
                  <GuiaCuerpo text={sec.cuerpo} />
                  <GuiaLinkCards links={sec.links} />
                </section>
              ))}
              <GuiaLinkCards links={extraOficiales} heading="Otros enlaces oficiales" />
            </>
          ) : (
            <>
              {renderContenidoConTitulos(guia.contenido)}
              <GuiaLinkCards links={guia.linksOficiales} heading="Enlaces oficiales" />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
