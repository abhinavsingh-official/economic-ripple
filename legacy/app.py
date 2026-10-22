import streamlit as st
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import tempfile

from simulator.scenario_runner import ScenarioRunner
from simulator.explanation_pipeline import ExplanationPipeline
from simulator.insight_engine import InsightEngine
from shock_engine.shock_scenarios import ShockScenarios

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

# =========================================================
# CONFIG
# =========================================================
st.set_page_config(page_title="Economic Ripple", layout="wide")

# =========================================================
# SESSION STATE
# =========================================================
if "scenario" not in st.session_state:
    st.session_state.scenario = None

if "runs" not in st.session_state:
    st.session_state.runs = {}

# =========================================================
# VARIABLES
# =========================================================
variables = [
    "depression_prev","gdp_growth","inflation",
    "unemployment_rate","poverty_rate","urbanization","homicide_rate"
]

labels = {
    "depression_prev": "Mental Health",
    "gdp_growth": "GDP Growth",
    "inflation": "Inflation",
    "unemployment_rate": "Unemployment",
    "poverty_rate": "Poverty",
    "urbanization": "Urbanization",
    "homicide_rate": "Crime"
}

scenario_info = {
    "recession": "Economic slowdown",
    "boom": "High growth",
    "stagflation": "Low growth + inflation",
    "social_crisis": "Instability spike",
    "recovery": "Post-crisis recovery"
}

def normalize(x): return x / 100.0

# =========================================================
# ECONOMIC SCORE
# =========================================================
def compute_score(row):
    weights = {
        "gdp_growth": 0.25,
        "unemployment_rate": -0.2,
        "inflation": -0.1,
        "poverty_rate": -0.2,
        "homicide_rate": -0.15,
        "urbanization": 0.1,
        "depression_prev": -0.1
    }
    return sum(row[v] * weights[v] for v in weights)

# =========================================================
# PDF REPORT
# =========================================================
def generate_pdf(df, insight):
    path = tempfile.mktemp(".pdf")
    doc = SimpleDocTemplate(path)
    styles = getSampleStyleSheet()

    content = []
    content.append(Paragraph("Economic Ripple Report", styles["Title"]))
    content.append(Paragraph(str(insight), styles["Normal"]))

    doc.build(content)
    return path

# =========================================================
# LOAD DATA
# =========================================================
@st.cache_data
def load():
    df = pd.read_csv("data/processed/model_training/model_v5_predictions.csv")
    A_df = pd.read_csv("data/processed/model_training/system_matrix_v4.csv", index_col=0)
    return df, A_df.loc[variables, variables].values

df_data, A = load()

def init_states(countries):
    return {
        c: df_data[df_data["region"] == c]
        .sort_values("year").iloc[-1][variables].values.astype(float)
        for c in countries
    }

# =========================================================
# HEADER
# =========================================================
st.title("Economic Ripple")
st.caption("Each step = one simulation cycle (system + shocks update variables).")

# =========================================================
# CONTROLS
# =========================================================
col1, col2, col3 = st.columns(3)

with col1:
    countries = st.multiselect("Countries", sorted(df_data["region"].unique()), default=["India"])

with col2:
    steps = st.slider("Steps", 5, 30, 12)

with col3:
    scale = st.slider("Intensity", 0.1, 2.0, 1.0)

# =========================================================
# SCENARIO
# =========================================================
st.subheader("Scenario Presets")

cols = st.columns(len(scenario_info))

for i, sc in enumerate(scenario_info):
    if cols[i].button(sc.upper()):
        st.session_state.scenario = sc

if st.session_state.scenario:
    st.info(scenario_info[st.session_state.scenario])

    sc_obj = getattr(ShockScenarios, st.session_state.scenario)()
    st.json(sc_obj.shocks)

# =========================================================
# MANUAL
# =========================================================
st.subheader("Policy Controls (-100 to 100)")

manual = {}
cols = st.columns(4)

