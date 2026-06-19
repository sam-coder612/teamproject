import React, { useState } from 'react';

export const BudgetCalculator = () => {
  // Controlled Inputs States
  const [transport, setTransport] = useState(5000);
  const [hotel, setHotel] = useState(8000);
  const [food, setFood] = useState(4000);
  const [activities, setActivities] = useState(3000);
  const [misc, setMisc] = useState(2000);

  // Derived State (Required by prompt)
  const totalBudget = transport + hotel + food + activities + misc;

  // Calculate percentages
  const getPercentage = (amount) => {
    if (totalBudget === 0) return 0;
    return Math.round((amount / totalBudget) * 100);
  };

  const pctTransport = getPercentage(transport);
  const pctHotel = getPercentage(hotel);
  const pctFood = getPercentage(food);
  const pctActivities = getPercentage(activities);
  const pctMisc = getPercentage(misc);

  return (
    <div className="budget-calculator-page section page-enter">
      <div className="container">
        <h2 className="section-title">Travel Budget Calculator</h2>
        <p className="section-subtitle">Keep your trip financial planning simple and visual with real-time budget breakdowns</p>

        <div className="budget-grid">
          {/* Budget Calculator Input Form */}
          <div className="budget-calc-card">
            <h3 className="form-title">Enter Costs</h3>
            <form className="planner-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="budget-transport">Transportation Cost (₹)</label>
                <input
                  id="budget-transport"
                  type="number"
                  min="0"
                  value={transport}
                  onChange={(e) => setTransport(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget-hotel">Hotel / Lodging Cost (₹)</label>
                <input
                  id="budget-hotel"
                  type="number"
                  min="0"
                  value={hotel}
                  onChange={(e) => setHotel(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget-food">Food & Dining Cost (₹)</label>
                <input
                  id="budget-food"
                  type="number"
                  min="0"
                  value={food}
                  onChange={(e) => setFood(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget-activities">Activities & Sightseeing Cost (₹)</label>
                <input
                  id="budget-activities"
                  type="number"
                  min="0"
                  value={activities}
                  onChange={(e) => setActivities(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget-misc">Miscellaneous Cost (₹)</label>
                <input
                  id="budget-misc"
                  type="number"
                  min="0"
                  value={misc}
                  onChange={(e) => setMisc(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </form>
          </div>

          {/* Budget Breakdown Results Display */}
          <div className="budget-results-panel">
            {/* Jumbotron Total Display */}
            <div className="total-budget-jumbo">
              <div className="total-budget-title">Total Estimated Budget</div>
              <div className="total-budget-amount">₹{totalBudget.toLocaleString('en-IN')}</div>
            </div>

            {/* Individual Breakdown Cards */}
            <div className="budget-cards-grid">
              <div className="budget-breakdown-card">
                <span className="budget-card-title">Transportation</span>
                <span className="budget-card-amount">₹{transport.toLocaleString('en-IN')}</span>
                <span className="budget-card-pct">{pctTransport}% of total</span>
              </div>
              <div className="budget-breakdown-card hotel">
                <span className="budget-card-title">Hotel / Lodging</span>
                <span className="budget-card-amount">₹{hotel.toLocaleString('en-IN')}</span>
                <span className="budget-card-pct">{pctHotel}% of total</span>
              </div>
              <div className="budget-breakdown-card food">
                <span className="budget-card-title">Food & Dining</span>
                <span className="budget-card-amount">₹{food.toLocaleString('en-IN')}</span>
                <span className="budget-card-pct">{pctFood}% of total</span>
              </div>
              <div className="budget-breakdown-card activities">
                <span className="budget-card-title">Activities</span>
                <span className="budget-card-amount">₹{activities.toLocaleString('en-IN')}</span>
                <span className="budget-card-pct">{pctActivities}% of total</span>
              </div>
              <div className="budget-breakdown-card misc">
                <span className="budget-card-title">Miscellaneous</span>
                <span className="budget-card-amount">₹{misc.toLocaleString('en-IN')}</span>
                <span className="budget-card-pct">{pctMisc}% of total</span>
              </div>
            </div>

            {/* Visual Progress Bar Chart */}
            <div className="budget-chart-wrapper">
              <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Visual Expense Share</h4>
              
              <div className="budget-chart-bar-group">
                {/* Transport Bar */}
                <div className="budget-chart-bar-row">
                  <div className="budget-chart-bar-info">
                    <span>Transportation</span>
                    <span>{pctTransport}%</span>
                  </div>
                  <div className="budget-chart-bar-track">
                    <div className="budget-chart-bar-fill" style={{ width: `${pctTransport}%` }}></div>
                  </div>
                </div>

                {/* Hotel Bar */}
                <div className="budget-chart-bar-row">
                  <div className="budget-chart-bar-info">
                    <span>Hotel & Accommodation</span>
                    <span>{pctHotel}%</span>
                  </div>
                  <div className="budget-chart-bar-track">
                    <div className="budget-chart-bar-fill hotel" style={{ width: `${pctHotel}%` }}></div>
                  </div>
                </div>

                {/* Food Bar */}
                <div className="budget-chart-bar-row">
                  <div className="budget-chart-bar-info">
                    <span>Food & Dining</span>
                    <span>{pctFood}%</span>
                  </div>
                  <div className="budget-chart-bar-track">
                    <div className="budget-chart-bar-fill food" style={{ width: `${pctFood}%` }}></div>
                  </div>
                </div>

                {/* Activities Bar */}
                <div className="budget-chart-bar-row">
                  <div className="budget-chart-bar-info">
                    <span>Activities & Sightseeing</span>
                    <span>{pctActivities}%</span>
                  </div>
                  <div className="budget-chart-bar-track">
                    <div className="budget-chart-bar-fill activities" style={{ width: `${pctActivities}%` }}></div>
                  </div>
                </div>

                {/* Misc Bar */}
                <div className="budget-chart-bar-row">
                  <div className="budget-chart-bar-info">
                    <span>Miscellaneous</span>
                    <span>{pctMisc}%</span>
                  </div>
                  <div className="budget-chart-bar-track">
                    <div className="budget-chart-bar-fill misc" style={{ width: `${pctMisc}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
