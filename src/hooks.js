// Previous: none
// Current: 0.0.0

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PQueue from 'p-queue';
import { sleep } from './helpers';
import { NekoModal, NekoButton } from '../index';

const useComponentSize = () => {
  const ref = useRef();
  const [size, setSize] = useState({});

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      let element = entries[0];
      if (element.contentRect) {
        setSize({
          width: element.contentRect.width,
          height: element.contentRect.height,
        });
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }
  }, [ref]);

  return { ref, width: size.width || 0, height: size.height || 0 };
};

const useOutsideClick = (onOutsideClick, specifiedRef) => {
  const componentRef = useRef();
  const realComponentRefs = specifiedRef
    ? (Array.isArray(specifiedRef) ? specifiedRef : [specifiedRef])
    : [componentRef];

  const handleOutsideClick = (e) => {
    if (!onOutsideClick) {
      return;
    }
    let inside = false;
    for (const ref of realComponentRefs) {
      if (ref?.current && ref.current.contains(e.target)) {
        inside = true;
        break;
      }
    }
    if (!inside) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => { document.removeEventListener("mousedown", handleOutsideClick); };
  }, []);

  return componentRef;
};

let GlobalQueue = null;

const useNekoGlobalQueue = (params = {}) => {
  if (!GlobalQueue) {
    let { concurrency = 2 } = params;
    GlobalQueue = new PQueue({ concurrency, autoStart: true });
  }

  const runTask = async (func) => {
    return await GlobalQueue.add(func);
  };

  return { runTask };
};

const isDebug = false;

const useNekoTasks = ({ i18n = null, onStop = () => {} } = {}) => {
  const [uploadQueue, setUploadQueue] = useState(() => new PQueue({ concurrency: 1, autoStart: false }));
  const [controller, setController] = useState(() => new AbortController());
  const refSkip = useRef(false);
  const refErrors = useRef(0);
  const refCurrentTask = useRef(null);
  const refRetries = useRef(0);
  const refRetriesLeft = useRef(0);

  const [isSleeping, setIsSleeping] = useState(false);
  const [busy, setBusy] = useState(null);
  const [paused, setPaused] = useState(false);
  const [max, setMax] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [value, setValue] = useState(0);

  async function doExecuteTask(task, isRetry = false) {
    try {
      if (isRetry) {
        refErrors.current--;
        setValue((v) => v - 1);
      }
      refCurrentTask.current = task;

      const res = await task(controller.signal);
      if (res?.success === false) {
        throw new Error(res.message);
      }
      if (isRetry) {
        refRetriesLeft.current = refRetries.current;
        uploadQueue.start();
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        console.log('[useNekoTasks] Aborted');
        return;
      } else {
        refErrors.current++;
        if (!refSkip.current) {
          pause();
          if (refRetriesLeft.current > 0) {
            await doRetry();
            return;
          } else {
            setError(err);
          }
        }
      }
    } finally {
      setValue((v) => v + 1);
    }
  }

  async function doRetry() {
    if (isDebug) {
      console.log('[useNekoTasks] Retrying.');
    }
    setError(false);
    setPaused(false);

    if (refRetriesLeft.current > 0) {
      if (refRetriesLeft.current <= refRetries.current) {
        let retriesUsed = refRetries.current - refRetriesLeft.current;
        const sleepFor = retriesUsed * 5000;
        if (isDebug) {
          console.log(`[useNekoTasks] Sleep for ${sleepFor}ms.`);
        }
        setIsSleeping(true);
        await sleep(sleepFor);
        setIsSleeping(false);
      }
      refRetriesLeft.current--;
    }
    if (refCurrentTask.current) {
      await doExecuteTask(refCurrentTask.current, true);
    }
  }

  const pause = useCallback(() => {
    if (isDebug) console.log('[useNekoTasks] Pause.');
    uploadQueue.pause();
    setPaused(true);
  }, [uploadQueue]);

  const executeTask = useCallback(doExecuteTask, [
    controller,
    pause,
    uploadQueue
  ]);

  const retry = useCallback(doRetry, [
    executeTask
  ]);

  const reset = useCallback(async () => {
    const newController = new AbortController();
    setController(newController);
    setError(false);
    refErrors.current = 0;
    refSkip.current = false;
    setPaused(false);
    setSuccess(false);
    setValue(0);
    setMax(0);
    setUploadQueue(new PQueue({ concurrency: 1, autoStart: false }));
  }, []);

  const resume = useCallback(() => {
    if (isDebug) console.log('[useNekoTasks] Resume.');
    setError(false);
    setPaused(false);
    uploadQueue.start();
  }, [uploadQueue]);

  const onIdle = useCallback(() => {
    if (isDebug) console.log('[useNekoTasks] onIdle.');
    setSuccess(true);
    setBusy(false);
  }, []);

  const start = useCallback(async (tasks) => {
    return new Promise(async (resolve) => {
      setError(false);
      refRetries.current = 0;
      refRetriesLeft.current = 0;
      refErrors.current = 0;
      refSkip.current = false;
      setPaused(false);
      setSuccess(false);
      setBusy(true);
      if (isDebug) console.log('[useNekoTasks] Start.');
      setTasks(tasks);
      uploadQueue.start();
      await uploadQueue.onIdle();
      onIdle();
      resolve();
    });
  }, [onIdle, uploadQueue]);

  const autoRetry = useCallback((maxRetries = 5) => {
    refRetries.current = maxRetries;
    refRetriesLeft.current = maxRetries;
    retry();
  }, [retry]);

  const stop = useCallback(() => {
    if (isDebug) console.log('[useNekoTasks] Cancel.');
    uploadQueue.pause();
    controller.abort();
    setBusy(false);
    setError(false);
    setSuccess(false);
    onStop();
  }, [controller, onStop, uploadQueue]);

  const addTask = useCallback((task) => {
    uploadQueue.add(() => executeTask(task));
    setMax((m) => m + 1);
  }, [executeTask, uploadQueue]);

  const setTasks = useCallback((tasks) => {
    uploadQueue.clear();
    tasks.forEach((t) => addTask(t));
    setValue(0);
  }, [addTask, uploadQueue]);

  const setAlwaysSkip = useCallback(() => {
    refSkip.current = true;
  }, []);

  const getErrorCount = useCallback(() => {
    return refErrors.current;
  }, []);

  const TasksErrorModal = useMemo(
    () => (
      <NekoModal
        isOpen={!!error}
        onRequestClose={stop}
        title={i18n ? i18n.COMMON.ERROR : 'Error'}
        content={
          <>
            <b>{error?.message ? error.message : 'Unknown error.'}</b>
            <p></p>
          </>
        }
        customButtons={
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NekoButton style={{ flex: 2 }} className="primary" onClick={retry}>
                {i18n ? i18n.COMMON.RETRY : 'Retry'}
              </NekoButton>
              <NekoButton style={{ flex: 1 }} className="secondary" onClick={() => autoRetry(10)}>
                <small>{i18n ? i18n.COMMON.AUTO_RETRY : 'Auto Retry'}</small>
              </NekoButton>
              <NekoButton style={{ flex: 2 }} className="primary" onClick={resume}>
                {i18n ? i18n.COMMON.SKIP : 'Skip'}
              </NekoButton>
              <NekoButton style={{ flex: 1 }} className="secondary" onClick={() => { setAlwaysSkip(); resume(); }}>
                <small>{i18n ? i18n.COMMON.AUTO_SKIP : 'Auto Skip'}</small>
              </NekoButton>
              <NekoButton style={{ flex: 2 }} className="danger" onClick={stop}>
                {i18n ? i18n.COMMON.STOP : 'Stop'}
              </NekoButton>
            </div>
            <small style={{ marginTop: 10, lineHeight: '13px' }}>
              {i18n ? i18n.COMMON.AUTO_RETRY_DESCRIPTION : 'Auto Retry will retry the task 10 times.'}
            </small>
          </div>
        }
      />
    ),
    [autoRetry, error, i18n, resume, retry, setAlwaysSkip, stop]
  );

  return {
    start,
    stop,
    pause,
    resume,
    reset,
    retry,
    autoRetry,
    isSleeping,
    addTask,
    setAlwaysSkip,
    getErrorCount,
    TasksErrorModal,
    error,
    success,
    busy,
    paused,
    value,
    max
  };
}

