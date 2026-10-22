# Legacy prototype

This folder holds the original Streamlit prototype of the Economic Ripple dashboard
(`app.py`), built directly on top of the same `simulator/` and `shock_engine/` modules
that now power the FastAPI backend, plus a sample report export
(`economic-ripple-recession-report.html`) generated from it.

It has been superseded by the Next.js frontend in `economic-ripple-ui/`, which replaced
the single-page Streamlit app with a proper multi-chart dashboard, time-scrubber
playback, and a dedicated REST API. Kept here for reference rather than deleted — it is
not maintained and not part of the current application.
