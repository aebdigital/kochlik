'use client';

import { useEffect } from 'react';

const MOTION_SELECTOR = [
  'main h1',
  'main h2',
  'main h3',
  'main p',
  'main article',
  'main aside',
  'main form',
  'main figure',
  'main [class*="grid"] > *',
  'main [class*="columns"] > *',
  'main [data-motion="fade-up"]',
].join(',');

const SKIP_SELECTOR = [
  '[data-no-motion]',
  '[data-no-motion] *',
  'script',
  'style',
  'noscript',
  'iframe',
  'input',
  'select',
  'textarea',
  'button',
].join(',');

function isHTMLElement(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function shouldSkip(element: HTMLElement) {
  if (element.matches(SKIP_SELECTOR)) {
    return true;
  }

  const productCard = element.closest('a[href^="/produkt/"]');
  return Boolean(productCard && productCard !== element);
}

export default function ScrollMotion() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add('motion-ready');

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.dataset.motionVisible = 'true';
            observer.unobserve(target);
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      }
    );

    const revealAfterPaint = (element: HTMLElement) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          element.dataset.motionVisible = 'true';
        });
      });
    };

    const revealPassedElements = () => {
      const pending = Array.from(
        document.querySelectorAll('[data-motion="fade-up"][data-motion-registered="true"]:not([data-motion-visible="true"])')
      ).filter(isHTMLElement);

      for (const element of pending) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          element.dataset.motionVisible = 'true';
          observer.unobserve(element);
        }
      }
    };

    let scrollFrame = 0;
    const scheduleRevealPassedElements = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        revealPassedElements();
      });
    };

    const register = (scope: ParentNode = document) => {
      const elements = Array.from(scope.querySelectorAll(MOTION_SELECTOR))
        .filter(isHTMLElement)
        .filter(element => !shouldSkip(element))
        .filter(element => !element.dataset.motionRegistered);

      elements.forEach((element, index) => {
        element.dataset.motion ||= 'fade-up';
        element.dataset.motionRegistered = 'true';
        if (!element.style.getPropertyValue('--motion-delay')) {
          element.style.setProperty('--motion-delay', `${Math.min((index % 8) * 55, 385)}ms`);
        }
        if (isInViewport(element)) {
          revealAfterPaint(element);
        } else {
          observer.observe(element);
        }
      });
    };

    register();
    revealPassedElements();

    const mutationObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (
              node.matches(MOTION_SELECTOR) &&
              !shouldSkip(node) &&
              !node.dataset.motionRegistered
            ) {
              node.dataset.motion ||= 'fade-up';
              node.dataset.motionRegistered = 'true';
              if (!node.style.getPropertyValue('--motion-delay')) {
                node.style.setProperty('--motion-delay', '0ms');
              }
              if (isInViewport(node)) {
                revealAfterPaint(node);
              } else {
                observer.observe(node);
              }
            }
            register(node);
          }
        }
      }
      revealPassedElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('scroll', scheduleRevealPassedElements, { passive: true });
    window.addEventListener('resize', scheduleRevealPassedElements);

    return () => {
      root.classList.remove('motion-ready');
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', scheduleRevealPassedElements);
      window.removeEventListener('resize', scheduleRevealPassedElements);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