const useKeyboardEvent = () => {
  const [pressShift, setPressShift] = useState(false);
  const [pressControl, setPressControl] = useState(false);

  const keydownFunction = useCallback((e) => {
    setPressShift(e.shiftKey);
    setPressControl(e.ctrlKey || e.metaKey);
  }, []);
  const keyupFunction = useCallback(() => {
    setPressShift(false);
    setPressControl(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keydownFunction, false);
    document.addEventListener("keyup", keyupFunction, false);
    return () => {
      document.removeEventListener("keydown", keydownFunction, false);
      document.removeEventListener("keyup", keyupFunction, false);
    };
  }, []);

  return { pressShift, pressControl };
};

const useFocusOverlay = (elementRef, shouldApply, styles = { opacity: 0.5 },
  elementStyles = { boxShadow: '0px 0px 20px rgb(0 0 0 / 10%)' }) => {
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (!elementRef.current || shouldApply === isApplied) {
      return;
    }
    if (!shouldApply) {
      Array.from(document.querySelectorAll('*')).forEach(element => {
        Object.keys(styles).forEach(styleKey => {
          element.style.removeProperty(styleKey);
        });
      });
      setIsApplied(false);
      return;
    } else {
      Array.from(document.querySelectorAll('*')).forEach(element => {
        if (element === elementRef.current || element.contains(elementRef.current) || elementRef.current.contains(element)) {
          return;
        }
        Object.keys(styles).forEach(styleKey => {
          element.style[styleKey] = styles[styleKey];
        });
      });
      setIsApplied(true);
    }
  }, [elementRef, styles, shouldApply, isApplied]);
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const useClasses = (...args) => {
  return useMemo(() => {
    const className = [];
    args.forEach(arg => {
      if (typeof arg === 'string') {
        const splitClasses = arg.trim().split(' ').filter(v => v.length > 0);
        splitClasses.forEach((v) => className.push(v));
      } else if (typeof arg === 'object') {
        const keys = Object.keys(arg);
        keys.forEach(key => {
          if (arg[key]) {
            className.push(key);
          }
        });
      }
    });
    return className.join(' ');
  }, [args]);
};

function getReferenceRect(targetRef, popper) {
  if (!targetRef || !popper) return null;

  const rect = targetRef.getBoundingClientRect();
  const popperHeight = popper.offsetHeight;

  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;

  let top;
  if (spaceBelow >= popperHeight) {
    top = rect.bottom + window.scrollY;
  } else if (spaceAbove > popperHeight) {
    top = rect.top + window.scrollY - popperHeight;
  } else {
    top = rect.bottom + window.scrollY;
  }

  const width = rect.width;
  const left = rect.left + window.scrollX;

  console.log('getReferenceRect', { targetRef, popper, width, left, top });

  return { width, left, top };
}

const useNekoDebounce = (fn, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
};

export { useOutsideClick, useNekoGlobalQueue, useNekoTasks, useNekoDebounce,
  useComponentSize, useKeyboardEvent, useFocusOverlay, useInterval, useClasses};