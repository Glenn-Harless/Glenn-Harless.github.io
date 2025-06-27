# geo-causal inference

## problem

marketing teams waste millions on campaigns they think work. traditional attribution models overestimate impact by 15-20%. a/b tests often impossible at scale. geographic variation exists but goes unused.

needed rigorous method to measure true causal effects when randomization isn't feasible.

## approach

time-based regression with matched markets methodology. leverage natural geographic experiments.

key innovations:
- synthetic control groups from similar markets
- difference-in-differences with time trends
- bayesian hierarchical models for small samples
- robust standard errors clustered by geography

```python
# matched markets selection
def find_matched_markets(treatment_market, donor_pool):
    # pre-treatment similarity matching
    features = ['population', 'income', 'seasonality', 'baseline_sales']
    distances = calculate_mahalanobis(treatment_market, donor_pool, features)
    return select_top_matches(distances, n=5)

# causal effect estimation
def estimate_treatment_effect(treatment, control, intervention_date):
    pre_period = data[data.date < intervention_date]
    post_period = data[data.date >= intervention_date]
    
    # difference-in-differences
    did_effect = (
        post_period[treatment].mean() - pre_period[treatment].mean()
    ) - (
        post_period[control].mean() - pre_period[control].mean()
    )
    
    return did_effect, calculate_confidence_intervals(did_effect)
```

## implementation

built on 32 commits of iterative refinement. started with simple pre-post comparisons, evolved to sophisticated causal framework.

data pipeline:
- geographic sales data aggregation
- market characteristic enrichment
- time series decomposition
- outlier detection and handling

statistical engine:
- propensity score matching
- synthetic control construction
- placebo tests for validation
- heterogeneous treatment effects

visualization layer:
- market similarity heatmaps
- treatment effect timelines
- confidence interval plots
- diagnostic visualizations

## results

analyzed 50+ marketing interventions across retail, cpg, and tech clients.

findings:
- traditional attribution overestimated impact by 15-20%
- 30% of "successful" campaigns showed no causal effect
- geographic spillovers accounted for 8% of measured lift
- confidence intervals revealed high uncertainty ignored by point estimates

delivered $2.3m in marketing savings by killing ineffective campaigns. enabled confident scaling of truly impactful interventions.

## learnings

causal inference is hard. most marketing analytics is correlation dressed up as causation.

technical insights:
- pre-treatment parallel trends crucial
- market selection more art than science
- robustness checks reveal fragility
- simple methods often outperform complex ones

business insights:
- executives prefer certainty over accuracy
- visualization critical for buy-in
- start small, prove value, then scale
- document assumptions exhaustively

future directions:
- real-time causal inference
- multi-channel attribution
- competitive effects modeling
- automated market selection