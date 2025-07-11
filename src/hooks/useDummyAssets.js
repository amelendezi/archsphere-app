import { useState, useEffect } from 'react';

const ASSETS_DATA = [
  { id: 'rotterdam', name: 'Rotterdam', content: 'This is the Rotterdam asset.' },
  { id: 'rheinland', name: 'Rheinland', content: 'This is the Rheinland asset.' },
];

const useDummyAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchAssets = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(ASSETS_DATA);
        }, 500); // Simulate network delay
      });
    };

    fetchAssets()
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const getAssetContent = (assetName) => {
    const asset = ASSETS_DATA.find(a => a.name === assetName);
    return asset ? asset.content : 'Asset not found.';
  };

  return { assets, loading, error, getAssetContent };
};

export default useDummyAssets;
