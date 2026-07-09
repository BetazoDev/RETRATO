import Link from 'next/link';

interface FooterProps {
  siteTitle: string;
  instagramUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
}

export default function Footer({ 
  siteTitle,
  instagramUrl,
  twitterUrl,
  telegramUrl
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <h2 className="footer-brand-name">{siteTitle || 'RETRATO'}</h2>
            <p className="footer-brand-desc">
              An independent digital and print publication exploring the
              intersection of film photography, urban culture, and minimalist
              visual theory.
            </p>
          </div>

          {/* Sections Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Sections</h4>
            <ul className="footer-links-list">
              <li><Link href="/archive" className="footer-link">Archive</Link></li>
              <li><Link href="/category/photography" className="footer-link">Photography</Link></li>
              <li><Link href="/category/editorial" className="footer-link">Editorial</Link></li>
              <li><Link href="/category/interview" className="footer-link">Interviews</Link></li>
            </ul>
          </div>

          {/* Magazine Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Magazine</h4>
            <ul className="footer-links-list">
              <li><Link href="/" className="footer-link">Current Issue</Link></li>
              <li><Link href="/archive" className="footer-link">Back Issues</Link></li>
              <li><Link href="#" className="footer-link">About Us</Link></li>
              <li><Link href="#" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links-list">
              <li><a href={instagramUrl || '#'} className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href={twitterUrl || '#'} className="footer-link" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href={telegramUrl || '#'} className="footer-link" target="_blank" rel="noopener noreferrer">Telegram</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {siteTitle || 'RETRATO'} Magazine. All Rights Reserved.
          </p>
          <div className="footer-legal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
