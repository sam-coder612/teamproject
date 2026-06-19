import React, { useEffect, useRef } from 'react';
import './MountainIntro.css';

export const MountainIntro = () => {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const overlayRef = useRef(null);

  const targetRatioRef = useRef(0);
  const currentRatioRef = useRef(0);
  const animationFrameRef = useRef(null);

  const targetTimeRef = useRef(0);
  const lastRequestedTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);
  const seekStartTimeRef = useRef(0);
  const seekDurationRef = useRef(30); // Dynamic throttle delay (starts at 30ms)
  const pendingSeekTimeoutRef = useRef(null);
  const isLoopActiveRef = useRef(true);
  const lastSeekRatioRef = useRef(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Enforce absolute silence
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.pause();

    const handleVolumeChange = () => {
      if (!video.muted || video.volume !== 0) {
        video.muted = true;
        video.volume = 0;
      }
    };
    video.addEventListener('volumechange', handleVolumeChange);

    if (video.audioTracks) {
      const disableAudio = () => {
        Array.from(video.audioTracks).forEach(track => {
          track.enabled = false;
        });
      };
      disableAudio();
      video.audioTracks.addEventListener('addtrack', disableAudio);
    }

    // 2. High-Performance Throttled Seek Chain
    const performSeek = (time) => {
      if (!video || !isFinite(time) || isNaN(time)) return;

      if (pendingSeekTimeoutRef.current) {
        clearTimeout(pendingSeekTimeoutRef.current);
        pendingSeekTimeoutRef.current = null;
      }

      isSeekingRef.current = true;
      lastRequestedTimeRef.current = time;
      lastSeekTimeRef.current = performance.now();
      seekStartTimeRef.current = performance.now(); // Mark start of seek decode
      try {
        video.currentTime = time;
      } catch (err) {
        isSeekingRef.current = false;
      }
    };

    const requestSeek = (time) => {
      if (!isFinite(time) || isNaN(time)) return;

      // Only seek if target time has changed by more than 0.005 seconds (5ms)
      const timeDiff = Math.abs(time - lastRequestedTimeRef.current);
      if (timeDiff <= 0.005) {
        targetTimeRef.current = time;
        return;
      }

      targetTimeRef.current = time;

      if (isSeekingRef.current) {
        return;
      }

      const now = performance.now();
      const timeSinceLastSeek = now - lastSeekTimeRef.current;
      const throttleDuration = seekDurationRef.current; // Self-calibrated dynamic delay

      if (timeSinceLastSeek >= throttleDuration) {
        performSeek(time);
      } else {
        if (!pendingSeekTimeoutRef.current) {
          const delay = throttleDuration - timeSinceLastSeek;
          pendingSeekTimeoutRef.current = setTimeout(() => {
            if (!isSeekingRef.current) {
              performSeek(targetTimeRef.current);
            }
          }, delay);
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;

      // Measure actual hardware seek completion time
      const seekDuration = performance.now() - seekStartTimeRef.current;
      // Clamp dynamic throttle between 16ms (60fps limit) and 150ms
      seekDurationRef.current = Math.max(16, Math.min(150, seekDuration));

      // Check if we have a new target time that is different from what we just sought
      const diff = Math.abs(targetTimeRef.current - lastRequestedTimeRef.current);
      if (diff > 0.01) {
        const now = performance.now();
        const timeSinceLastSeek = now - lastSeekTimeRef.current;
        const throttleDuration = seekDurationRef.current;

        if (timeSinceLastSeek >= throttleDuration) {
          performSeek(targetTimeRef.current);
        } else {
          if (!pendingSeekTimeoutRef.current) {
            const delay = throttleDuration - timeSinceLastSeek;
            pendingSeekTimeoutRef.current = setTimeout(() => {
              if (!isSeekingRef.current) {
                performSeek(targetTimeRef.current);
              }
            }, delay);
          }
        }
      }
    };
    video.addEventListener('seeked', handleSeeked);

    // Scroll listener to update the target ratio
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const scrolled = window.scrollY;
      const scrollThreshold = window.innerHeight * 3.0;

      let ratio = scrolled / scrollThreshold;
      ratio = Math.max(0, Math.min(1, ratio));

      targetRatioRef.current = ratio;

      // Wake up the loop if it's not active
      if (!isLoopActiveRef.current) {
        isLoopActiveRef.current = true;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    // Smooth rendering animation loop with error resilience
    const updateLoop = () => {
      try {
        const diff = targetRatioRef.current - currentRatioRef.current;

        if (Math.abs(diff) > 0.0001) {
          currentRatioRef.current += diff * 0.06;
        } else {
          currentRatioRef.current = targetRatioRef.current;
        }

        const ratio = currentRatioRef.current;

        // Sync seeking to exact scroll position ratio (perfect alignment)
        if (video && video.readyState >= 1 && video.duration && isFinite(video.duration)) {
          const targetTime = ratio * (video.duration - 0.1);
          requestSeek(targetTime);
        }

        // Apply transforms and opacity mappings
        if (video) {
          video.style.transform = `translate3d(-50%, -50%, 0) scale(${1 + ratio * 0.12})`;
        }

        if (textRef.current) {
          const textOpacity = Math.max(0, 1 - ratio * 1.6);
          textRef.current.style.transform = `translate3d(-50%, -50%, 0) translateY(${-ratio * 100}px) scale(${1 - ratio * 0.15})`;
          textRef.current.style.opacity = `${textOpacity}`;
        }

        if (wrapperRef.current) {
          const wrapperOpacity = ratio >= 0.8 ? (1 - ratio) / 0.2 : 1;
          wrapperRef.current.style.opacity = `${wrapperOpacity}`;

          if (ratio >= 0.99) {
            wrapperRef.current.classList.add('hidden');
            wrapperRef.current.style.visibility = 'hidden';
          } else {
            wrapperRef.current.classList.remove('hidden');
            wrapperRef.current.style.visibility = 'visible';
          }
        }

        // If we are settled on ratio, we can stop the loop
        if (Math.abs(diff) <= 0.0001) {
          isLoopActiveRef.current = false;
          animationFrameRef.current = null;
          return;
        }
      } catch (err) {
        // Log error and prevent loop crash
        console.error("Error in updateLoop:", err);
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    // Initialize listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    video.addEventListener('loadedmetadata', handleScroll);
    video.addEventListener('canplay', handleScroll);

    // Trigger initial render alignment
    handleScroll();
    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pendingSeekTimeoutRef.current) {
        clearTimeout(pendingSeekTimeoutRef.current);
      }
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleScroll);
      video.removeEventListener('canplay', handleScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="intro-wrapper">
      <div className="intro-sticky">
        {/* Cinematic Video Layer */}
        <video
          ref={videoRef}
          className="intro-video-bg"
          src={`${import.meta.env.BASE_URL}mountains.mp4`}
          type="video/mp4"
          muted
          playsInline
          preload="auto"
        />

        {/* Gradient Contrast Overlay */}
        <div ref={overlayRef} className="intro-video-overlay"></div>

        {/* Text Overlay */}
        <div ref={textRef} className="intro-text">
          <h1 className="intro-title" style={{ fontSize: 'clamp(3rem, 1rem + 7vw, 6rem)' }}>TravelWise</h1>
          <p className="intro-subtitle" style={{ color: 'var(--teal)' }}>Journey Through the Mountains</p>
          <div className="scroll-indicator">
            <span className="mouse-wheel" style={{ borderColor: 'var(--teal)' }}></span>
            <span style={{ color: 'var(--teal)' }}>Scroll to Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
