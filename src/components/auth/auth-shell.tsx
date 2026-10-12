import { Brand } from "@/components/brand/brand";
import { Icon } from "@/components/ui/icon";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <header className={styles.header}><Brand/><span className={styles.headerLabel}>SEU ESPAÇO DE APRENDIZAGEM</span></header>
    <main id="main-content" className={styles.main} tabIndex={-1}>
      <div className={styles.formColumn}>{children}<p className={styles.demoNote}>Versão de demonstração · Use apenas dados fictícios.</p></div>
      <aside className={styles.story} aria-label="Aprender com a Fonseca">
        <span className={styles.eyebrow}><span/> INGLÊS PARA A VIDA REAL</span>
        <h2>Seu próximo<br/>passo começa<br/>com uma <span className={styles.highlight}>conversa.</span></h2>
        <p className={styles.storyDescription}>Mais confiança para se expressar.<br/>Mais possibilidades para ir além.</p>
        <div className={styles.learningCard}><span className={styles.learningIcon}><Icon name="book"/></span><div><strong>Aprendizado com propósito</strong><p>Orientação humana. Prática que transforma.</p></div><Icon name="spark" className={styles.spark}/></div>
        <div className={styles.storyFooter}><span className={styles.line}/><span>Seu ritmo. Seus objetivos. Sua evolução.</span></div>
      </aside>
    </main>
    <footer className={styles.footer}><span>© {new Date().getFullYear()} Fonseca Consulting</span><span>Feito para conectar você ao mundo.</span></footer>
  </div>;
}

export function AuthCard({ children }: { children: React.ReactNode }) { return <section className={styles.card}>{children}</section>; }
export function FormHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className={styles.formHeader}><p className={styles.cardEyebrow}>{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>;
}