for i, v in enumerate(variables):
    val = cols[i % 4].slider(labels[v], -100, 100, 0)
    if val != 0:
        manual[v] = normalize(val)
        st.session_state.scenario = None

# =========================================================
# TIMELINE
# =========================================================
st.subheader("Shock Timeline")

timeline = {}
num_events = st.slider("Events", 0, 5, 0)

for i in range(num_events):
    t = st.slider(f"Step {i}", 0, steps-1, i)
    sc = st.selectbox(f"Scenario {i}", ["None"] + list(scenario_info), key=i)

    if sc != "None":
        timeline.setdefault(t, {})["scenario"] = sc

# =========================================================
# RUN
# =========================================================
if st.button("Run Simulation"):

    with st.spinner("Running simulation..."):

        runner = ScenarioRunner(
            system_matrix=A,
            country_list=countries,
            initial_states=init_states(countries),
            variables=variables,
            damping=0.01,
            noise_level=0.02
        )

        config = {
            "steps": steps,
            "scenario": st.session_state.scenario,
            "scale": scale,
            "targets": countries,
            "manual": manual,
            "timeline": timeline
        }

        _, df = runner.run(config)

    # =====================================================
    # TABS
    # =====================================================
    tab1, tab2, tab3 = st.tabs(["Dashboard", "Comparison", "Deep Dive"])

    # =====================================================
    # DASHBOARD
    # =====================================================
    with tab1:

        latest = df[df["step"] == steps - 1]

        cols = st.columns(len(countries))
        for i, c in enumerate(countries):
            row = latest[latest["country"] == c].iloc[0]
            cols[i].metric(c, f"{compute_score(row):.2f}")

        # Multi-variable
        vars_selected = st.multiselect("Indicators", variables, default=["gdp_growth"])

        selected_country = st.selectbox("Country", countries)
        df_f = df[df["country"] == selected_country]

        st.plotly_chart(px.line(df_f, x="step", y=vars_selected), use_container_width=True)

        # Radar
        fig = go.Figure()
        for c in countries:
            vals = latest[latest["country"] == c][variables].values.flatten()
            fig.add_trace(go.Scatterpolar(r=vals, theta=list(labels.values()), fill='toself', name=c))
        st.plotly_chart(fig)

        # Correlation
        st.plotly_chart(px.imshow(df[variables].corr()), use_container_width=True)

        # Distribution
        st.plotly_chart(px.box(df, y=variables), use_container_width=True)

    # =====================================================
    # COMPARISON
    # =====================================================
    with tab2:

        sc2 = st.selectbox("Compare Scenario", list(scenario_info))

        config2 = config.copy()
        config2["scenario"] = sc2

        _, df2 = runner.run(config2)

        df["run"] = "Run1"
        df2["run"] = "Run2"

        combined = pd.concat([df, df2])

        st.plotly_chart(px.line(combined, x="step", y="gdp_growth", color="run"))

    # =====================================================
    # DEEP DIVE
    # =====================================================
    with tab3:

        c = st.selectbox("Country", countries)
        step = st.slider("Step", 0, steps - 1)

        st.dataframe(df[(df["country"] == c) & (df["step"] == step)])

        exp = ExplanationPipeline(A, variables).generate(df, c)

        for e in exp:
            if e["step"] == step:
                for line in e["text"]:
                    st.write("•", line)

        insight = InsightEngine(variables).analyze(df, c)
        st.dataframe(pd.DataFrame(insight))

        # Save
        name = st.text_input("Save Run")
        if st.button("Save"):
            st.session_state.runs[name] = df.copy()

        # Load
        load = st.selectbox("Load Run", list(st.session_state.runs.keys()))
        if st.button("Load"):
            df = st.session_state.runs[load]

        # PDF
        pdf = generate_pdf(df, insight)
        with open(pdf, "rb") as f:
            st.download_button("Download PDF", f, "report.pdf")