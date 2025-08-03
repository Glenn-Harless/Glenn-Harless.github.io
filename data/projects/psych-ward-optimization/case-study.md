# psych ward optimization

## problem

26-bed psychiatric facility operating at 60% efficiency. patients with severe conditions required isolation, forcing them into double rooms alone. the wasted bed couldn't be used. staff manually juggled room assignments daily. no data-driven approach existed.

accepted for presentation at the american psychological association conference - results still underway.

## approach

linear programming with pulp solver. modeled ward as constraint optimization problem.

key constraints:
- total beds fixed at 26
- patients deemed unsafe for others or themselves required their own room
- other patients could double in a room
- minimize total wasted beds

decision variables:
- D: number of double rooms (0-13)
- S: number of single rooms (0-26)
- constraint: 2D + S = 26

objective function minimized both wasted beds (singles in doubles) and wasted potential (doubles forced into singles).

## implementation

```python
# core optimization logic
problem = pulp.LpProblem("OptimizeWardSpace", pulp.LpMinimize)

# decision variables
D = pulp.LpVariable('D', lowBound=0, upBound=13, cat='Integer')
S = pulp.LpVariable('S', lowBound=0, upBound=26, cat='Integer')

# bed capacity constraint
problem += (2 * D + S == 26)

# daily constraints for each census day
for day in census_data:
    single_in_double = pulp.LpVariable(f'sid_{day}', lowBound=0)
    problem += (S + single_in_double >= singles_needed)
    problem += (single_in_double <= doubles_needed)
```

processed 4 years of daily census data. tracked patient acuity levels, isolation requirements, and bed utilization patterns. built comprehensive data pipeline from excel files.

## results

optimal configuration: 10 single rooms, 8 double rooms.

results still underway. project accepted for presentation at the american psychological association conference.

visualization suite generated publication-quality charts comparing current vs optimized models. daily efficiency tracking showed consistent improvements.

## learnings

constraint programming excels at resource allocation in healthcare. real-world constraints often more complex than initial models suggest.

key insights:
- flexibility matters more than pure optimization
- staff buy-in critical for implementation
- simple visualizations communicate better than complex metrics

modular architecture allowed easy adaptation to different ward configurations. yaml-based config enabled non-technical staff to adjust parameters.

apa presentation will showcase methodology and expected outcomes to other institutions facing similar challenges.