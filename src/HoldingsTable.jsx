import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [groupedHoldings, setGroupedHoldings] = useState({});
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    axios.get('https://canopy-frontend-task.now.sh/api/holdings')
      .then(response => {
        setHoldings(response.data.payload);
      })
      .catch(error => {
        console.error('Error fetching holdings:', error);
      });
  }, []);

  useEffect(() => {
    const grouped = holdings.reduce((acc, holding) => {
      const assetClass = holding.asset_class;
      if (!acc[assetClass]) {
        acc[assetClass] = [];
      }
      acc[assetClass].push(holding);
      return acc;
    }, {});
    setGroupedHoldings(grouped);

    
    if (Object.keys(grouped).length > 0 && activeGroup === null) {
      setActiveGroup(Object.keys(grouped)[0]);
    }
  }, [holdings, activeGroup]);

  const filterByAssetClass = (assetClass) => {
    setActiveGroup(assetClass === activeGroup ? null : assetClass);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#9fb9c9' }}>
      <div className="card border-primary mt-4">
        <div className="card-header bg-primary text-white"></div>
        <div className="card-body">
          {Object.keys(groupedHoldings).map(assetClass => (
            <div key={assetClass}>
              <div key={assetClass}>
                <button
                  className={`btn btn-${activeGroup === assetClass ? 'primary' : 'secondary'} btn-dynamic`}
                  onClick={() => filterByAssetClass(assetClass)}
                  style={{ borderBottom: '1px solid black' }} 
                >
                  {assetClass} ({groupedHoldings[assetClass].length})
                </button>
              </div>
              {activeGroup === assetClass && (
                <table className="table table-bordered mt-2">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>NAME OF HOLDING</th>
                      <th>TICKER</th>
                      <th>AVERAGE PRICE</th>
                      <th>MARKET PRICE</th>
                      <th>LATEST CHANGE PERCENTAGE</th>
                      <th>MARKET VALUE IN BASE CCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedHoldings[assetClass].map((holding, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#c8e5f7' : 'inherit' }}>
                        <td>{holding.name}</td>
                        <td>{holding.ticker}</td>
                        <td>{holding.avg_price}</td>
                        <td style={{ color: holding.market_price < 0 ? 'red' : 'inherit' }}>{holding.market_price}</td>
                        <td style={{ color: holding.latest_chg_pct < 0 ? 'red' : 'inherit' }}>{holding.latest_chg_pct.toFixed(2)}%</td>
                        <td>{holding.market_value_ccy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;
