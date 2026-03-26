import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const SITE_NAME = 'Voice the Companies';
const SITE_URL = 'https://voicethecompanies.org';
const SOCIAL_IMAGE_PATH = '/logo.png';
const NOINDEX_ROUTES = new Set(['NOT_FOUND', 'BusinessDashboard']);

const SEO_BY_ROUTE = {
  Home: {
    title: 'Voice the Companies | Student-Business Digital Impact Program',
    description: 'Voice the Companies connects students and local businesses to build digital presence and measurable community impact.',
  },
  About: {
    title: 'About | Voice the Companies',
    description: 'Learn about the mission, vision, and approach behind Voice the Companies.',
  },
  GetInvolved: {
    title: 'Get Involved | Voice the Companies',
    description: 'Apply as a student or request services as a business owner to join the Voice the Companies program.',
  },
  Impact: {
    title: 'Impact | Voice the Companies',
    description: 'Explore outcomes, testimonials, and measurable results from student-business collaborations.',
  },
  Partners: {
    title: 'Partners | Voice the Companies',
    description: 'Support the program through partnership, mentorship, and community collaboration.',
  },
  DigitalLiteracy: {
    title: 'Digital Literacy Curriculum | Voice the Companies',
    description: 'Review the curriculum supporting foundational digital skills for participating businesses.',
  },
  NeedsAssessment: {
    title: 'Needs Assessment | Voice the Companies',
    description: 'Understand how we evaluate business needs to shape the right digital support plan.',
  },
  Workshops: {
    title: 'Follow-Up Workshops | Voice the Companies',
    description: 'Discover ongoing post-launch workshop support and register your interest.',
  },
  StudentTeams: {
    title: 'Student Teams | Voice the Companies',
    description: 'See how student teams are structured to deliver meaningful digital outcomes.',
  },
  MeasurableOutcomes: {
    title: 'Measurable Outcomes | Voice the Companies',
    description: 'Track the metrics and outcomes that define long-term success for participating businesses.',
  },
  BusinessDashboard: {
    title: 'Business Dashboard | Voice the Companies',
    description: 'View progress snapshots and performance metrics for participating business owners.',
  },
  NOT_FOUND: {
    title: 'Page Not Found | Voice the Companies',
    description: 'The page you are looking for could not be found.',
  },
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const routeKey = location.pathname === '/'
      ? mainPageKey
      : location.pathname.replace(/^\//, '');

    const seo = SEO_BY_ROUTE[routeKey] || SEO_BY_ROUTE.NOT_FOUND;
    const canonicalPath = routeKey === mainPageKey ? '/' : location.pathname;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;
    const socialImageUrl = `${window.location.origin}${import.meta.env.BASE_URL}logo.png`;
    const robotsContent = NOINDEX_ROUTES.has(routeKey) ? 'noindex,nofollow' : 'index,follow';

    document.title = seo.title;

    const upsertMeta = (attr, key, content) => {
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', robotsContent);
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'en_US');
    upsertMeta('property', 'og:image', socialImageUrl);
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:image', socialImageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const upsertAlternate = (hrefLang, href) => {
      let link = document.head.querySelector(`link[rel="alternate"][hreflang="${hrefLang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', hrefLang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    upsertAlternate('en', canonicalUrl);
    upsertAlternate('x-default', canonicalUrl);

    const upsertJsonLd = (id, data) => {
      let script = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo-jsonld', id);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${SOCIAL_IMAGE_PATH}`,
    });

    upsertJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'en-US',
    });

    upsertJsonLd('webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    });
  }, [location.pathname]);

  return null;
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
};

const DebugActivityLogger = () => {
  if (!import.meta.env.DEV) return null;

  const location = useLocation();

  useEffect(() => {
    console.log('[VTC Debug] App loaded');
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    console.log('[VTC Debug] Page opened', {
      path: `${location.pathname}${location.search}${location.hash}`,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const getElementLabel = (element) => {
      const aria = element.getAttribute('aria-label');
      if (aria) return aria;

      if (element.tagName === 'INPUT') {
        return element.value || element.getAttribute('name') || element.id || 'input';
      }

      const text = element.textContent?.trim();
      if (text) return text.slice(0, 80);

      return element.id || element.getAttribute('name') || element.tagName.toLowerCase();
    };

    const onClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
      if (!element) return;

      console.log('[VTC Debug] UI action', {
        type: 'click',
        tag: element.tagName.toLowerCase(),
        label: getElementLabel(element),
        href: element.getAttribute('href') || null,
        id: element.id || null,
        className: element.className || null,
        timestamp: new Date().toISOString(),
      });
    };

    const onSubmit = (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      console.log('[VTC Debug] Form submitted', {
        id: form.id || null,
        name: form.getAttribute('name') || null,
        action: form.getAttribute('action') || null,
        method: form.getAttribute('method') || 'get',
        timestamp: new Date().toISOString(),
      });
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit, true);
    };
  }, []);

  return null;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <SeoManager />
          <DebugActivityLogger />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
