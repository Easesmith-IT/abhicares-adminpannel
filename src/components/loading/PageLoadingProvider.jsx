import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const PageLoadingContext = createContext(null);

const INITIAL_ROUTE_LOADING_TIMEOUT_MS = 250;

export function PageLoadingProvider({ children }) {
  const location = useLocation();
  const timeoutRef = useRef(null);
  const currentRouteKeyRef = useRef(location.pathname);
  const currentRequestCountRef = useRef(0);
  const didTrackInitialRequestRef = useRef(false);
  const initialLoadResolvedRef = useRef(false);

  const [activeRequestCount, setActiveRequestCount] = useState(0);
  const [showInitialOverlay, setShowInitialOverlay] = useState(
    location.pathname.startsWith("/admin")
  );

  const clearInitialTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resolveInitialOverlay = useCallback(() => {
    if (initialLoadResolvedRef.current) {
      return;
    }

    initialLoadResolvedRef.current = true;
    clearInitialTimer();
    setShowInitialOverlay(false);
  }, [clearInitialTimer]);

  useLayoutEffect(() => {
    clearInitialTimer();

    currentRouteKeyRef.current = location.pathname;
    currentRequestCountRef.current = 0;
    didTrackInitialRequestRef.current = false;
    initialLoadResolvedRef.current = false;
    setActiveRequestCount(0);

    const shouldTrackRoute = location.pathname.startsWith("/admin");
    setShowInitialOverlay(shouldTrackRoute);

    if (!shouldTrackRoute) {
      initialLoadResolvedRef.current = true;
      return undefined;
    }

    timeoutRef.current = window.setTimeout(() => {
      resolveInitialOverlay();
    }, INITIAL_ROUTE_LOADING_TIMEOUT_MS);

    return () => {
      clearInitialTimer();
    };
  }, [clearInitialTimer, location.pathname, resolveInitialOverlay]);

  const beginRequest = useCallback(
    ({ loadingUi = "global" } = {}) => {
      if (loadingUi === "silent") {
        return () => {};
      }

      currentRequestCountRef.current += 1;
      setActiveRequestCount(currentRequestCountRef.current);

      if (!initialLoadResolvedRef.current) {
        didTrackInitialRequestRef.current = true;
        setShowInitialOverlay(true);
      }

      let completed = false;

      return () => {
        if (completed) {
          return;
        }

        completed = true;
        currentRequestCountRef.current = Math.max(
          0,
          currentRequestCountRef.current - 1
        );
        setActiveRequestCount(currentRequestCountRef.current);

        if (
          !initialLoadResolvedRef.current &&
          didTrackInitialRequestRef.current &&
          currentRequestCountRef.current === 0
        ) {
          resolveInitialOverlay();
        }
      };
    },
    [resolveInitialOverlay]
  );

  const value = useMemo(
    () => ({
      beginRequest,
      isInitialOverlayVisible: showInitialOverlay,
      isActivityBarVisible:
        activeRequestCount > 0 && initialLoadResolvedRef.current,
      activeRequestCount,
      routeKey: currentRouteKeyRef.current,
    }),
    [activeRequestCount, beginRequest, showInitialOverlay]
  );

  return (
    <PageLoadingContext.Provider value={value}>
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext);

  if (!context) {
    throw new Error("usePageLoading must be used within a PageLoadingProvider.");
  }

  return context;
}
