import { NextRequest, NextResponse } from 'next/server';

interface Finding {
  category: string;
  title: string;
  whatINoticed: string;
  howIAttack: string;
  whatCouldHappen: string;
  howToFix: string;
  severity: 'low' | 'medium' | 'high';
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let urlObj: URL;
    try {
      urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const findings: Finding[] = [];

    try {
      // Fetch website
      const response = await fetch(urlObj.toString(), {
        method: 'HEAD',
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      }).catch(() =>
        fetch(urlObj.toString(), {
          method: 'GET',
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
        }),
      );

      // Check HTTPS
      if (!urlObj.protocol.startsWith('https')) {
        findings.push({
          category: 'Connection Security',
          title: 'No HTTPS Encryption',
          whatINoticed: `Your site is using HTTP instead of HTTPS. That means data flowing between users and your server is sent in plain text.`,
          howIAttack: `I could sit on your WiFi network and intercept login credentials, credit card numbers, or any sensitive data users enter.`,
          whatCouldHappen:
            'Users\' personal data, passwords, and payment info could be stolen. Your site could also be blocked by modern browsers.',
          howToFix:
            'Get an SSL certificate (many are free!) and redirect all HTTP traffic to HTTPS. It\s one of the easiest wins for security.',
          severity: 'high',
        });
      }

      // Check security headers
      const headers = response.headers;
      const headerChecks = [
        {
          name: 'X-Frame-Options',
          title: 'Missing X-Frame-Options Header',
          severity: 'medium' as const,
          whatINoticed:
            'The X-Frame-Options header is missing, which means your site could be embedded in another website without your knowledge.',
          howIAttack:
            'I could embed your site in an invisible frame on my malicious site and trick users into clicking buttons they think are safe.',
          whatCouldHappen:
            "Your users might accidentally transfer money, change settings, or delete data while thinking they're on your real site.",
          howToFix:
            'Add the header X-Frame-Options: SAMEORIGIN or DENY. This tells browsers not to let your site be framed by others.',
        },
        {
          name: 'X-Content-Type-Options',
          title: 'Missing X-Content-Type-Options Header',
          severity: 'low' as const,
          whatINoticed:
            'Without this header, browsers might guess what type of content is being served, which could lead to security issues.',
          howIAttack:
            'If you accidentally serve a file with the wrong content type, I might be able to exploit it as a different type of file.',
          whatCouldHappen:
            'In rare cases, this could lead to XSS attacks where attackers inject malicious scripts.',
          howToFix:
            'Add X-Content-Type-Options: nosniff. This prevents browsers from guessing file types.',
        },
        {
          name: 'Strict-Transport-Security',
          title: 'No HSTS Protection',
          severity: 'medium' as const,
          whatINoticed:
            'Strict-Transport-Security (HSTS) header is missing. This means users could accidentally connect via HTTP on their next visit.',
          howIAttack:
            "Even if you fix HTTPS, I could wait for users to visit your HTTP version and intercept their first connection.",
          whatCouldHappen:
            'User data could be intercepted on that first visit, bypassing your HTTPS protection.',
          howToFix:
            'Add Strict-Transport-Security header with a max-age (e.g., max-age=31536000). This forces HTTPS for future visits.',
        },
      ];

      for (const check of headerChecks) {
        if (!headers.get(check.name)) {
          findings.push({
            category: 'HTTP Headers',
            title: check.title,
            whatINoticed: check.whatINoticed,
            howIAttack: check.howIAttack,
            whatCouldHappen: check.whatCouldHappen,
            howToFix: check.howToFix,
            severity: check.severity,
          });
        }
      }

      // Server header check
      const serverHeader = headers.get('server');
      if (serverHeader) {
        findings.push({
          category: 'Information Disclosure',
          title: 'Server Banner Exposed',
          whatINoticed: `Your site is advertising its web server as "${serverHeader}". This is like putting a sign on your door saying what brand of lock you use.`,
          howIAttack:
            'I now know exactly what server software you use, which helps me search for known vulnerabilities specific to that version.',
          whatCouldHappen:
            'Attackers can target known vulnerabilities in that specific server version more easily.',
          howToFix:
            'Configure your server to hide or obfuscate the Server header. In most web servers, you can set Server header to something generic or remove it.',
          severity: 'low',
        });
      }
    } catch (fetchError) {
      // If we can't reach the site, it might be blocked or down
      const errorMsg =
        fetchError instanceof Error ? fetchError.message : 'Could not reach site';

      if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: 'Could not reach this website. It might be offline, blocked, or the domain might not exist.',
          },
          { status: 400 },
        );
      }
    }

    // Add general recommendations if no critical issues
    if (findings.filter((f) => f.severity === 'high').length === 0) {
      findings.push({
        category: 'General Recommendations',
        title: 'Keep Security Updated',
        whatINoticed: 'Security isn&apos;t a one-time thing—threats and best practices evolve constantly.',
        howIAttack:
          'New vulnerabilities are discovered all the time. If you don&apos;t stay on top of updates, I could find a vulnerability you weren&apos;t aware of.',
        whatCouldHappen:
          'Outdated software is one of the most common entry points for attackers.',
        howToFix:
          'Regularly update your software, frameworks, and dependencies. Use security scanning tools. Follow security blogs and newsletters. Conduct regular security audits.',
        severity: 'medium',
      });
    }

    return NextResponse.json({
      findings,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the website' },
      { status: 500 },
    );
  }
}
